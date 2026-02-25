/* =========================================================
   Jaarplan Wizard — 6 stappen
   ========================================================= */

const IVN_DOELEN = [
  { id: 'natuurbeleving', label: 'Natuurbeleving', desc: 'Activiteiten die mensen in contact brengen met de natuur' },
  { id: 'educatie', label: 'Natuur-educatie', desc: 'Kennisoverdracht over natuur, soorten en ecologie' },
  { id: 'duurzaamheid', label: 'Duurzaamheid', desc: 'Maatschappelijke impact en duurzame initiatieven' },
  { id: 'gezondheid', label: 'Gezondheid', desc: 'Natuur als bijdrage aan welzijn en gezondheid' }
];

const ACTIVITEIT_TYPEN = [
  'Excursie', 'Lezing', 'Workshop', 'Workshop (licht)', 'Cursus',
  'Opleiding / vrijwilligerscursus', 'Informatieavond (leden)',
  'Activiteitenreeks', 'Werkgroepactiviteit', 'Werkgroeptraject (reeks)', 'Anders'
];

const STAP_LABELS = [
  'Werkgroep', 'Doelen', 'Kennisproducten', 'Agenda', 'Begroting', 'Review'
];

// Wizard state
const wizard = {
  step: 0,
  data: {
    werkgroepNaam: '',
    locatie: '',
    jaar: new Date().getFullYear() + 1,
    coordinator1: { naam: '', email: '' },
    coordinator2: { naam: '', email: '' },
    doelen: [],
    doelToelichting: '',
    kennisproducten: [],
    agenda: [],
    begroting: { inkomsten: [], uitgaven: [] },
    opmerkingen: ''
  }
};

// DOM refs
const stepsBar  = document.getElementById('stepsBar');
const body      = document.getElementById('wizardBody');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const restartBtn= document.getElementById('restartBtn');
const stepPill  = document.getElementById('stepPill');

/* ---------------------------------------------------------
   Steps bar render
--------------------------------------------------------- */
function renderStepsBar() {
  stepsBar.innerHTML = '';
  STAP_LABELS.forEach((label, i) => {
    const el = document.createElement('div');
    el.className = 'wizard-step' +
      (i < wizard.step ? ' done' : '') +
      (i === wizard.step ? ' active' : '');
    el.innerHTML = `<div class="step-num">${i < wizard.step ? '✓' : i + 1}</div><span>${label}</span>`;
    stepsBar.appendChild(el);
  });
  stepPill.textContent = `Stap ${wizard.step + 1} / 6`;
}

/* ---------------------------------------------------------
   Step renders
--------------------------------------------------------- */
function renderStep0() {
  const d = wizard.data;
  return `
    <div class="section-title">Werkgroep informatie</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Werkgroep naam <span class="required">*</span></label>
        <input class="form-input" name="werkgroepNaam" value="${esc(d.werkgroepNaam)}" placeholder="bijv. Werkgroep Vogels Midden-Holland" />
      </div>
      <div class="form-group">
        <label class="form-label">Locatie / regio</label>
        <input class="form-input" name="locatie" value="${esc(d.locatie)}" placeholder="bijv. Leiden" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Jaarplan voor jaar <span class="required">*</span></label>
      <input class="form-input input-narrow" name="jaar" type="number" min="2024" max="2035" value="${esc(d.jaar)}" />
    </div>

    <div class="section-title">Coördinatoren</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Coördinator inhoud — naam <span class="required">*</span></label>
        <input class="form-input" name="coord1naam" value="${esc(d.coordinator1.naam)}" placeholder="Naam" />
      </div>
      <div class="form-group">
        <label class="form-label">Coördinator inhoud — e-mail</label>
        <input class="form-input" name="coord1email" type="email" value="${esc(d.coordinator1.email)}" placeholder="naam@email.nl" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Coördinator organisatie — naam <span class="required">*</span></label>
        <input class="form-input" name="coord2naam" value="${esc(d.coordinator2.naam)}" placeholder="Naam" />
      </div>
      <div class="form-group">
        <label class="form-label">Coördinator organisatie — e-mail</label>
        <input class="form-input" name="coord2email" type="email" value="${esc(d.coordinator2.email)}" placeholder="naam@email.nl" />
      </div>
    </div>
  `;
}

