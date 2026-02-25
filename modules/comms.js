/* =========================================================
   Communicatie Templates module
   ========================================================= */

const ACTIVITEIT_TYPEN = [
  'Excursie', 'Lezing', 'Workshop', 'Workshop (licht)', 'Cursus',
  'Opleiding / vrijwilligerscursus', 'Informatieavond (leden)',
  'Activiteitenreeks', 'Werkgroepactiviteit', 'Werkgroeptraject (reeks)', 'Anders'
];

const commsState = {
  type: 'Excursie',
  naam: '',
  datum: '',
  tijd: '',
  locatie: '',
  doelgroep: 'Leden en publiek',
  maxDeelnemers: '',
  kosten: 'Gratis',
  aanmeldlink: '',
  toelichting: '',
  activeTab: 0
};

function esc(s) { return IVN.ui.escapeHtml(s != null ? String(s) : ''); }

/* ---------------------------------------------------------
   Template generators
--------------------------------------------------------- */
function buildSocial() {
  const d = commsState;
  const kostenStr = d.kosten.toLowerCase() === 'gratis' ? 'Gratis' : `Bijdrage: ${d.kosten}`;
  const datumStr = d.datum ? `📅 ${IVN.ui.formatDate(d.datum)}${d.tijd ? ' om ' + d.tijd : ''}` : '';
  const locStr = d.locatie ? `📍 ${d.locatie}` : '';
  const aanmeldStr = d.aanmeldlink ? `\n👉 Aanmelden: ${d.aanmeldlink}` : '';
  const body = [
    `🌿 IVN — ${d.naam || d.type}`,
    d.toelichting ? d.toelichting.split('\n')[0].slice(0, 120) + (d.toelichting.length > 120 ? '…' : '') : '',
    '',
    datumStr,
    locStr,
    `💡 ${kostenStr}${d.maxDeelnemers ? ' · Max. ' + d.maxDeelnemers + ' deelnemers' : ''}`,
    aanmeldStr,
    '#IVN #natuur #natuurbeleving'
  ].filter(l => l !== undefined && l !== null);

  return body.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function buildWebsite() {
  const d = commsState;
  const datumStr = d.datum ? `${IVN.ui.formatDate(d.datum)}${d.tijd ? ', ' + d.tijd : ''}` : 'Datum volgt';
  const kostenStr = d.kosten.toLowerCase() === 'gratis' ? 'gratis toegankelijk' : `${d.kosten} per persoon`;
  const maxStr = d.maxDeelnemers ? ` Maximaal ${d.maxDeelnemers} deelnemers.` : '';
  const aanmeldStr = d.aanmeldlink ? ` Aanmelden via: ${d.aanmeldlink}` : ' Aanmelden via het contactformulier of e-mail.';

  let tekst = `**${d.naam || d.type}**\n\n`;
  if (d.toelichting) tekst += `${d.toelichting}\n\n`;
  tekst += `**Datum en tijd:** ${datumStr}\n`;
  tekst += `**Locatie:** ${d.locatie || 'Zie aankondiging'}\n`;
  tekst += `**Doelgroep:** ${d.doelgroep}\n`;
  tekst += `**Kosten:** De activiteit is ${kostenStr}.${maxStr}\n\n`;
  tekst += `${aanmeldStr.trim()}\n\n`;
  tekst += `Deze activiteit wordt georganiseerd door IVN. IVN verbindt mensen met de natuur via activiteiten op het gebied van natuurbeleving, educatie, duurzaamheid en gezondheid.`;
  return tekst;
}

function buildEmail() {
  const d = commsState;
  const datumStr = d.datum ? `${IVN.ui.formatDate(d.datum)}${d.tijd ? ' om ' + d.tijd : ''}` : '[datum volgt]';
  const kostenStr = d.kosten.toLowerCase() === 'gratis' ? 'gratis' : d.kosten;
  const maxStr = d.maxDeelnemers ? ` Er zijn maximaal ${d.maxDeelnemers} plekken beschikbaar.` : '';

  let mail = `Onderwerp: ${d.type}: ${d.naam || '[naam activiteit]'} — ${datumStr}\n\n`;
  mail += `Beste natuurliefhebber,\n\n`;
  if (d.toelichting) {
    mail += `${d.toelichting}\n\n`;
  } else {
    mail += `IVN organiseert een ${d.type.toLowerCase()} voor ${d.doelgroep.toLowerCase()}.\n\n`;
  }
  mail += `**Praktische informatie:**\n`;
  mail += `- Datum en tijd: ${datumStr}\n`;
  mail += `- Locatie: ${d.locatie || '[locatie volgt]'}\n`;
  mail += `- Doelgroep: ${d.doelgroep}\n`;
  mail += `- Kosten: ${kostenStr}${maxStr}\n`;
  if (d.aanmeldlink) mail += `- Aanmelden: ${d.aanmeldlink}\n`;
  mail += `\nWe hopen je te zien!\n\n`;
  mail += `Met vriendelijke groet,\n`;
  mail += `IVN Werkgroep\n`;
  return mail;
}

/* ---------------------------------------------------------
   Render
--------------------------------------------------------- */
const TAB_LABELS = ['Social media', 'Website tekst', 'E-mail uitnodiging'];

function render() {
  const d = commsState;
  document.getElementById('appBody').innerHTML = `
    <div class="section-title">Activiteitsgegevens</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Type activiteit</label>
        <select class="form-select" id="f_type">
          ${ACTIVITEIT_TYPEN.map(t => `<option value="${esc(t)}" ${d.type === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Naam activiteit <span class="required">*</span></label>
        <input class="form-input" id="f_naam" value="${esc(d.naam)}" placeholder="bijv. Lentewandeling Vrouwenakkers" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Datum</label>
        <input class="form-input" id="f_datum" type="date" min="2020-01-01" max="2035-12-31" value="${esc(d.datum)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Tijd</label>
        <input class="form-input" id="f_tijd" type="time" value="${esc(d.tijd)}" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Locatie</label>
        <input class="form-input" id="f_locatie" value="${esc(d.locatie)}" placeholder="bijv. Parkeerplaats De Haar, Leiden" />
      </div>
      <div class="form-group">
        <label class="form-label">Doelgroep</label>
        <input class="form-input" id="f_doelgroep" value="${esc(d.doelgroep)}" placeholder="bijv. Leden en publiek" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Kosten</label>
        <input class="form-input" id="f_kosten" value="${esc(d.kosten)}" placeholder="bijv. Gratis of € 5,00" />
      </div>
      <div class="form-group">
        <label class="form-label">Max. deelnemers</label>
        <input class="form-input" id="f_max" type="number" min="1" value="${esc(d.maxDeelnemers)}" placeholder="20" style="max-width:100px" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Aanmeldlink / contactpersoon</label>
      <input class="form-input" id="f_aanmeld" value="${esc(d.aanmeldlink)}" placeholder="bijv. info@ivn.nl of https://..." style="max-width:440px" />
    </div>
    <div class="form-group">
      <label class="form-label">Toelichting (2–3 zinnen over de activiteit)</label>
      <textarea class="form-textarea" id="f_toelichting" placeholder="Beschrijf wat deelnemers kunnen verwachten…">${esc(d.toelichting)}</textarea>
    </div>

    <button class="smallbtn primary" id="generateBtn" style="margin-bottom:18px">✦ Genereer teksten</button>

    <div id="outputSection" style="${d.naam || d.toelichting ? '' : 'display:none'}">
      <div class="section-title">Gegenereerde teksten</div>
      <div class="tabs" id="tabBar">
        ${TAB_LABELS.map((label, i) => `<button class="tab-btn${d.activeTab === i ? ' active' : ''}" data-tab="${i}">${esc(label)}</button>`).join('')}
      </div>
      ${TAB_LABELS.map((label, i) => `
        <div class="tab-panel${d.activeTab === i ? ' active' : ''}" id="tabPanel_${i}">
          <div class="output-block" id="output_${i}"></div>
          <div class="controls" style="margin-top:10px">
            <button class="smallbtn" data-copy="${i}">⧉ Kopieer</button>
          </div>
        </div>
      `).join('')}
      <div class="controls" style="margin-top:12px">
        <button class="smallbtn primary" id="exportCommsBtn">↓ Exporteer alle teksten (Markdown)</button>
      </div>
    </div>
  `;

  // Fill outputs if we have something to show
  if (d.naam || d.toelichting) fillOutputs();

  // Bind form inputs
  const fields = {
    f_type: 'type', f_naam: 'naam', f_datum: 'datum', f_tijd: 'tijd',
    f_locatie: 'locatie', f_doelgroep: 'doelgroep', f_kosten: 'kosten',
    f_max: 'maxDeelnemers', f_aanmeld: 'aanmeldlink', f_toelichting: 'toelichting'
  };
  Object.entries(fields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', e => { commsState[key] = e.target.value; });
  });

  document.getElementById('generateBtn').addEventListener('click', () => {
    commsState.naam     = document.getElementById('f_naam').value;
    commsState.type     = document.getElementById('f_type').value;
    commsState.datum    = document.getElementById('f_datum').value;
    commsState.tijd     = document.getElementById('f_tijd').value;
    commsState.locatie  = document.getElementById('f_locatie').value;
    commsState.doelgroep= document.getElementById('f_doelgroep').value;
    commsState.kosten   = document.getElementById('f_kosten').value;
    commsState.maxDeelnemers = document.getElementById('f_max').value;
    commsState.aanmeldlink   = document.getElementById('f_aanmeld').value;
    commsState.toelichting   = document.getElementById('f_toelichting').value;

    document.getElementById('outputSection').style.display = '';
    fillOutputs();
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Tab switching
  document.getElementById('tabBar')?.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const idx = parseInt(btn.dataset.tab);
    commsState.activeTab = idx;
    document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
    document.querySelectorAll('.tab-panel').forEach((p, i) => p.classList.toggle('active', i === idx));
  });

  // Copy buttons
  document.getElementById('outputSection')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const idx = parseInt(btn.dataset.copy);
    const el = document.getElementById('output_' + idx);
    if (el) IVN.copyText(el.textContent);
  });

  document.getElementById('exportCommsBtn')?.addEventListener('click', exportComms);
}

function fillOutputs() {
  const outputs = [buildSocial(), buildWebsite(), buildEmail()];
  outputs.forEach((text, i) => {
    const el = document.getElementById('output_' + i);
    if (el) el.textContent = text;
  });
}

function exportComms() {
  const d = commsState;
  const naam = d.naam || d.type;
  let md = `# Communicatieteksten: ${naam}\n\n`;
  md += `*Gegenereerd op ${new Date().toLocaleDateString('nl-NL')}*\n\n---\n\n`;
  md += `## Activiteitsgegevens\n\n`;
  md += `- **Type:** ${d.type}\n- **Naam:** ${d.naam}\n- **Datum:** ${d.datum} ${d.tijd}\n`;
  md += `- **Locatie:** ${d.locatie}\n- **Doelgroep:** ${d.doelgroep}\n- **Kosten:** ${d.kosten}\n\n`;
  md += `## Social media tekst\n\n\`\`\`\n${buildSocial()}\n\`\`\`\n\n`;
  md += `## Website tekst\n\n${buildWebsite()}\n\n`;
  md += `## E-mail uitnodiging\n\n\`\`\`\n${buildEmail()}\n\`\`\`\n`;

  IVN.exportMarkdown(`communicatie-${naam.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`, md);
  IVN.ui.showToast('Communicatieteksten geëxporteerd!');
}

// Initial render
render();
