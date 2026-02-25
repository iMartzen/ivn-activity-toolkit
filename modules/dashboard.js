/* =========================================================
   Dashboard module
   ========================================================= */

function loadData() {
  const activities   = IVN.store.list('ivn_activity_');
  const yearplans    = IVN.store.list('ivn_yearplan_');
  const evaluations  = IVN.store.list('ivn_evaluation_');
  const knowledge    = IVN.store.list('ivn_knowledge_');
  const partners     = IVN.store.list('ivn_partner_');
  const health       = IVN.store.list('ivn_health_');
  const costpricings = IVN.store.list('ivn_costpricing_');

  const totalDeelnemers = evaluations.reduce((s, e) => s + (parseInt((e.data || {}).aanwezigen) || 0), 0);
  const lastHealth = health.length > 0 ? health[0].data : null;

  // Activiteiten per maand (uit evaluaties)
  const byMonth = {};
  evaluations.forEach(e => {
    const datum = (e.data || {}).datum;
    if (!datum) return;
    const key = datum.slice(0, 7); // YYYY-MM
    byMonth[key] = (byMonth[key] || 0) + 1;
  });

  // Ook activiteitskaarten per maand
  activities.forEach(a => {
    const ts = a._ts;
    if (!ts) return;
    const d = new Date(ts);
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    byMonth[key] = (byMonth[key] || 0) + 1;
  });

  const byMonthSorted = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).slice(-12);

  return {
    activities, yearplans, evaluations, knowledge, partners, health, costpricings,
    totalDeelnemers, lastHealth, byMonthSorted,
    recentEvals: evaluations.slice(0, 5)
  };
}

function esc(s) { return IVN.ui.escapeHtml(s != null ? String(s) : ''); }

/* ---------------------------------------------------------
   Canvas bar chart
--------------------------------------------------------- */
function drawChart(canvas, byMonthSorted) {
  try {
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) { canvas.parentElement.textContent = 'Grafiek niet beschikbaar in deze browser.'; return; }

    const W = canvas.parentElement.offsetWidth - 32;
    const H = 160;
    canvas.width = W;
    canvas.height = H;

    if (byMonthSorted.length === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      ctx.font = '13px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Geen activiteitendata beschikbaar', W / 2, H / 2);
      return;
    }

    const maxVal = Math.max(...byMonthSorted.map(([, v]) => v), 1);
    const padding = { top: 16, right: 8, bottom: 36, left: 28 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const barW = Math.max(8, (chartW / byMonthSorted.length) - 6);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + chartH - (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round((i / 4) * maxVal), padding.left - 4, y + 4);
    }

    // Bars
    byMonthSorted.forEach(([month, val], i) => {
      const x = padding.left + i * (chartW / byMonthSorted.length) + ((chartW / byMonthSorted.length) - barW) / 2;
      const barH = (val / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, 'rgba(122,182,72,0.90)');
      grad.addColorStop(1, 'rgba(122,182,72,0.35)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]) : ctx.rect(x, y, barW, barH);
      ctx.fill();

      // Month label
      const label = month.slice(5); // MM
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + barW / 2, H - padding.bottom + 14);
    });
  } catch (err) {
    console.warn('Chart render error:', err);
  }
}