function renderStep1() {
  const d = wizard.data;
  return `
    <div class="section-title">IVN Doelen ${esc(d.jaar)}</div>
    <p class="node-text" style="margin-bottom:14px">Selecteer de doelen die van toepassing zijn op de activiteiten van deze werkgroep dit jaar.</p>
    <div class="checkbox-group">
      ${IVN_DOELEN.map(doel => `
        <label class="checkbox-label">
          <input type="checkbox" name="doel_${doel.id}" ${d.doelen.includes(doel.id) ? 'checked' : ''} />
          <div>
            <strong>${esc(doel.label)}</strong>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${esc(doel.desc)}</div>
          </div>
        </label>
      `).join('')}
    </div>
    <div class="form-group" style="margin-top:20px">
      <label class="form-label">Toelichting op doelen</label>
      <textarea class="form-textarea" name="doelToelichting" placeholder="Beschrijf in 2–3 zinnen hoe de werkgroep dit jaar bijdraagt aan deze doelen…">${esc(d.doelToelichting)}</textarea>
    </div>
  `;
}

function renderStep2() {
  const d = wizard.data;
  const list = d.kennisproducten.map((kp, i) => `
    <div class="dynamic-item" data-index="${i}">
      <div class="item-fields">
        <div class="form-row">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Titel</label>
            <input class="form-input" data-kp="${i}" data-field="titel" value="${esc(kp.titel)}" placeholder="bijv. Vlindergids Son & Breugel" />
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Type</label>
            <input class="form-input" data-kp="${i}" data-field="type" value="${esc(kp.type)}" placeholder="bijv. PDF veldgids, video, cursusmateriaal" />
          </div>
        </div>
        <div class="form-row" style="margin-top:8px">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Doelgroep</label>
            <input class="form-input" data-kp="${i}" data-field="doelgroep" value="${esc(kp.doelgroep)}" placeholder="bijv. Leden + publiek" />
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Verantwoordelijke</label>
            <input class="form-input" data-kp="${i}" data-field="wie" value="${esc(kp.wie || '')}" placeholder="Naam coördinator" />
          </div>
        </div>
      </div>
      <button type="button" class="item-remove" data-remove-kp="${i}" title="Verwijder">×</button>
    </div>
  `).join('');

  return `
    <div class="section-title">Kennisproducten (max 3)</div>
    <p class="node-text" style="margin-bottom:14px">Producten die de werkgroep dit jaar maakt of bijwerkt: gidsen, materialen, handleidingen, video's, etc.</p>
    <div class="dynamic-list" id="kpList">${list}</div>
    ${d.kennisproducten.length < 3 ? `<button type="button" class="smallbtn" id="addKpBtn">+ Kennisproduct toevoegen</button>` : ''}
  `;
}

