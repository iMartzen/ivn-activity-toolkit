/* =========================================================
   Werkgroep Gezondheid Score module
   Onderscheid: Werkgroep (activiteiten) vs. Bestuur (financiën, leden)
   ========================================================= */

// doelgroep: 'werkgroep' | 'bestuur'
const CATEGORIES = [
  // ── WERKGROEP ──────────────────────────────────────────
  {
    id: 'wg_organisatie',
    label: 'Werkgroep Organisatie',
    doelgroep: 'werkgroep',
    items: [
      { id: 'w1', label: 'Er is een vaste coördinator inhoud aanwezig',
        actie: 'Zoek actief naar een coördinator inhoud. Vraag ervaren leden.' },
      { id: 'w2', label: 'Er is een vaste coördinator organisatie aanwezig',
        actie: 'Zoek een coördinator organisatie. Splits taken om de werkdruk te verdelen.' },
      { id: 'w3', label: 'Er is een back-upplan voor sleutelrollen binnen de werkgroep',
        actie: 'Maak een kennisoverdrachtsplan en train een back-up persoon.' },
      { id: 'w4', label: 'De werkgroep overlegt regelmatig (minimaal 4× per jaar)',
        actie: 'Plan vaste overlegmomenten en stuur tijdig uitnodigingen.' }
    ]
  },
  {
    id: 'wg_activiteiten',
    label: 'Activiteiten & Aanbod',
    doelgroep: 'werkgroep',
    items: [
      { id: 'w5', label: 'De werkgroep organiseert minimaal 4 activiteiten per jaar',
        actie: 'Stel een jaarplan op met minimaal 4 geplande activiteiten.' },
      { id: 'w6', label: 'Er is een mix van activiteitstypen (excursie, lezing, workshop, etc.)',
        actie: 'Voeg een nieuw activiteitstype toe aan het jaarplan.' },
      { id: 'w7', label: 'Activiteiten worden achteraf geëvalueerd',
        actie: 'Gebruik de Evaluatie-module om elke activiteit te evalueren.' },
      { id: 'w8', label: 'Activiteiten worden tijdig aangekondigd (minimaal 2 weken van tevoren)',
        actie: 'Stel herinneringen in voor aankondigingen bij het plannen van activiteiten.' }
    ]
  },
  {
    id: 'wg_communicatie',
    label: 'Communicatie & Zichtbaarheid',
    doelgroep: 'werkgroep',
    items: [
      { id: 'w9', label: 'Activiteiten worden gepromoot via social media of website',
        actie: 'Gebruik de Communicatie Templates module voor aankondigingen.' },
      { id: 'w10', label: 'Deelnemers ontvangen tijdig een bevestiging en eventuele naberichten',
        actie: 'Stel een standaard bevestigingsmail op en verstuur die na inschrijving.' }
    ]
  },
  {
    id: 'wg_kennis',
    label: 'Kennis & Netwerk',
    doelgroep: 'werkgroep',
    items: [
      { id: 'w11', label: 'Kennisdragers zijn gedocumenteerd (naam, expertise, beschikbaarheid)',
        actie: 'Vul de Kennisdragers Catalogus in met alle actieve experts.' },
      { id: 'w12', label: 'Er is samenwerking met andere organisaties (gemeente, school, etc.)',
        actie: 'Zoek minimaal één partnerorganisatie. Gebruik de Partner Intake module.' },
      { id: 'w13', label: 'Het IVN nationaal netwerk (kennis, cursussen) wordt benut',
        actie: 'Raadpleeg de IVN website voor cursusaanbod en kennisnetwerken.' }
    ]
  },

  // ── BESTUUR ────────────────────────────────────────────
  {
    id: 'b_governance',
    label: 'Bestuur & Governance',
    doelgroep: 'bestuur',
    items: [
      { id: 'b1', label: 'Het bestuur is voltallig (voorzitter, secretaris, penningmeester)',
        actie: 'Werving starten voor de vacante bestuursfunctie(s). Meld vacature bij IVN nationaal.' },
      { id: 'b2', label: 'Bestuursvergaderingen worden gehouden en verslagen bijgehouden',
        actie: 'Plan vergaderdata voor het jaar en wijs een notulist aan.' },
      { id: 'b3', label: 'Er is een opvolgingsplan voor bestuursrollen',
        actie: 'Bespreek taakoverdracht en kandidaat-opvolgers in de eerstvolgende vergadering.' },
      { id: 'b4', label: 'Statuten en huishoudelijk reglement zijn actueel',
        actie: 'Controleer de statuten op verouderde bepalingen en plan een aanpassing via de ALV.' }
    ]
  },
  {
    id: 'b_financieel',
    label: 'Financiën',
    doelgroep: 'bestuur',
    items: [
      { id: 'b5', label: 'Er is een actuele begroting voor het lopende jaar',
        actie: 'Stel een jaarplan inclusief begroting op met de Jaarplan Wizard.' },
      { id: 'b6', label: 'De rekening-courant is niet negatief',
        actie: 'Bespreek de financiële situatie met de penningmeester. Zoek aanvullende inkomsten.' },
      { id: 'b7', label: 'Er is actieve subsidie- of fondsenwerving',
        actie: 'Onderzoek gemeentelijke, provinciale of IVN-fondsen en plan een aanvraag.' },
      { id: 'b8', label: 'De jaarrekening wordt tijdig opgesteld en (kascontrole) gecontroleerd',
        actie: 'Wijs een kascommissie aan en plan de controle vóór de ALV.' }
    ]
  },
  {
    id: 'b_leden',
    label: 'Leden & Vrijwilligers',
    doelgroep: 'bestuur',
    items: [
      { id: 'b9', label: 'Het ledenbestand is actueel en de contributie wordt tijdig geïnd',
        actie: 'Controleer het ledenbestand en stuur herinneringen voor achterstallige contributie.' },
      { id: 'b10', label: 'Het ledenbestand is stabiel of groeiend',
        actie: 'Start een instroomcampagne. Vraag leden om iemand mee te nemen naar een activiteit.' },
      { id: 'b11', label: 'Nieuwe vrijwilligers worden actief geworven en begeleid',
        actie: 'Stel een instroomplan op en wijs een buddy toe voor nieuwe vrijwilligers.' },
      { id: 'b12', label: 'Vrijwilligers worden bedankt en gewaardeerd',
        actie: 'Organiseer een jaarlijkse vrijwilligersbijeenkomst of stuur een persoonlijk bedankje.' }
    ]
  },
  {
    id: 'b_communicatie',
    label: 'Communicatie & Uitstraling',
    doelgroep: 'bestuur',
    items: [
      { id: 'b13', label: 'Website en social media zijn up-to-date',
        actie: 'Wijs een communicatieverantwoordelijke aan en plan wekelijkse updates.' },
      { id: 'b14', label: 'Er wordt minimaal 4× per jaar gecommuniceerd (nieuwsbrief, e-mail)',
        actie: 'Maak een communicatiekalender. Gebruik de Communicatie Templates module.' },
      { id: 'b15', label: 'IVN nationaal is op de hoogte van jaarprogramma en resultaten',
        actie: 'Stuur het jaarplan en jaarverslag naar IVN nationaal of de regiocoördinator.' }
    ]
  }
];

