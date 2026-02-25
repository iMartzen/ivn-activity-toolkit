/* =========================================================
   Partner Intake module
   ========================================================= */

const RISICO_NIVEAUS = ['laag', 'gemiddeld', 'hoog'];
let piAbort = new AbortController();

const piState = {
  partnerNaam: '',
  organisatieType: '',
  website: '',
  contactpersoon: '',
  contactmail: '',
  missie: '',
  ivnMatch: '',
  reputatieRisico: 'laag',
  reputatieRisicoToelichting: '',
  samenwerking: '',
  financieel: '',
  afspraken: [],
  view: 'form' // 'form' | 'report' | 'list'
};

function esc(s) { return IVN.ui.escapeHtml(s != null ? String(s) : ''); }

/* ---------------------------------------------------------
   Render
--------------------------------------------------------- */
function render() {
  if (piState.view === 'list') {
    renderList();
  } else if (piState.view === 'report') {
    renderReport();
  } else {
    renderForm();
  }
}

function renderForm() {
  const d = piState;
  const afsprakenHtml = d.afspraken.map((a, i) => `
    <div class="dynamic-item">
      <div class="item-fields">
        <input class="form-input" data-afspraak="${i}" value="${esc(a)}" placeholder="bijv. IVN verzorgt minimaal 2 activiteiten per jaar op locatie van partner" />
      </div>
      <button type="button" class="item-remove" data-remove-afspraak="${i}" title="Verwijder">×</button>
    </div>
  `).join('');

  document.getElementById('appBody').innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">
      <button class="view-btn active" id="toFormBtn">✎ Nieuw/Bewerken</button>
      <button class="view-btn" id="toListBtn">📋 Opgeslagen intakes</button>
    </div>

    <div class="section-title">Partnergegevens</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Naam organisatie <span class="required">*</span></label>
        <input class="form-input" id="pi_naam" value="${esc(d.partnerNaam)}" placeholder="Naam van de partnerorganisatie" />
      </div>
      <div class="form-group">
        <label class="form-label">Type organisatie</label>
        <input class="form-input" id="pi_type" value="${esc(d.organisatieType)}" placeholder="bijv. gemeente, school, bedrijf, stichting" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Website</label>
        <input class="form-input" id="pi_web" value="${esc(d.website)}" placeholder="https://..." />
      </div>
      <div class="form-group">
        <label class="form-label">Contactpersoon</label>
        <input class="form-input" id="pi_contact" value="${esc(d.contactpersoon)}" placeholder="Naam contactpersoon" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">E-mail contactpersoon</label>
      <input class="form-input" id="pi_mail" type="email" value="${esc(d.contactmail)}" placeholder="contact@partner.nl" style="max-width:360px" />
    </div>

    <div class="section-title">Missie & Alignment</div>
    <div class="form-group">
      <label class="form-label">Wat is de missie van de partner? <span class="required">*</span></label>
      <textarea class="form-textarea" id="pi_missie" placeholder="Beschrijf de missie of het doel van de partnerorganisatie…">${esc(d.missie)}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Hoe past dit bij de IVN-doelen? (natuurbeleving, educatie, duurzaamheid, gezondheid)</label>
      <textarea class="form-textarea" id="pi_match" placeholder="Beschrijf de inhoudelijke overeenkomst…">${esc(d.ivnMatch)}</textarea>
    </div>

    <div class="section-title">Reputatierisico</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Risico-inschatting</label>
        <select class="form-select" id="pi_risico" style="max-width:200px">
          ${RISICO_NIVEAUS.map(r => `<option value="${esc(r)}" ${d.reputatieRisico === r ? 'selected' : ''}>${esc(r.charAt(0).toUpperCase() + r.slice(1))}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Toelichting risico</label>
      <textarea class="form-textarea" id="pi_risicotoel" placeholder="Bijv. welke mogelijke risico's zijn er voor IVN's reputatie?">${esc(d.reputatieRisicoToelichting)}</textarea>
    </div>

    <div class="section-title">Samenwerking</div>
    <div class="form-group">
      <label class="form-label">Voorgestelde samenwerking</label>
      <textarea class="form-textarea" id="pi_samen" placeholder="Beschrijf de beoogde activiteiten, frequentie, rollen…">${esc(d.samenwerking)}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Financiële afspraken</label>
      <textarea class="form-textarea" id="pi_fin" placeholder="Bijv. beide partijen dragen eigen kosten; partner stelt ruimte ter beschikking…">${esc(d.financieel)}</textarea>
    </div>

    <div class="section-title">Afspraken & MoU-bullets</div>
    <p class="node-text" style="margin-bottom:12px">Voeg de kernafspraken toe die in een MoU (intentieverklaring) opgenomen worden.</p>
    <div class="dynamic-list" id="afspraaklist">${afsprakenHtml}</div>
    <button type="button" class="smallbtn" id="addAfspraakBtn">+ Afspraak toevoegen</button>

    <div class="controls" style="margin-top:20px">
      <button class="smallbtn primary" id="generateReportBtn">✦ Genereer intakeverslag</button>
      <button class="smallbtn primary" id="saveIntakeBtn">✓ Opslaan</button>
    </div>
  `;

  bindFormEvents();
}

function bindFormEvents() {
  document.getElementById('toListBtn').addEventListener('click', () => { piState.view = 'list'; render(); });

  const fields = {
    pi_naam: 'partnerNaam', pi_type: 'organisatieType', pi_web: 'website',
    pi_contact: 'contactpersoon', pi_mail: 'contactmail', pi_missie: 'missie',
    pi_match: 'ivnMatch', pi_risico: 'reputatieRisico',
    pi_risicotoel: 'reputatieRisicoToelichting', pi_samen: 'samenwerking', pi_fin: 'financieel'
  };
  Object.entries(fields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', e => { piState[key] = e.target.value; });
  });

  // Afspraken
  document.getElementById('addAfspraakBtn').addEventListener('click', () => {
    piState.afspraken.push('');
    render();
    // Focus new input
    const inputs = document.querySelectorAll('[data-afspraak]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  document.getElementById('afspraaklist').addEventListener('input', e => {
    const idx = e.target.dataset.afspraak;
    if (idx !== undefined) piState.afspraken[parseInt(idx)] = e.target.value;
  });

  document.getElementById('afspraaklist').addEventListener('click', e => {
    const btn = e.target.closest('[data-remove-afspraak]');
    if (!btn) return;
    piState.afspraken.splice(parseInt(btn.dataset.removeAfspraak), 1);
    render();
  });

  document.getElementById('generateReportBtn').addEventListener('click', () => {
    collectFormData();
    if (!piState.partnerNaam) {
      document.getElementById('pi_naam').classList.add('error');
      document.getElementById('pi_naam').focus();
      return;
    }
    piState.view = 'report';
    render();
  });

  document.getElementById('saveIntakeBtn').addEventListener('click', () => {
    collectFormData();
    if (!piState.partnerNaam) {
      document.getElementById('pi_naam').classList.add('error');
      return;
    }
    IVN.store.set('ivn_partner_' + Date.now(), Object.assign({ createdAt: new Date().toISOString() }, piState, { view: undefined }));
    IVN.ui.showToast('Partner intake opgeslagen!');
  });
}

function collectFormData() {
  const fields = {
    pi_naam: 'partnerNaam', pi_type: 'organisatieType', pi_web: 'website',
    pi_contact: 'contactpersoon', pi_mail: 'contactmail', pi_missie: 'missie',
    pi_match: 'ivnMatch', pi_risico: 'reputatieRisico',
    pi_risicotoel: 'reputatieRisicoToelichting', pi_samen: 'samenwerking', pi_fin: 'financieel'
  };
  Object.entries(fields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) piState[key] = el.value;
  });
  // Afspraken are already collected real-time
  piState.afspraken = piState.afspraken.filter(a => a.trim());
}