/* ---------------------------------------------------------
   Render
--------------------------------------------------------- */
function render() {
  const d = loadData();

  document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString('nl-NL');

  const healthScoreStr = d.lastHealth
    ? `${d.lastHealth.totalScore} / ${d.lastHealth.maxScore}`
    : '—';

  document.getElementById('appBody').innerHTML = `
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon">🌿</div>
        <div class="stat-val">${d.activities.length}</div>
        <div class="stat-label">Activiteiten geclassificeerd</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-val">${d.totalDeelnemers}</div>
        <div class="stat-label">Totaal deelnemers (evaluaties)</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🗓</div>
        <div class="stat-val">${d.yearplans.length}</div>
        <div class="stat-label">Jaarplannen opgeslagen</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💚</div>
        <div class="stat-val" style="font-size:${d.lastHealth ? '22px' : '32px'}">${esc(healthScoreStr)}</div>
        <div class="stat-label">Laatste gezondheidscore</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🤝</div>
        <div class="stat-val">${d.partners.length}</div>
        <div class="stat-label">Partners in intake</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-val">${d.knowledge.length}</div>
        <div class="stat-label">Kennisdragers</div>
      </div>
    </div>

    <div class="body" style="padding-top:0">
      ${d.byMonthSorted.length > 0 ? `
        <div class="section-title">Activiteiten per maand (laatste 12)</div>
        <div class="chart-wrap">
          <canvas id="actChart"></canvas>
        </div>
      ` : ''}

      ${d.recentEvals.length > 0 ? `
        <div class="section-title" style="margin-top:20px">Recente evaluaties</div>
        <div class="eval-list">
          ${d.recentEvals.map(e => {
            const ev = e.data || {};
            const stars = '★'.repeat(ev.beoordeling || 0) + '☆'.repeat(5 - (ev.beoordeling || 0));
            return `
              <div class="eval-card">
                <div class="eval-card-header">
                  <div>
                    <div class="eval-card-title">${esc(ev.activiteitNaam || '—')}</div>
                    <div class="eval-card-meta">
                      <span class="tag info">${esc(ev.type || '—')}</span>
                      ${ev.datum ? `<span style="font-size:12px;color:var(--muted);margin-left:6px">${IVN.ui.formatDate(ev.datum)}</span>` : ''}
                      ${ev.aanwezigen ? `<span style="font-size:12px;color:var(--muted);margin-left:6px">👥 ${esc(ev.aanwezigen)}</span>` : ''}
                      <span style="font-size:14px;color:var(--warn);margin-left:6px">${stars}</span>
                    </div>
                  </div>
                  <a class="smallbtn" href="./evaluation.html" style="text-decoration:none;font-size:12px">Bekijk alle →</a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="empty-state" style="padding:24px">
          <p>Nog geen evaluaties opgeslagen. <a href="./evaluation.html">Voeg de eerste toe →</a></p>
        </div>
      `}

      <div class="controls" style="margin-top:20px">
        <button class="smallbtn primary" id="exportRapportBtn">↓ Exporteer maandrapport (Markdown)</button>
        <button class="smallbtn" id="refreshBtn">↺ Vernieuwen</button>
      </div>
    </div>

    <div class="backup-section">
      <p>Data wordt lokaal opgeslagen in je browser. Maak regelmatig een backup.</p>
      <button class="smallbtn primary" id="exportJsonBtn">⬇ Exporteer backup (JSON)</button>
      <label class="smallbtn" style="cursor:pointer">
        ⬆ Herstel backup
        <input type="file" id="importFile" accept=".json" style="display:none">
      </label>
      <button class="smallbtn danger" id="resetBtn">✕ Reset alle data</button>
    </div>
  `;

  // Draw chart
  const canvas = document.getElementById('actChart');
  if (canvas) drawChart(canvas, d.byMonthSorted);

  // Buttons
  document.getElementById('exportRapportBtn').addEventListener('click', () => exportRapport(d));
  document.getElementById('refreshBtn').addEventListener('click', render);
  document.getElementById('exportJsonBtn').addEventListener('click', () => IVN.exportJSON());
  document.getElementById('importFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    IVN.importJSON(file, () => setTimeout(render, 600));
    e.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => IVN.resetAll());
}

/* ---------------------------------------------------------
   Maandrapport export
--------------------------------------------------------- */
function exportRapport(d) {
  const now = new Date();
  const maand = now.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

  let md = `# IVN S&B — Maandrapport ${maand}\n\n`;
  md += `*Gegenereerd op ${now.toLocaleDateString('nl-NL')}*\n\n---\n\n`;
  md += `## Statistieken\n\n`;
  md += `| Categorie | Waarde |\n|---|---|\n`;
  md += `| Activiteiten geclassificeerd | ${d.activities.length} |\n`;
  md += `| Totaal deelnemers (evaluaties) | ${d.totalDeelnemers} |\n`;
  md += `| Jaarplannen | ${d.yearplans.length} |\n`;
  md += `| Kennisdragers | ${d.knowledge.length} |\n`;
  md += `| Partners in intake | ${d.partners.length} |\n`;
  md += `| Evaluaties | ${d.evaluations.length} |\n`;
  if (d.lastHealth) {
    md += `| Laatste gezondheidscore | ${d.lastHealth.totalScore} / ${d.lastHealth.maxScore} |\n`;
  }
  md += `\n## Recente evaluaties\n\n`;
  if (d.recentEvals.length > 0) {
    d.recentEvals.forEach(e => {
      const ev = e.data || {};
      md += `- **${ev.activiteitNaam || '—'}** (${ev.datum ? IVN.ui.formatDate(ev.datum) : '—'}) — ${ev.aanwezigen || 0} aanwezig — ${ev.beoordeling || 0}/5 sterren\n`;
    });
  } else {
    md += `*(geen evaluaties)*\n`;
  }

  if (d.byMonthSorted.length > 0) {
    md += `\n## Activiteiten per maand\n\n`;
    md += `| Maand | Aantal |\n|---|---|\n`;
    d.byMonthSorted.forEach(([month, count]) => {
      md += `| ${month} | ${count} |\n`;
    });
  }

  IVN.exportMarkdown(`maandrapport-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}.md`, md);
  IVN.ui.showToast('Maandrapport geëxporteerd!');
}

// Initial render
render();