// Huidige modus: 'werkgroep' | 'bestuur' | 'alles'
let modus = 'werkgroep';

function visibleCategories() {
  if (modus === 'alles') return CATEGORIES;
  return CATEGORIES.filter(c => c.doelgroep === modus);
}

function maxScoreFor(cats) {
  return cats.reduce((s, c) => s + c.items.length * 2, 0);
}

// scores: { [itemId]: 0|1|2 }
const scores = {};
let naam = '';
let healthAbort = new AbortController();

// Default: alle items op geel (1)
CATEGORIES.forEach(cat => {
  cat.items.forEach(item => { scores[item.id] = 1; });
});

function esc(s) { return IVN.ui.escapeHtml(s != null ? String(s) : ''); }

/* ---------------------------------------------------------
   Score helpers
--------------------------------------------------------- */
function totalScore() {
  return visibleCategories().reduce((s, cat) =>
    s + cat.items.reduce((cs, item) => cs + (scores[item.id] || 0), 0), 0);
}

function categoryScore(cat) {
  return cat.items.reduce((s, item) => s + (scores[item.id] || 0), 0);
}

function scoreLabel(score, max) {
  const pct = score / max;
  if (pct < 0.40) return 'Aandacht vereist';
  if (pct < 0.70) return 'Redelijk — verbeterpunten aanwezig';
  if (pct < 0.90) return 'Goed — kleine aandachtspunten';
  return 'Uitstekend!';
}

function scoreColor(score, max) {
  const pct = score / max;
  if (pct < 0.40) return 'var(--error)';
  if (pct < 0.70) return 'var(--warn)';
  return 'var(--good)';
}