function renderReport() {
  const d = piState;
  const risicoColor = { laag: 'good', gemiddeld: 'warn', hoog: 'error' }[d.reputatieRisico] || 'info';

  document.getElementById('appBody').innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">
      <button class="view-btn" id="backFormBtn">← Terug naar formulier</button>
      <button class="view-btn" id="toListBtn2">📋 Opgeslagen intakes</button>
    </div>

    <div class="section-title">Intakeverslag Partner: ${esc(d.partnerNaam)}</div>

    <div class="node-card" style="margin-bottom:12px">
      <div class="k">Partnergegevens</div>
      <div style="display:grid;gap:6px;font-size:13px;margin-top:8px">
        <div><strong>Naam:</strong> ${esc(d.partnerNaam)}</div>
        <div><strong>Type:</strong> ${esc(d.organisatieType || '—')}</div>
        <div><strong>Website:</strong> ${esc(d.website || '—')}</div>
        <div><strong>Contact:</strong> ${esc(d.contactpersoon || '—')} &nbsp;${d.contactmail ? '(' + esc(d.contactmail) + ')' : ''}</div>
        <div><strong>Reputatierisico:</strong> <span class="tag ${risicoColor}">${esc(d.reputatieRisico)}</span></div>
      </div>
    </div>

    <div class="node-card" style="margin-bottom:12px">
      <div class="k">Missie & IVN Alignment</div>
      <div style="font-size:13px;margin-top:8px">
        <strong>Missie partner:</strong><br>${esc(d.missie || '—')}
      </div>
      <div style="font-size:13px;margin-top:10px">
        <strong>Match met IVN-doelen:</strong><br>${esc(d.ivnMatch || '—')}
      </div>
    </div>

    <div class="node-card" style="margin-bottom:12px">
      <div class="k">Samenwerking & Financiën</div>
      <div style="font-size:13px;margin-top:8px">
        <strong>Beoogde samenwerking:</strong><br>${esc(d.samenwerking || '—')}
      </div>
      <div style="font-size:13px;margin-top:10px">
        <strong>Financiële afspraken:</strong><br>${esc(d.financieel || '—')}
      </div>
    </div>

    <div class="section-title">Concept MoU — Kernafspraken</div>
    <div class="output-block" id="mouOutput">${buildMoU()}</div>

    <div class="controls" style="margin-top:14px">
      <button class="smallbtn" id="copyMouBtn">⧉ Kopieer MoU</button>
      <button class="smallbtn primary" id="exportPartnerBtn">↓ Exporteer Markdown</button>
    </div>
  `;

  document.getElementById('backFormBtn').addEventListener('click', () => { piState.view = 'form'; render(); });
  document.getElementById('toListBtn2').addEventListener('click', () => { piState.view = 'list'; render(); });
  document.getElementById('copyMouBtn').addEventListener('click', () => {
    IVN.copyText(document.getElementById('mouOutput').textContent);
  });
  document.getElementById('exportPartnerBtn').addEventListener('click', exportPartner);
}

function buildMoU() {
  const d = piState;
  const datum = new Date().toLocaleDateString('nl-NL');
  let text = `INTENTIEVERKLARING (concept MoU)\n`;
  text += `Datum: ${datum}\n`;
  text += `Partijen: IVN Werkgroep — ${d.partnerNaam || '[partnernaam]'}\n\n`;
  text += `De partijen komen het volgende overeen:\n\n`;
  if (d.afspraken.length > 0) {
    d.afspraken.forEach((a, i) => {
      text += `${i + 1}. ${a.trim()}\n`;
    });
  } else {
    text += `1. [Voeg afspraken toe in het formulier]\n`;
  }
  text += `\nDeze intentieverklaring is een concept en heeft geen juridische bindende kracht totdat beide partijen hebben getekend.`;
  return text;
}

function renderList() {
  piAbort.abort();
  piAbort = new AbortController();
  const sig = piAbort.signal;
  const entries = IVN.store.list('ivn_partner_');

  document.getElementById('appBody').innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">
      <button class="view-btn" id="toFormBtn3">✎ Nieuwe intake</button>
      <button class="view-btn active" id="toListBtn3">📋 Opgeslagen intakes</button>
    </div>

    ${entries.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">🤝</div>
        <p>Nog geen partner intakes opgeslagen.</p>
      </div>
    ` : `
      <div class="crud-list">
        ${entries.map(e => {
          const d = e.data;
          if (!d) return '';
          const risicoColor = { laag: 'good', gemiddeld: 'warn', hoog: 'error' }[d.reputatieRisico] || 'info';
          return `
            <div class="crud-item">
              <div class="crud-item-header">
                <div>
                  <div class="crud-item-title">${esc(d.partnerNaam || '—')}</div>
                  <div class="crud-item-meta">
                    ${d.organisatieType ? `<span class="tag info">${esc(d.organisatieType)}</span>` : ''}
                    <span class="tag ${risicoColor}">risico: ${esc(d.reputatieRisico || '—')}</span>
                    <span style="font-size:11px;color:var(--muted);margin-left:6px">${IVN.ui.formatDate(d.createdAt)}</span>
                  </div>
                </div>
                <div class="crud-item-actions">
                  <button class="smallbtn danger" data-del="${e.key}">✕</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  document.getElementById('toFormBtn3').addEventListener('click', () => { piState.view = 'form'; render(); }, { signal: sig });
  document.getElementById('appBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    if (confirm('Weet je zeker dat je deze intake wilt verwijderen?')) {
      IVN.store.remove(btn.dataset.del);
      render();
    }
  }, { signal: sig });
}

