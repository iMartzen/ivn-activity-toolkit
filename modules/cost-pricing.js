/* =========================================================
   Kostprijs & Prijsbeleid module
   ========================================================= */

const cpState = {
  activiteitNaam: '',
  zaal: 0,
  materialen: 0,
  spreker: 0,
  overig: 0,
  uren: 0,
  uurtarief: 15,
  onvoorzienPct: 10,
  ledenmargeA: 50,   // % van kostprijs voor scenario A
  margeC: 15         // % winstmarge voor scenario C
};

function esc(s) { return IVN.ui.escapeHtml(s != null ? String(s) : ''); }

/* ---------------------------------------------------------
   Berekeningen
--------------------------------------------------------- */
function bereken() {
  const directeKosten = cpState.zaal + cpState.materialen + cpState.spreker + cpState.overig;
  const urenKosten = cpState.uren * cpState.uurtarief;
  const subtotaal = directeKosten + urenKosten;
  const onvoorzienBedrag = subtotaal * (cpState.onvoorzienPct / 100);
  const kostprijs = subtotaal + onvoorzienBedrag;

  const breaks = [10, 20, 30];
  const scenarios = breaks.map(n => {
    const ppKostendekkend = n > 0 ? kostprijs / n : 0;
    const ppLedenwaarde   = ppKostendekkend * (cpState.ledenmargeA / 100);
    const ppInkomsten     = ppKostendekkend * (1 + cpState.margeC / 100);
    return { n, ppKostendekkend, ppLedenwaarde, ppInkomsten };
  });

  return { directeKosten, urenKosten, subtotaal, onvoorzienBedrag, kostprijs, scenarios };
}