/* ---------------------------------------------------------
   Render
--------------------------------------------------------- */
function render() {
  healthAbort.abort();
  healthAbort = new AbortController();
  const sig = healthAbort.signal;
  const cats = visibleCategories();
  const maxScore = maxScoreFor(cats);
  const total = totalScore();
  const pct = Math.round((total / maxScore) * 100);

  document.getElementById('scorePill').textContent = `${total} / ${maxScore}`;

  document.getElementById('appBody').innerHTML = `
    <div class="form-group" style="max-width:400px;margin-bottom:20px">
      <label class="form-label">Naam werkgroep / bestuur</label>
      <input class="form-input" id="hNaam" value="${esc(naam)}" placeholder="bijv. IVN S&B — Werkgroep Natuur" />
    </div>

    <div class="tabs" style="margin-bottom:20px" role="tablist" aria-label="Beoordeling voor">
      <button class="tab-btn${modus === 'werkgroep' ? ' active' : ''}" data-modus="werkgroep" role="tab" aria-selected="${modus === 'werkgroep'}">
        Werkgroep
      </button>
      <button class="tab-btn${modus === 'bestuur' ? ' active' : ''}" data-modus="bestuur" role="tab" aria-selected="${modus === 'bestuur'}">
        Bestuur
      </button>
      <button class="tab-btn${modus === 'alles' ? ' active' : ''}" data-modus="alles" role="tab" aria-selected="${modus === 'alles'}">
        Totaaloverzicht
      </button>
    </div>

    <div style="font-size:13px;color:var(--muted);margin-bottom:16px">
      ${modus === 'werkgroep'
        ? 'De werkgroep is verantwoordelijk voor het organiseren van activiteiten. Financiën en ledenadministratie vallen buiten de werkgroep.'
        : modus === 'bestuur'
        ? 'Het bestuur is verantwoordelijk voor financiën, begroting, ledenadministratie en governance.'
        : 'Totaaloverzicht van alle categorieën — werkgroep én bestuur.'}
    </div>

    <div class="score-summary">
      <span class="score-val" style="color:${scoreColor(total, maxScore)}">${total}</span>
      <span class="score-max">/ ${maxScore} — ${scoreLabel(total, maxScore)}</span>
    </div>
    <div class="score-bar-wrap">
      <div class="score-bar-fill" style="width:${pct}%"></div>
    </div>

    <div style="display:flex;gap:16px;font-size:12px;color:var(--muted);margin-bottom:20px;flex-wrap:wrap">
      <span style="display:flex;align-items:center;gap:6px"><span class="score-dot red" style="width:12px;height:12px;display:inline-block"></span> Nee / niet aanwezig (0)</span>
      <span style="display:flex;align-items:center;gap:6px"><span class="score-dot yellow" style="width:12px;height:12px;display:inline-block"></span> Gedeeltelijk / in opbouw (1)</span>
      <span style="display:flex;align-items:center;gap:6px"><span class="score-dot green" style="width:12px;height:12px;display:inline-block"></span> Ja / aanwezig (2)</span>
    </div>

    ${modus === 'alles' ? renderModusBadges(cats) : ''}

    ${cats.map(cat => renderCategory(cat)).join('')}

    ${renderActiepunten(cats)}

    <div class="controls" style="margin-top:20px">
      <button class="smallbtn primary" id="exportHealthBtn">↓ Exporteer Markdown</button>
      <button class="smallbtn primary" id="saveHealthBtn">✓ Score opslaan</button>
    </div>
  `;

  document.getElementById('hNaam').addEventListener('input', e => { naam = e.target.value; }, { signal: sig });

  // Modus tabs
  document.getElementById('appBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-modus]');
    if (btn) { modus = btn.dataset.modus; render(); }
  }, { signal: sig });

  // Radio changes — update without full re-render
  document.getElementById('appBody').addEventListener('change', e => {
    if (e.target.name && e.target.name.startsWith('score_')) {
      const id = e.target.name.replace('score_', '');
      scores[id] = parseInt(e.target.value);
      updateScoreDisplay(cats, maxScore);
    }
  }, { signal: sig });

  document.getElementById('exportHealthBtn').addEventListener('click', exportHealth, { signal: sig });
  document.getElementById('saveHealthBtn').addEventListener('click', saveHealth, { signal: sig });
}