function exportPartner() {
  const d = piState;
  const naam = d.partnerNaam || 'partner';
  let md = `# Partner Intake: ${naam}\n\n`;
  md += `*Gegenereerd op ${new Date().toLocaleDateString('nl-NL')}*\n\n---\n\n`;
  md += `## Partnergegevens\n\n`;
  md += `- **Naam:** ${d.partnerNaam}\n- **Type:** ${d.organisatieType || '—'}\n`;
  md += `- **Website:** ${d.website || '—'}\n- **Contact:** ${d.contactpersoon} (${d.contactmail || '—'})\n`;
  md += `- **Reputatierisico:** ${d.reputatieRisico}\n\n`;
  md += `## Missie & Alignment\n\n**Missie partner:**\n${d.missie || '—'}\n\n`;
  md += `**Match met IVN-doelen:**\n${d.ivnMatch || '—'}\n\n`;
  if (d.reputatieRisicoToelichting) md += `**Toelichting risico:**\n${d.reputatieRisicoToelichting}\n\n`;
  md += `## Samenwerking\n\n${d.samenwerking || '—'}\n\n`;
  md += `## Financiële afspraken\n\n${d.financieel || '—'}\n\n`;
  md += `## Concept MoU\n\n\`\`\`\n${buildMoU()}\n\`\`\`\n`;

  IVN.exportMarkdown(`partner-intake-${naam.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`, md);
  IVN.ui.showToast('Partner intake geëxporteerd!');
}

// Initial render
render();