/* ---------------------------------------------------------
   Render
--------------------------------------------------------- */
function render() {
  const res = bereken();

  document.getElementById('appBody').innerHTML = `
    <div class="section-title">Activiteit</div>
    <div class="form-group">
      <label class="form-label">Naam activiteit</label>
      <input class="form-input" id="activiteitNaam" value="${esc(cpState.activiteitNaam)}" placeholder="bijv. Vlinderwerkshop Midden-Holland" style="max-width:440px" />
    </div>

    <div class="section-title">Directe kosten</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Zaalkosten (€)</label>
        <input class="form-input cp-field" data-field="zaal" type="number" min="0" step="0.01" value="${esc(cpState.zaal || '')}" placeholder="0" />
      </div>
      <div class="form-group">
        <label class="form-label">Materialen (€)</label>
        <input class="form-input cp-field" data-field="materialen" type="number" min="0" step="0.01" value="${esc(cpState.materialen || '')}" placeholder="0" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Sprekerkosten (€)</label>
        <input class="form-input cp-field" data-field="spreker" type="number" min="0" step="0.01" value="${esc(cpState.spreker || '')}" placeholder="0" />
      </div>
      <div class="form-group">
        <label class="form-label">Overig (€)</label>
        <input class="form-input cp-field" data-field="overig" type="number" min="0" step="0.01" value="${esc(cpState.overig || '')}" placeholder="0" />
      </div>
    </div>

    <div class="section-title">Vrijwilligersuren</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Aantal uren</label>
        <input class="form-input cp-field" data-field="uren" type="number" min="0" step="0.5" value="${esc(cpState.uren || '')}" placeholder="0" />
      </div>
      <div class="form-group">
        <label class="form-label">Uurtarief (€) — richtlijn € 15</label>
        <input class="form-input cp-field" data-field="uurtarief" type="number" min="0" step="1" value="${esc(cpState.uurtarief)}" placeholder="15" />
      </div>
    </div>
    <div class="hint" style="margin-top:0;margin-bottom:16px">Registreer uren voor transparantie. Doorberekenen is optioneel — de kostprijs toont de echte inspanning.</div>

    <div class="section-title">Onvoorzien &amp; scenario-instellingen</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Onvoorzien (%)</label>
        <input class="form-input cp-field" data-field="onvoorzienPct" type="number" min="0" max="50" step="1" value="${esc(cpState.onvoorzienPct)}" placeholder="10" />
      </div>
      <div class="form-group">
        <label class="form-label">Scenario A — ledenwaarde (%)</label>
        <input class="form-input cp-field" data-field="ledenmargeA" type="number" min="0" max="100" step="5" value="${esc(cpState.ledenmargeA)}" placeholder="50" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Scenario C — winstmarge (%)</label>
        <input class="form-input cp-field" data-field="margeC" type="number" min="0" max="100" step="5" value="${esc(cpState.margeC)}" placeholder="15" />
      </div>
    </div>

    <div class="section-title">Kostprijsoverzicht</div>
    <div style="background:rgba(0,0,0,0.18);border-radius:12px;padding:16px;margin-bottom:18px">
      <div style="display:grid;gap:6px;font-size:14px">
        <div style="display:flex;justify-content:space-between">
          <span>Directe kosten</span><span data-cp="directeKosten">${IVN.ui.formatEuro(res.directeKosten)}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span>Vrijwilligersuren (${esc(cpState.uren)} × ${IVN.ui.formatEuro(cpState.uurtarief)})</span><span data-cp="urenKosten">${IVN.ui.formatEuro(res.urenKosten)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;color:var(--muted)">
          <span>Onvoorzien (${esc(cpState.onvoorzienPct)}%)</span><span data-cp="onvoorzienBedrag">${IVN.ui.formatEuro(res.onvoorzienBedrag)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:700;border-top:1px solid var(--border);padding-top:10px;margin-top:4px">
          <span>Totale kostprijs</span><span data-cp="kostprijs" style="color:var(--accent)">${IVN.ui.formatEuro(res.kostprijs)}</span>
        </div>
      </div>
    </div>

    <div class="section-title">Break-even &amp; scenario's per deelnemer</div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Deelnemers</th>
            <th>Scenario A — Ledenwaarde (${esc(cpState.ledenmargeA)}%)</th>
            <th>Scenario B — Kostendekkend</th>
            <th>Scenario C — Inkomsten (+${esc(cpState.margeC)}%)</th>
          </tr>
        </thead>
        <tbody>
          ${res.scenarios.map(s => `
            <tr>
              <td>${s.n} pers.</td>
              <td class="num">${IVN.ui.formatEuro(s.ppLedenwaarde)}<span style="color:var(--muted);font-size:11px;display:block">p.p.</span></td>
              <td class="num highlight">${IVN.ui.formatEuro(s.ppKostendekkend)}<span style="color:var(--muted);font-size:11px;display:block">p.p.</span></td>
              <td class="num">${IVN.ui.formatEuro(s.ppInkomsten)}<span style="color:var(--muted);font-size:11px;display:block">p.p.</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section-title" style="margin-top:20px">Communicatietekst (kopieerbaar)</div>
    <div class="output-block" id="commText">${buildCommText(res)}</div>

    <div class="controls" style="margin-top:16px">
      <button class="smallbtn" id="copyCommBtn">⧉ Kopieer communicatietekst</button>
      <button class="smallbtn primary" id="exportCpBtn">↓ Exporteer Markdown</button>
      <button class="smallbtn primary" id="saveCpBtn">✓ Opslaan</button>
    </div>
  `;

  // Bind all input fields
  document.querySelectorAll('.cp-field').forEach(el => {
    el.addEventListener('input', e => {
      const field = e.target.dataset.field;
      const raw = e.target.value;
      if (['zaal','materialen','spreker','overig','uren','uurtarief','onvoorzienPct','ledenmargeA','margeC'].includes(field)) {
        cpState[field] = parseFloat(raw) || 0;
      }
      updateLiveResults();
    });
  });

  document.getElementById('activiteitNaam').addEventListener('input', e => {
    cpState.activiteitNaam = e.target.value;
  });

  document.getElementById('copyCommBtn').addEventListener('click', () => {
    IVN.copyText(document.getElementById('commText').textContent);
  });
  document.getElementById('exportCpBtn').addEventListener('click', exportCostPricing);
  document.getElementById('saveCpBtn').addEventListener('click', saveCostPricing);
}

function updateLiveResults() {
  const res = bereken();

  // Update kostprijsoverzicht items
  const overviewItems = document.querySelectorAll('[data-live]');
  // Re-render the results section only
  const tableWrap = document.querySelector('.table-wrapper');
  if (tableWrap) {
    const s = res.scenarios;
    tableWrap.querySelector('tbody').innerHTML = s.map(sc => `
      <tr>
        <td>${sc.n} pers.</td>
        <td class="num">${IVN.ui.formatEuro(sc.ppLedenwaarde)}<span style="color:var(--muted);font-size:11px;display:block">p.p.</span></td>
        <td class="num highlight">${IVN.ui.formatEuro(sc.ppKostendekkend)}<span style="color:var(--muted);font-size:11px;display:block">p.p.</span></td>
        <td class="num">${IVN.ui.formatEuro(sc.ppInkomsten)}<span style="color:var(--muted);font-size:11px;display:block">p.p.</span></td>
      </tr>
    `).join('');

    // Update totals block
    const cpFields = { directeKosten: res.directeKosten, urenKosten: res.urenKosten, onvoorzienBedrag: res.onvoorzienBedrag, kostprijs: res.kostprijs };
    Object.entries(cpFields).forEach(([key, val]) => {
      const el = document.querySelector(`[data-cp="${key}"]`);
      if (el) el.textContent = IVN.ui.formatEuro(val);
    });

    // Update comm text
    const commEl = document.getElementById('commText');
    if (commEl) commEl.textContent = buildCommText(res);
  }
}

function buildCommText(res) {
  const naam = cpState.activiteitNaam || 'deze activiteit';
  const kp20 = res.scenarios.find(s => s.n === 20);
  if (!kp20) return '';
  const prijs = kp20.ppKostendekkend;
  if (prijs < 1) {
    return `${naam} is gratis toegankelijk voor leden en publiek. De kosten worden gedragen door de werkgroepbegroting van IVN.`;
  }
  return `Voor ${naam} vragen wij een bijdrage van ${IVN.ui.formatEuro(prijs)} per persoon (bij 20 deelnemers). ` +
    `Dit dekt de directe kosten (zaal, materialen, begeleiding). ` +
    `Leden van IVN krijgen voorrang bij aanmelding. Neem contact op voor vragen over vergoedingen.`;
}

function exportCostPricing() {
  const res = bereken();
  const naam = cpState.activiteitNaam || 'activiteit';
  let md = `# Kostenoverzicht: ${naam}\n\n`;
  md += `*Gegenereerd op ${new Date().toLocaleDateString('nl-NL')}*\n\n---\n\n`;
  md += `## Kostenopbouw\n\n`;
  md += `| Post | Bedrag |\n|---|---|\n`;
  md += `| Zaalkosten | € ${cpState.zaal.toFixed(2)} |\n`;
  md += `| Materialen | € ${cpState.materialen.toFixed(2)} |\n`;
  md += `| Sprekerkosten | € ${cpState.spreker.toFixed(2)} |\n`;
  md += `| Overig | € ${cpState.overig.toFixed(2)} |\n`;
  md += `| Vrijwilligersuren (${cpState.uren} × €${cpState.uurtarief}) | € ${res.urenKosten.toFixed(2)} |\n`;
  md += `| Onvoorzien (${cpState.onvoorzienPct}%) | € ${res.onvoorzienBedrag.toFixed(2)} |\n`;
  md += `| **Totale kostprijs** | **€ ${res.kostprijs.toFixed(2)}** |\n\n`;
  md += `## Scenario's per deelnemer\n\n`;
  md += `| Deelnemers | Scenario A (Ledenwaarde ${cpState.ledenmargeA}%) | Scenario B (Kostendekkend) | Scenario C (Inkomsten +${cpState.margeC}%) |\n|---|---|---|---|\n`;
  res.scenarios.forEach(s => {
    md += `| ${s.n} | € ${s.ppLedenwaarde.toFixed(2)} | € ${s.ppKostendekkend.toFixed(2)} | € ${s.ppInkomsten.toFixed(2)} |\n`;
  });
  md += `\n## Communicatietekst\n\n${buildCommText(res)}\n`;

  IVN.exportMarkdown(`kostprijs-${naam.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`, md);
  IVN.ui.showToast('Kostenoverzicht geëxporteerd!');
}

function saveCostPricing() {
  const res = bereken();
  IVN.store.set('ivn_costpricing_' + Date.now(), {
    activiteitNaam: cpState.activiteitNaam,
    directeKosten: { zaal: cpState.zaal, materialen: cpState.materialen, spreker: cpState.spreker, overig: cpState.overig },
    uren: cpState.uren,
    uurtarief: cpState.uurtarief,
    onvoorzienPct: cpState.onvoorzienPct,
    kostprijs: res.kostprijs,
    scenarios: res.scenarios,
    createdAt: new Date().toISOString()
  });
  IVN.ui.showToast('Kostprijsberekening opgeslagen!');
}

// Initial render
render();