function renderModusBadges(cats) {
  const wgCats = cats.filter(c => c.doelgroep === 'werkgroep');
  const bCats  = cats.filter(c => c.doelgroep === 'bestuur');
  const wgMax  = maxScoreFor(wgCats);
  const bMax   = maxScoreFor(bCats);
  const wgTotal = wgCats.reduce((s, c) => s + categoryScore(c), 0);
  const bTotal  = bCats.reduce((s, c)  => s + categoryScore(c), 0);
  const wgPct = Math.round((wgTotal / wgMax) * 100);
  const bPct  = Math.round((bTotal  / bMax)  * 100);

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      <div style="background:rgba(122,182,72,0.08);border:1px solid rgba(122,182,72,0.25);border-radius:10px;padding:12px 14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:var(--muted);margin-bottom:4px">Werkgroep</div>
        <div style="font-size:20px;font-weight:700;color:${scoreColor(wgTotal, wgMax)}">${wgTotal}<span style="font-size:13px;color:var(--muted);font-weight:400"> / ${wgMax}</span></div>
        <div style="font-size:11px;color:var(--muted)">${scoreLabel(wgTotal, wgMax)}</div>
      </div>
      <div style="background:rgba(122,182,72,0.08);border:1px solid rgba(122,182,72,0.25);border-radius:10px;padding:12px 14px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:var(--muted);margin-bottom:4px">Bestuur</div>
        <div style="font-size:20px;font-weight:700;color:${scoreColor(bTotal, bMax)}">${bTotal}<span style="font-size:13px;color:var(--muted);font-weight:400"> / ${bMax}</span></div>
        <div style="font-size:11px;color:var(--muted)">${scoreLabel(bTotal, bMax)}</div>
      </div>
    </div>
  `;
}

function renderCategory(cat) {
  const catScore = categoryScore(cat);
  const catMax = cat.items.length * 2;
  const badge = modus === 'alles'
    ? `<span style="font-size:10px;padding:2px 7px;border-radius:20px;background:${cat.doelgroep === 'werkgroep' ? 'rgba(122,182,72,0.18)' : 'rgba(108,168,255,0.18)'};color:${cat.doelgroep === 'werkgroep' ? 'var(--good)' : '#6ca8ff'};font-weight:600;margin-left:8px">${cat.doelgroep === 'werkgroep' ? 'Werkgroep' : 'Bestuur'}</span>`
    : '';

  return `
    <div class="score-category">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div class="score-category-title">${esc(cat.label)}${badge}</div>
        <div style="font-size:12px;color:var(--muted)">${catScore}/${catMax}</div>
      </div>
      ${cat.items.map(item => renderScoreItem(item)).join('')}
    </div>
  `;
}

function renderScoreItem(item) {
  const current = scores[item.id] !== undefined ? scores[item.id] : 1;
  return `
    <div class="score-item">
      <div class="score-item-label">${esc(item.label)}</div>
      <div class="score-radios">
        <label class="score-radio-label" title="Nee">
          <input type="radio" name="score_${item.id}" value="0" ${current === 0 ? 'checked' : ''} />
          <span class="score-dot red"></span>
        </label>
        <label class="score-radio-label" title="Gedeeltelijk">
          <input type="radio" name="score_${item.id}" value="1" ${current === 1 ? 'checked' : ''} />
          <span class="score-dot yellow"></span>
        </label>
        <label class="score-radio-label" title="Ja">
          <input type="radio" name="score_${item.id}" value="2" ${current === 2 ? 'checked' : ''} />
          <span class="score-dot green"></span>
        </label>
      </div>
    </div>
  `;
}

function renderActiepunten(cats) {
  const prioriteit = [];
  const aandacht = [];

  cats.forEach(cat => {
    cat.items.forEach(item => {
      const s = scores[item.id] || 0;
      if (s === 0) prioriteit.push({ item, cat });
      else if (s === 1) aandacht.push({ item, cat });
    });
  });

  if (prioriteit.length === 0 && aandacht.length === 0) {
    return `<div class="alert success" style="margin-top:16px">Alle onderdelen scoren goed! Blijf dit monitoren.</div>`;
  }

  let html = `<div class="section-title" style="margin-top:24px">Aanbevolen actiepunten</div>`;

  if (prioriteit.length > 0) {
    html += `<div style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:var(--error);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.4px">
        ⚠ Prioriteit (score 0)
      </div>
      <div style="display:grid;gap:8px">
        ${prioriteit.map(({ item, cat }) => `
          <div style="background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.25);border-radius:10px;padding:12px 14px;font-size:13px">
            <div style="font-weight:600;margin-bottom:4px">${esc(cat.label)}: ${esc(item.label)}</div>
            <div style="color:var(--muted)">${esc(item.actie)}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  if (aandacht.length > 0) {
    html += `<div>
      <div style="font-size:12px;font-weight:700;color:var(--warn);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.4px">
        Aandacht (score 1)
      </div>
      <div style="display:grid;gap:8px">
        ${aandacht.map(({ item, cat }) => `
          <div style="background:rgba(255,184,108,0.08);border:1px solid rgba(255,184,108,0.25);border-radius:10px;padding:12px 14px;font-size:13px">
            <div style="font-weight:600;margin-bottom:4px">${esc(cat.label)}: ${esc(item.label)}</div>
            <div style="color:var(--muted)">${esc(item.actie)}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  return html;
}

function updateScoreDisplay(cats, maxScore) {
  const total = totalScore();
  const pct = Math.round((total / maxScore) * 100);

  document.getElementById('scorePill').textContent = `${total} / ${maxScore}`;

  const val = document.querySelector('.score-val');
  const max = document.querySelector('.score-max');
  const bar = document.querySelector('.score-bar-fill');

  if (val) { val.textContent = total; val.style.color = scoreColor(total, maxScore); }
  if (max) max.textContent = `/ ${maxScore} — ${scoreLabel(total, maxScore)}`;
  if (bar) bar.style.width = pct + '%';

  // Re-render actiepunten section
  const sectionTitle = Array.from(document.querySelectorAll('.section-title'))
    .find(el => el.textContent.includes('Aanbevolen'));
  const alertEl = document.querySelector('.alert.success');
  const controlsDiv = document.querySelector('.controls[style*="margin-top:20px"]');

  const anchor = sectionTitle || alertEl;
  if (anchor && controlsDiv) {
    const newHtml = document.createElement('div');
    newHtml.innerHTML = renderActiepunten(cats);
    let next = anchor;
    while (next && next !== controlsDiv) {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }
    Array.from(newHtml.children).forEach(child => {
      document.getElementById('appBody').insertBefore(child, controlsDiv);
    });
  }

  // Update totaaloverzicht badges if visible
  if (modus === 'alles') {
    const gridEl = document.querySelector('[style*="grid-template-columns:1fr 1fr"]');
    if (gridEl) gridEl.outerHTML = renderModusBadges(cats);
  }
}

/* ---------------------------------------------------------
   Export + Save
--------------------------------------------------------- */
function exportHealth() {
  const cats = visibleCategories();
  const maxScore = maxScoreFor(cats);
  const total = totalScore();
  const modusLabel = modus === 'werkgroep' ? 'Werkgroep' : modus === 'bestuur' ? 'Bestuur' : 'Totaaloverzicht';
  const label = naam || 'IVN S&B';

  let md = `# Gezondheidscheck — ${modusLabel} — ${label}\n\n`;
  md += `*Gegenereerd op ${new Date().toLocaleDateString('nl-NL')}*\n\n`;
  md += `**Totaalscore: ${total} / ${maxScore} — ${scoreLabel(total, maxScore)}**\n\n---\n\n`;

  cats.forEach(cat => {
    const catScore = categoryScore(cat);
    md += `## ${cat.label} (${catScore}/${cat.items.length * 2})\n\n`;
    cat.items.forEach(item => {
      const s = scores[item.id] || 0;
      const dot = s === 0 ? '🔴' : s === 1 ? '🟡' : '🟢';
      md += `- ${dot} ${item.label}: score ${s}/2\n`;
    });
    md += '\n';
  });

  md += `## Actiepunten\n\n`;
  cats.forEach(cat => {
    cat.items.forEach(item => {
      const s = scores[item.id] || 0;
      if (s < 2) {
        md += `- [${cat.label}] **${item.label}**: ${item.actie}\n`;
      }
    });
  });

  const slug = `${modusLabel.toLowerCase()}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  IVN.exportMarkdown(`gezondheid-${slug}.md`, md);
  IVN.ui.showToast('Gezondheidsrapport geëxporteerd!');
}

function saveHealth() {
  const cats = visibleCategories();
  const maxScore = maxScoreFor(cats);
  const total = totalScore();
  const actiepunten = [];

  cats.forEach(cat => {
    cat.items.forEach(item => {
      if ((scores[item.id] || 0) < 2) {
        actiepunten.push({
          doelgroep: cat.doelgroep,
          categorie: cat.label,
          item: item.label,
          score: scores[item.id] || 0,
          actie: item.actie
        });
      }
    });
  });

  IVN.store.set('ivn_health_' + Date.now(), {
    naam,
    modus,
    scores: Object.assign({}, scores),
    totalScore: total,
    maxScore,
    actiepunten,
    createdAt: new Date().toISOString()
  });
  IVN.ui.showToast('Score opgeslagen!');
}

// Initial render
render();