function renderStep3() {
  const d = wizard.data;
  const rows = d.agenda.map((item, i) => `
    <div class="dynamic-item" data-index="${i}">
      <div class="item-fields">
        <div class="form-row">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Datum / maand</label>
            <input class="form-input" type="month" min="2020-01" max="2035-12" data-ag="${i}" data-field="datum" value="${esc(item.datum)}" />
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Type activiteit</label>
            <select class="form-select" data-ag="${i}" data-field="type">
              ${ACTIVITEIT_TYPEN.map(t => `<option value="${esc(t)}" ${item.type === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-row" style="margin-top:8px">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Doelgroep</label>
            <input class="form-input" data-ag="${i}" data-field="doelgroep" value="${esc(item.doelgroep)}" placeholder="Leden + publiek" />
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Max. deelnemers</label>
            <input class="form-input" type="number" data-ag="${i}" data-field="capaciteit" value="${esc(item.capaciteit || '')}" placeholder="20" style="max-width:100px" />
          </div>
        </div>
      </div>
      <button type="button" class="item-remove" data-remove-ag="${i}" title="Verwijder">×</button>
    </div>
  `).join('');

  return `
    <div class="section-title">Activiteitenagenda</div>
    <p class="node-text" style="margin-bottom:14px">Voeg de geplande activiteiten voor dit jaar toe. Je kunt altijd wijzigen.</p>
    <div class="dynamic-list" id="agendaList">${rows}</div>
    <button type="button" class="smallbtn" id="addAgBtn">+ Activiteit toevoegen</button>
  `;
}

function renderStep4() {
  const d = wizard.data;

  const inkomstenRows = d.begroting.inkomsten.map((item, i) => `
    <div class="dynamic-item" data-index="${i}">
      <div class="item-fields">
        <div class="form-row">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Omschrijving</label>
            <input class="form-input" data-ink="${i}" data-field="beschrijving" value="${esc(item.beschrijving)}" placeholder="bijv. Bijdragen deelnemers" />
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Bedrag (€)</label>
            <input class="form-input" type="number" min="0" step="0.01" data-ink="${i}" data-field="bedrag" value="${esc(item.bedrag || '')}" placeholder="0" style="max-width:120px" />
          </div>
        </div>
      </div>
      <button type="button" class="item-remove" data-remove-ink="${i}" title="Verwijder">×</button>
    </div>
  `).join('');

  const uitgavenRows = d.begroting.uitgaven.map((item, i) => `
    <div class="dynamic-item" data-index="${i}">
      <div class="item-fields">
        <div class="form-row">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Categorie</label>
            <input class="form-input" data-uitg="${i}" data-field="categorie" value="${esc(item.categorie)}" placeholder="bijv. Zaal" />
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Omschrijving</label>
            <input class="form-input" data-uitg="${i}" data-field="beschrijving" value="${esc(item.beschrijving)}" placeholder="bijv. Huur vergaderruimte" />
          </div>
        </div>
        <div class="form-row" style="margin-top:8px">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Bedrag (€)</label>
            <input class="form-input" type="number" min="0" step="0.01" data-uitg="${i}" data-field="bedrag" value="${esc(item.bedrag || '')}" placeholder="0" style="max-width:120px" />
          </div>
        </div>
      </div>
      <button type="button" class="item-remove" data-remove-uitg="${i}" title="Verwijder">×</button>
    </div>
  `).join('');

  const totInk = d.begroting.inkomsten.reduce((s, r) => s + (parseFloat(r.bedrag) || 0), 0);
  const totUitg = d.begroting.uitgaven.reduce((s, r) => s + (parseFloat(r.bedrag) || 0), 0);
  const saldo = totInk - totUitg;

  return `
    <div class="section-title">Inkomsten</div>
    <div class="dynamic-list" id="inkomstenList">${inkomstenRows}</div>
    <button type="button" class="smallbtn" id="addInkBtn">+ Inkomst toevoegen</button>

    <div class="section-title" style="margin-top:24px">Uitgaven</div>
    <div class="dynamic-list" id="uitgavenList">${uitgavenRows}</div>
    <button type="button" class="smallbtn" id="addUitgBtn">+ Uitgave toevoegen</button>

    <div data-totals style="margin-top:20px;background:rgba(0,0,0,0.18);border-radius:12px;padding:14px 16px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
        <span>Totaal inkomsten</span><span data-ink-total style="color:var(--good)">${IVN.ui.formatEuro(totInk)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
        <span>Totaal uitgaven</span><span data-uitg-total style="color:var(--error)">${IVN.ui.formatEuro(totUitg)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;border-top:1px solid var(--border);padding-top:8px;margin-top:4px">
        <span>Saldo</span><span data-saldo style="color:${saldo >= 0 ? 'var(--good)' : 'var(--error)'}">${IVN.ui.formatEuro(saldo)}</span>
      </div>
    </div>
  `;
}

function renderStep5() {
  const d = wizard.data;
  const doelLabels = IVN_DOELEN.filter(dl => d.doelen.includes(dl.id)).map(dl => dl.label);

  return `
    <div class="section-title">Review — Jaarplan ${esc(d.jaar)}</div>
    <div style="display:grid;gap:12px">
      <div class="node-card">
        <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px">Werkgroep</div>
        <div style="font-size:16px;font-weight:600">${esc(d.werkgroepNaam) || '—'}</div>
        <div style="font-size:13px;color:var(--muted);margin-top:4px">${esc(d.locatie) || ''} &bull; Jaar: ${esc(d.jaar)}</div>
        <div style="margin-top:8px;font-size:13px">
          <strong>Inhoud:</strong> ${esc(d.coordinator1.naam) || '—'} &nbsp;|&nbsp;
          <strong>Organisatie:</strong> ${esc(d.coordinator2.naam) || '—'}
        </div>
      </div>
      <div class="node-card">
        <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px">IVN Doelen</div>
        <div>${doelLabels.length ? doelLabels.map(l => `<span class="tag good">${esc(l)}</span>`).join('') : '<span style="color:var(--muted)">Geen doelen geselecteerd</span>'}</div>
        ${d.doelToelichting ? `<div style="font-size:13px;color:var(--muted);margin-top:8px">${esc(d.doelToelichting)}</div>` : ''}
      </div>
      <div class="node-card">
        <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px">Kennisproducten (${d.kennisproducten.length})</div>
        ${d.kennisproducten.length ? d.kennisproducten.map(kp => `<div style="font-size:13px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06)">📄 ${esc(kp.titel)} — ${esc(kp.type)}</div>`).join('') : '<span style="font-size:13px;color:var(--muted)">Geen kennisproducten ingevoerd</span>'}
      </div>
      <div class="node-card">
        <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px">Activiteiten (${d.agenda.length})</div>
        ${d.agenda.length ? d.agenda.map(a => `<div style="font-size:13px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06)">${esc(formatMaand(a.datum))} — ${esc(a.type)} (${esc(a.doelgroep)}, max ${esc(a.capaciteit || '?')})</div>`).join('') : '<span style="font-size:13px;color:var(--muted)">Geen activiteiten ingevoerd</span>'}
      </div>
      <div class="node-card">
        <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px">Begroting</div>
        <div style="font-size:13px;display:flex;gap:24px">
          <div>Inkomsten: <strong style="color:var(--good)">${IVN.ui.formatEuro(d.begroting.inkomsten.reduce((s,r)=>s+(parseFloat(r.bedrag)||0),0))}</strong></div>
          <div>Uitgaven: <strong style="color:var(--error)">${IVN.ui.formatEuro(d.begroting.uitgaven.reduce((s,r)=>s+(parseFloat(r.bedrag)||0),0))}</strong></div>
        </div>
      </div>
    </div>
    <div class="form-group" style="margin-top:16px">
      <label class="form-label">Aanvullende opmerkingen</label>
      <textarea class="form-textarea" name="opmerkingen" placeholder="Overige notities voor het bestuur…">${esc(d.opmerkingen)}</textarea>
    </div>
    <div class="controls" style="margin-top:16px;padding:0">
      <button class="smallbtn primary" id="exportYpBtn">↓ Exporteer Markdown</button>
      <button class="smallbtn primary" id="saveYpBtn">✓ Opslaan Jaarplan</button>
    </div>
  `;
}

/* ---------------------------------------------------------
   Utility
--------------------------------------------------------- */
function esc(s) { return IVN.ui.escapeHtml(s != null ? String(s) : ''); }

/* ---------------------------------------------------------
   Collect + save step data before navigating
--------------------------------------------------------- */
function collectStep(step) {
  const d = wizard.data;
  if (step === 0) {
    d.werkgroepNaam   = val('werkgroepNaam');
    d.locatie         = val('locatie');
    d.jaar            = parseInt(val('jaar'), 10) || new Date().getFullYear() + 1;
    d.coordinator1.naam  = val('coord1naam');
    d.coordinator1.email = val('coord1email');
    d.coordinator2.naam  = val('coord2naam');
    d.coordinator2.email = val('coord2email');
  } else if (step === 1) {
    d.doelen = IVN_DOELEN.filter(dl => {
      const cb = body.querySelector(`[name="doel_${dl.id}"]`);
      return cb && cb.checked;
    }).map(dl => dl.id);
    d.doelToelichting = val('doelToelichting');
  } else if (step === 2) {
    // Collected real-time via event delegation
  } else if (step === 3) {
    // Collected real-time via event delegation
  } else if (step === 4) {
    // Collected real-time; also collect opmerkingen if present
  } else if (step === 5) {
    d.opmerkingen = val('opmerkingen');
  }
}

function formatMaand(yyyyMM) {
  if (!yyyyMM) return '—';
  const parts = String(yyyyMM).split('-');
  if (parts.length < 2) return yyyyMM;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
  const s = d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function val(name) {
  const el = body.querySelector(`[name="${name}"]`);
  return el ? el.value.trim() : '';
}

/* ---------------------------------------------------------
   Validation
--------------------------------------------------------- */
function validateStep(step) {
  const errors = [];
  if (step === 0) {
    if (!wizard.data.werkgroepNaam) errors.push({ field: 'werkgroepNaam', msg: 'Werkgroepnaam is verplicht' });
    if (!wizard.data.jaar)          errors.push({ field: 'jaar', msg: 'Jaar is verplicht' });
    else if (wizard.data.jaar < 2024 || wizard.data.jaar > 2035) errors.push({ field: 'jaar', msg: 'Jaar moet tussen 2024 en 2035 liggen' });
    if (!wizard.data.coordinator1.naam) errors.push({ field: 'coord1naam', msg: 'Naam coördinator inhoud is verplicht' });
    if (!wizard.data.coordinator2.naam) errors.push({ field: 'coord2naam', msg: 'Naam coördinator organisatie is verplicht' });
  } else if (step === 1) {
    if (wizard.data.doelen.length === 0) errors.push({ field: null, msg: 'Selecteer minimaal één IVN doel' });
  }
  return errors;
}

function showErrors(errors) {
  // Clear previous
  body.querySelectorAll('.field-error').forEach(e => e.remove());
  body.querySelectorAll('.form-input.error,.form-textarea.error').forEach(e => e.classList.remove('error'));

  if (errors.length === 0) return;

  errors.forEach(err => {
    if (err.field) {
      const el = body.querySelector(`[name="${err.field}"]`);
      if (el) {
        el.classList.add('error');
        const msg = document.createElement('div');
        msg.className = 'field-error';
        msg.textContent = err.msg;
        el.parentNode.appendChild(msg);
      }
    } else {
      const alert = document.createElement('div');
      alert.className = 'alert error';
      alert.textContent = err.msg;
      body.insertBefore(alert, body.firstChild);
    }
  });

  // Scroll to first error
  const first = body.querySelector('.error,.alert.error');
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------------------------------------------------------
   Render current step
--------------------------------------------------------- */
function renderCurrentStep() {
  renderStepsBar();
  prevBtn.disabled = wizard.step === 0;

  const renders = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];
  body.innerHTML = renders[wizard.step]();

  // Bind dynamic list buttons
  bindDynamicListeners();

  if (wizard.step === 5) {
    nextBtn.style.display = 'none';
    bindReviewButtons();
  } else {
    nextBtn.style.display = '';
    nextBtn.textContent = wizard.step === 4 ? 'Naar review →' : 'Volgende →';
  }
}

/* ---------------------------------------------------------
   Dynamic list event delegation
--------------------------------------------------------- */
function bindDynamicListeners() {
  body.addEventListener('click', handleDynamicClick);
  body.addEventListener('input', handleDynamicInput);
}

function handleDynamicClick(e) {
  // Kennisproducten
  if (e.target.id === 'addKpBtn') {
    if (wizard.data.kennisproducten.length < 3) {
      wizard.data.kennisproducten.push({ titel: '', type: '', doelgroep: '', wie: '' });
      renderCurrentStep();
    }
    return;
  }
  if (e.target.dataset.removeKp !== undefined) {
    wizard.data.kennisproducten.splice(parseInt(e.target.dataset.removeKp), 1);
    renderCurrentStep();
    return;
  }
  // Agenda
  if (e.target.id === 'addAgBtn') {
    wizard.data.agenda.push({ datum: '', type: 'Excursie', doelgroep: 'Leden + publiek', capaciteit: '' });
    renderCurrentStep();
    return;
  }
  if (e.target.dataset.removeAg !== undefined) {
    wizard.data.agenda.splice(parseInt(e.target.dataset.removeAg), 1);
    renderCurrentStep();
    return;
  }
  // Begroting inkomsten
  if (e.target.id === 'addInkBtn') {
    wizard.data.begroting.inkomsten.push({ beschrijving: '', bedrag: '' });
    renderCurrentStep();
    return;
  }
  if (e.target.dataset.removeInk !== undefined) {
    wizard.data.begroting.inkomsten.splice(parseInt(e.target.dataset.removeInk), 1);
    renderCurrentStep();
    return;
  }
  // Begroting uitgaven
  if (e.target.id === 'addUitgBtn') {
    wizard.data.begroting.uitgaven.push({ categorie: '', beschrijving: '', bedrag: '' });
    renderCurrentStep();
    return;
  }
  if (e.target.dataset.removeUitg !== undefined) {
    wizard.data.begroting.uitgaven.splice(parseInt(e.target.dataset.removeUitg), 1);
    renderCurrentStep();
    return;
  }
}

function handleDynamicInput(e) {
  const t = e.target;
  // Kennisproducten
  if (t.dataset.kp !== undefined) {
    const idx = parseInt(t.dataset.kp);
    wizard.data.kennisproducten[idx][t.dataset.field] = t.value;
    return;
  }
  // Agenda
  if (t.dataset.ag !== undefined) {
    const idx = parseInt(t.dataset.ag);
    wizard.data.agenda[idx][t.dataset.field] = t.value;
    return;
  }
  // Inkomsten
  if (t.dataset.ink !== undefined) {
    const idx = parseInt(t.dataset.ink);
    wizard.data.begroting.inkomsten[idx][t.dataset.field] = t.value;
    // update totals live
    updateBegrotingTotals();
    return;
  }
  // Uitgaven
  if (t.dataset.uitg !== undefined) {
    const idx = parseInt(t.dataset.uitg);
    wizard.data.begroting.uitgaven[idx][t.dataset.field] = t.value;
    updateBegrotingTotals();
    return;
  }
}

function updateBegrotingTotals() {
  if (!body.querySelector('[data-totals]')) return;
  const totInk = wizard.data.begroting.inkomsten.reduce((s,r)=>s+(parseFloat(r.bedrag)||0),0);
  const totUitg = wizard.data.begroting.uitgaven.reduce((s,r)=>s+(parseFloat(r.bedrag)||0),0);
  const saldo = totInk - totUitg;
  body.querySelector('[data-ink-total]').textContent = IVN.ui.formatEuro(totInk);
  body.querySelector('[data-uitg-total]').textContent = IVN.ui.formatEuro(totUitg);
  const saldoEl = body.querySelector('[data-saldo]');
  saldoEl.textContent = IVN.ui.formatEuro(saldo);
  saldoEl.style.color = saldo >= 0 ? 'var(--good)' : 'var(--error)';
}

function bindReviewButtons() {
  const exportBtn = document.getElementById('exportYpBtn');
  const saveBtn   = document.getElementById('saveYpBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportYearplan);
  if (saveBtn)   saveBtn.addEventListener('click', saveYearplan);
}

/* ---------------------------------------------------------
   Export + Save
--------------------------------------------------------- */
function buildYearplanMarkdown() {
  const d = wizard.data;
  const doelLabels = IVN_DOELEN.filter(dl => d.doelen.includes(dl.id)).map(dl => dl.label);
  const totInk = d.begroting.inkomsten.reduce((s,r)=>s+(parseFloat(r.bedrag)||0),0);
  const totUitg = d.begroting.uitgaven.reduce((s,r)=>s+(parseFloat(r.bedrag)||0),0);

  let md = `# Jaarplan ${d.werkgroepNaam} — ${d.jaar}\n\n`;
  md += `*Gegenereerd op ${new Date().toLocaleDateString('nl-NL')}*\n\n`;
  md += `---\n\n`;
  md += `## Werkgroep\n\n`;
  md += `- **Naam:** ${d.werkgroepNaam}\n`;
  md += `- **Locatie/regio:** ${d.locatie || '—'}\n`;
  md += `- **Jaar:** ${d.jaar}\n\n`;
  md += `## Coördinatoren\n\n`;
  md += `| Rol | Naam | E-mail |\n|---|---|---|\n`;
  md += `| Inhoud | ${d.coordinator1.naam || '—'} | ${d.coordinator1.email || '—'} |\n`;
  md += `| Organisatie | ${d.coordinator2.naam || '—'} | ${d.coordinator2.email || '—'} |\n\n`;
  md += `## IVN Doelen ${d.jaar}\n\n`;
  md += doelLabels.map(l => `- ${l}`).join('\n') + '\n\n';
  if (d.doelToelichting) md += `**Toelichting:** ${d.doelToelichting}\n\n`;
  md += `## Kennisproducten\n\n`;
  if (d.kennisproducten.length) {
    md += `| Titel | Type | Doelgroep | Wie |\n|---|---|---|---|\n`;
    d.kennisproducten.forEach(kp => {
      md += `| ${kp.titel} | ${kp.type} | ${kp.doelgroep} | ${kp.wie || '—'} |\n`;
    });
  } else { md += `*(geen kennisproducten ingevoerd)*\n`; }
  md += `\n## Activiteitenagenda\n\n`;
  if (d.agenda.length) {
    md += `| Datum/Maand | Type | Doelgroep | Max. deelnemers |\n|---|---|---|---|\n`;
    d.agenda.forEach(a => {
      md += `| ${formatMaand(a.datum)} | ${a.type} | ${a.doelgroep} | ${a.capaciteit || '—'} |\n`;
    });
  } else { md += `*(geen activiteiten ingevoerd)*\n`; }
  md += `\n## Begroting\n\n`;
  md += `### Inkomsten\n\n`;
  if (d.begroting.inkomsten.length) {
    d.begroting.inkomsten.forEach(r => { md += `- ${r.beschrijving}: € ${parseFloat(r.bedrag||0).toFixed(2)}\n`; });
  } else { md += `*(geen inkomsten ingevoerd)*\n`; }
  md += `\n### Uitgaven\n\n`;
  if (d.begroting.uitgaven.length) {
    d.begroting.uitgaven.forEach(r => { md += `- [${r.categorie}] ${r.beschrijving}: € ${parseFloat(r.bedrag||0).toFixed(2)}\n`; });
  } else { md += `*(geen uitgaven ingevoerd)*\n`; }
  md += `\n**Totaal inkomsten:** € ${totInk.toFixed(2)}\n`;
  md += `**Totaal uitgaven:** € ${totUitg.toFixed(2)}\n`;
  md += `**Saldo:** € ${(totInk - totUitg).toFixed(2)}\n\n`;
  if (d.opmerkingen) { md += `## Opmerkingen\n\n${d.opmerkingen}\n`; }
  return md;
}

function exportYearplan() {
  const md = buildYearplanMarkdown();
  const naam = (wizard.data.werkgroepNaam || 'werkgroep').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  IVN.exportMarkdown(`jaarplan-${naam}-${wizard.data.jaar}.md`, md);
  IVN.ui.showToast('Jaarplan geëxporteerd!');
}

function saveYearplan() {
  collectStep(5);
  const key = 'ivn_yearplan_' + Date.now();
  IVN.store.set(key, Object.assign({ createdAt: new Date().toISOString() }, wizard.data));
  IVN.ui.showToast('Jaarplan opgeslagen!');
  const saveBtn = document.getElementById('saveYpBtn');
  if (saveBtn) { saveBtn.textContent = '✓ Opgeslagen!'; saveBtn.disabled = true; }
}

/* ---------------------------------------------------------
   Navigation
--------------------------------------------------------- */
prevBtn.addEventListener('click', () => {
  if (wizard.step === 0) return;
  collectStep(wizard.step);
  body.removeEventListener('click', handleDynamicClick);
  body.removeEventListener('input', handleDynamicInput);
  wizard.step--;
  renderCurrentStep();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
  collectStep(wizard.step);
  const errors = validateStep(wizard.step);
  if (errors.length) { showErrors(errors); return; }
  if (wizard.step >= 5) return;
  body.removeEventListener('click', handleDynamicClick);
  body.removeEventListener('input', handleDynamicInput);
  wizard.step++;
  renderCurrentStep();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

restartBtn.addEventListener('click', () => {
  if (!confirm('Weet je zeker dat je opnieuw wilt beginnen? Niet-opgeslagen data gaat verloren.')) return;
  wizard.step = 0;
  wizard.data = {
    werkgroepNaam: '', locatie: 'S&B', jaar: new Date().getFullYear() + 1,
    coordinator1: { naam: '', email: '' }, coordinator2: { naam: '', email: '' },
    doelen: [], doelToelichting: '', kennisproducten: [], agenda: [],
    begroting: { inkomsten: [], uitgaven: [] }, opmerkingen: ''
  };
  renderCurrentStep();
});

// Seed sample data if nothing saved yet
(function seedSampleData() {
  const existing = IVN.store.list('ivn_yearplan_');
  if (existing.length > 0) return;
  IVN.store.set('ivn_yearplan_sample', {
    werkgroepNaam: 'IVN S&B — Werkgroep Natuur',
    locatie: 'S&B',
    jaar: 2025,
    coordinator1: { naam: 'Anneke de Groot', email: 'anneke.degroot@ivnsonbreugel.nl' },
    coordinator2: { naam: 'Jan Vermeulen', email: 'j.vermeulen@ivnsonbreugel.nl' },
    doelen: ['natuurbeleving', 'educatie'],
    doelToelichting: 'Minimaal 6 educatieve activiteiten voor inwoners en basisscholen in S&B. Nieuwe gidsen opleiden voor het Dommeldal en de Strabrechtse Heide. Samenwerking met gemeente S&B voor natuur-educatieproject Sonniuswijk.',
    kennisproducten: [
      { titel: 'Vlindergids Dommeldal', type: 'PDF veldgids', doelgroep: 'Leden + publiek', wie: 'Anneke de Groot' },
      { titel: 'Vogeltelkaart Sonniuswijk', type: 'Drukwerk A5', doelgroep: 'Vrijwilligers', wie: 'Jan Vermeulen' }
    ],
    agenda: [
      { datum: '2025-03', type: 'Excursie', doelgroep: 'Leden + publiek', capaciteit: 20 },
      { datum: '2025-04', type: 'Workshop', doelgroep: 'Basisscholen S&B', capaciteit: 25 },
      { datum: '2025-05', type: 'Veldwerk', doelgroep: 'Vrijwilligers', capaciteit: 10 },
      { datum: '2025-06', type: 'Lezing', doelgroep: 'Publiek', capaciteit: 40 },
      { datum: '2025-09', type: 'Excursie', doelgroep: 'Leden + publiek', capaciteit: 18 },
      { datum: '2025-10', type: 'Workshop', doelgroep: 'Jeugd', capaciteit: 15 }
    ],
    begroting: {
      inkomsten: [
        { beschrijving: 'Bijdragen deelnemers workshops', bedrag: 900 },
        { beschrijving: 'Subsidie gemeente S&B', bedrag: 600 },
        { beschrijving: 'IVN landelijk fondsbijdrage', bedrag: 300 }
      ],
      uitgaven: [
        { categorie: 'Zaal', beschrijving: 'Huur Dorpshuis S&B', bedrag: 250 },
        { categorie: 'Communicatie', beschrijving: 'Drukwerk vlinders- en vogelgids', bedrag: 280 },
        { categorie: 'Materialen', beschrijving: 'Workshop- en veldwerkmaterialen', bedrag: 200 },
        { categorie: 'Overig', beschrijving: 'Verzekering + reiskosten gidsen', bedrag: 120 }
      ]
    },
    opmerkingen: 'Afstemmen met gemeente S&B over natuur-educatieproject Sonniuswijk in Q1. Contact leggen met basisscholen voor schoolexcursies Dommeldal.',
    createdAt: new Date().toISOString()
  });
})();

// Initial render
renderCurrentStep();
