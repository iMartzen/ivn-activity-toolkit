/* =========================================================
   Evaluatie module
   ========================================================= */

const ACTIVITEIT_TYPEN = [
  'Excursie', 'Lezing', 'Workshop', 'Workshop (licht)', 'Cursus',
  'Opleiding / vrijwilligerscursus', 'Informatieavond (leden)',
  'Activiteitenreeks', 'Werkgroepactiviteit', 'Werkgroeptraject (reeks)', 'Anders'
];

let evalAbort = new AbortController();

const evalState = {
  view: 'list',         // 'list' | 'form'
  editKey: null,
  expandedKey: null,
  form: {
    activiteitNaam: '',
    datum: IVN.dateStr(),
    type: 'Excursie',
    aanwezigen: '',
    begroot: '',
    werkelijk: '',
    watWerkte: '',
    watNiet: '',
    leads: '',
    beoordeling: 3
  }
};

function esc(s) { return IVN.ui.escapeHtml(s != null ? String(s) : ''); }

/* ---------------------------------------------------------
   Render dispatcher
--------------------------------------------------------- */
function render() {
  if (evalState.view === 'form') renderForm();
  else renderList();
}

/* ---------------------------------------------------------
   Lijst weergave
--------------------------------------------------------- */
function renderList() {
  evalAbort.abort();
  evalAbort = new AbortController();
  const sig = evalAbort.signal;
  const entries = IVN.store.list('ivn_evaluation_').sort((a, b) => {
    const da = a.data && a.data.datum ? a.data.datum : '';
    const db = b.data && b.data.datum ? b.data.datum : '';
    return db.localeCompare(da);
  });

  document.getElementById('appBody').innerHTML = `
    <div class="view-toggle" style="margin-bottom:20px">
      <button class="view-btn" id="toFormBtn">+ Nieuwe evaluatie</button>
      <button class="view-btn active">📋 Overzicht (${entries.length})</button>
      ${entries.length > 0 ? `<button class="smallbtn" id="exportAllBtn" style="margin-left:auto">↓ Exporteer alle evaluaties</button>` : ''}
    </div>

    ${entries.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>Nog geen evaluaties opgeslagen. Klik op "Nieuwe evaluatie" om te beginnen.</p>
      </div>
    ` : `
      <div class="eval-list">
        ${entries.map(e => renderEvalCard(e)).join('')}
      </div>
    `}
  `;

  document.getElementById('toFormBtn').addEventListener('click', () => {
    evalState.view = 'form';
    evalState.editKey = null;
    evalState.form = {
      activiteitNaam: '', datum: IVN.dateStr(), type: 'Excursie',
      aanwezigen: '', begroot: '', werkelijk: '',
      watWerkte: '', watNiet: '', leads: '', beoordeling: 3
    };
    render();
  }, { signal: sig });

  document.getElementById('exportAllBtn')?.addEventListener('click', exportAll, { signal: sig });

  // Card interactions
  document.getElementById('appBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-eval-action]');
    if (!btn) return;
    const action = btn.dataset.evalAction;
    const key = btn.dataset.key;

    if (action === 'toggle') {
      evalState.expandedKey = evalState.expandedKey === key ? null : key;
      render();
    } else if (action === 'edit') {
      const data = IVN.store.get(key);
      if (data) {
        evalState.form = Object.assign({}, data);
        evalState.editKey = key;
        evalState.view = 'form';
        render();
      }
    } else if (action === 'delete') {
      if (confirm('Weet je zeker dat je deze evaluatie wilt verwijderen?')) {
        IVN.store.remove(key);
        IVN.ui.showToast('Evaluatie verwijderd.');
        render();
      }
    }
  }, { signal: sig });
}

function renderEvalCard(entry) {
  const d = entry.data;
  if (!d) return '';
  const isExpanded = evalState.expandedKey === entry.key;
  const stars = buildStarsDisplay(d.beoordeling || 0);
  const budget = parseFloat(d.begroot) || 0;
  const actual = parseFloat(d.werkelijk) || 0;
  const diff = actual - budget;
  const diffStr = diff > 0 ? `+${IVN.ui.formatEuro(diff)}` : IVN.ui.formatEuro(diff);
  const diffColor = diff > 0 ? 'var(--error)' : 'var(--good)';

  return `
    <div class="eval-card${isExpanded ? ' expanded' : ''}">
      <div class="eval-card-header">
        <div>
          <div class="eval-card-title">${esc(d.activiteitNaam || '—')}</div>
          <div class="eval-card-meta">
            <span class="tag info">${esc(d.type || '—')}</span>
            ${d.datum ? `<span style="font-size:12px;color:var(--muted)">${IVN.ui.formatDate(d.datum)}</span>` : ''}
            ${d.aanwezigen ? `<span style="font-size:12px;color:var(--muted);margin-left:6px">👥 ${esc(d.aanwezigen)} aanwezig</span>` : ''}
          </div>
          <div style="margin-top:6px">${stars}</div>
        </div>
        <div class="crud-item-actions">
          <button class="smallbtn" data-eval-action="toggle" data-key="${esc(entry.key)}">${isExpanded ? '▲' : '▼ Details'}</button>
          <button class="smallbtn" data-eval-action="edit" data-key="${esc(entry.key)}">✏</button>
          <button class="smallbtn danger" data-eval-action="delete" data-key="${esc(entry.key)}">✕</button>
        </div>
      </div>
      <div class="eval-card-detail">
        <div style="display:grid;gap:10px;font-size:13px">
          <div style="display:flex;gap:24px;flex-wrap:wrap">
            <div>Begroot: ${IVN.ui.formatEuro(budget)}</div>
            <div>Werkelijk: ${IVN.ui.formatEuro(actual)}</div>
            <div>Verschil: <span style="color:${diffColor}">${diffStr}</span></div>
          </div>
          ${d.watWerkte ? `<div><strong>Wat werkte goed:</strong><br>${esc(d.watWerkte)}</div>` : ''}
          ${d.watNiet ? `<div><strong>Wat kon beter:</strong><br>${esc(d.watNiet)}</div>` : ''}
          ${d.leads ? `<div><strong>Leads / follow-up:</strong><br>${esc(d.leads)}</div>` : ''}
        </div>
      </div>
    </div>
  `;
}

function buildStarsDisplay(rating) {
  rating = parseInt(rating) || 0;
  let h = '';
  for (let i = 1; i <= 5; i++) {
    h += `<span style="color:${i <= rating ? 'var(--warn)' : 'rgba(255,255,255,0.2)'};font-size:16px">★</span>`;
  }
  return h;
}

/* ---------------------------------------------------------
   Formulier weergave
--------------------------------------------------------- */
function renderForm() {
  const d = evalState.form;
  const isEdit = !!evalState.editKey;

  document.getElementById('appBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap">
      <button class="view-btn" id="backListBtn">← Overzicht</button>
      <span style="font-size:14px;font-weight:600">${isEdit ? 'Evaluatie bewerken' : 'Nieuwe evaluatie'}</span>
    </div>

    <div class="section-title">Activiteit</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Naam activiteit <span class="required">*</span></label>
        <input class="form-input" id="ev_naam" value="${esc(d.activiteitNaam)}" placeholder="bijv. Lentewandeling Vrouwenakkers" />
      </div>
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input class="form-input" id="ev_datum" type="date" min="2020-01-01" max="2035-12-31" value="${esc(d.datum)}" />
      </div>
    </div>
    <div class="form-group" style="max-width:280px">
      <label class="form-label">Type activiteit</label>
      <select class="form-select" id="ev_type">
        ${ACTIVITEIT_TYPEN.map(t => `<option value="${esc(t)}" ${d.type === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
      </select>
    </div>

    <div class="section-title">Opkomst & Kosten</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Aantal aanwezigen</label>
        <input class="form-input" id="ev_aanw" type="number" min="0" value="${esc(d.aanwezigen)}" placeholder="0" style="max-width:120px" />
      </div>
      <div class="form-group">
        <label class="form-label">Begrote kosten (€)</label>
        <input class="form-input" id="ev_begr" type="number" min="0" step="0.01" value="${esc(d.begroot)}" placeholder="0" style="max-width:140px" />
      </div>
      <div class="form-group">
        <label class="form-label">Werkelijke kosten (€)</label>
        <input class="form-input" id="ev_werk" type="number" min="0" step="0.01" value="${esc(d.werkelijk)}" placeholder="0" style="max-width:140px" />
      </div>
    </div>

    <div class="section-title">Evaluatie</div>
    <div class="form-group">
      <label class="form-label">Wat werkte goed?</label>
      <textarea class="form-textarea" id="ev_good" placeholder="Beschrijf wat goed ging: organisatie, inhoud, opkomst…">${esc(d.watWerkte)}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Wat kon beter?</label>
      <textarea class="form-textarea" id="ev_bad" placeholder="Beschrijf verbeterpunten…">${esc(d.watNiet)}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Leads &amp; follow-up (nieuwe leden, vrijwilligers, etc.)</label>
      <textarea class="form-textarea" id="ev_leads" placeholder="bijv. 2 potentiële nieuwe vrijwilligers aangesproken, 1 nieuw lid aangemeld">${esc(d.leads)}</textarea>
    </div>

    <div class="section-title">Overall beoordeling</div>
    <div class="star-rating" id="starRating">
      ${[1,2,3,4,5].map(i => `
        <span class="star${i <= d.beoordeling ? ' filled' : ''}" data-star="${i}">★</span>
      `).join('')}
    </div>
    <div style="font-size:12px;color:var(--muted);margin-top:6px" id="starLabel">${starLabel(d.beoordeling)}</div>

    <div class="controls" style="margin-top:20px">
      <button class="smallbtn primary" id="saveEvalBtn">✓ Opslaan</button>
      <button class="smallbtn" id="cancelEvalBtn">Annuleren</button>
    </div>
  `;

  // Star rating
  document.getElementById('starRating').addEventListener('click', e => {
    const star = e.target.closest('[data-star]');
    if (!star) return;
    evalState.form.beoordeling = parseInt(star.dataset.star);
    document.querySelectorAll('.star').forEach((s, i) => {
      s.classList.toggle('filled', i < evalState.form.beoordeling);
    });
    document.getElementById('starLabel').textContent = starLabel(evalState.form.beoordeling);
  });

  document.getElementById('backListBtn').addEventListener('click', () => { evalState.view = 'list'; render(); });
  document.getElementById('cancelEvalBtn').addEventListener('click', () => { evalState.view = 'list'; render(); });

  document.getElementById('saveEvalBtn').addEventListener('click', () => {
    const naam = document.getElementById('ev_naam').value.trim();
    if (!naam) {
      document.getElementById('ev_naam').classList.add('error');
      document.getElementById('ev_naam').focus();
      return;
    }

    const data = {
      activiteitNaam: naam,
      datum: document.getElementById('ev_datum').value,
      type: document.getElementById('ev_type').value,
      aanwezigen: document.getElementById('ev_aanw').value,
      begroot: document.getElementById('ev_begr').value,
      werkelijk: document.getElementById('ev_werk').value,
      watWerkte: document.getElementById('ev_good').value,
      watNiet: document.getElementById('ev_bad').value,
      leads: document.getElementById('ev_leads').value,
      beoordeling: evalState.form.beoordeling,
      createdAt: evalState.editKey
        ? (IVN.store.get(evalState.editKey) || {}).createdAt || new Date().toISOString()
        : new Date().toISOString()
    };

    const key = evalState.editKey || ('ivn_evaluation_' + Date.now());
    IVN.store.set(key, data);
    IVN.ui.showToast(evalState.editKey ? 'Evaluatie bijgewerkt!' : 'Evaluatie opgeslagen!');
    evalState.view = 'list';
    evalState.editKey = null;
    render();
  });
}

function starLabel(n) {
  const labels = ['', 'Slecht', 'Matig', 'Redelijk', 'Goed', 'Uitstekend'];
  return labels[n] || '';
}

/* ---------------------------------------------------------
   Export all
--------------------------------------------------------- */
function exportAll() {
  const entries = IVN.store.list('ivn_evaluation_').sort((a, b) => {
    const da = a.data && a.data.datum ? a.data.datum : '';
    const db = b.data && b.data.datum ? b.data.datum : '';
    return db.localeCompare(da);
  });

  let md = `# Evaluaties — IVN Werkgroep\n\n`;
  md += `*Geëxporteerd op ${new Date().toLocaleDateString('nl-NL')} · ${entries.length} evaluatie(s)*\n\n---\n\n`;

  entries.forEach(e => {
    const d = e.data;
    if (!d) return;
    const stars = '★'.repeat(d.beoordeling || 0) + '☆'.repeat(5 - (d.beoordeling || 0));
    md += `## ${d.activiteitNaam || '—'}\n\n`;
    md += `- **Datum:** ${d.datum ? IVN.ui.formatDate(d.datum) : '—'}\n`;
    md += `- **Type:** ${d.type || '—'}\n`;
    md += `- **Aanwezigen:** ${d.aanwezigen || '—'}\n`;
    md += `- **Begroting:** € ${parseFloat(d.begroot||0).toFixed(2)} — Werkelijk: € ${parseFloat(d.werkelijk||0).toFixed(2)}\n`;
    md += `- **Beoordeling:** ${stars} (${d.beoordeling || 0}/5)\n\n`;
    if (d.watWerkte) md += `**Wat werkte goed:**\n${d.watWerkte}\n\n`;
    if (d.watNiet) md += `**Wat kon beter:**\n${d.watNiet}\n\n`;
    if (d.leads) md += `**Leads / follow-up:**\n${d.leads}\n\n`;
    md += `---\n\n`;
  });

  IVN.exportMarkdown('evaluaties.md', md);
  IVN.ui.showToast('Evaluaties geëxporteerd!');
}

// Initial render
render();
