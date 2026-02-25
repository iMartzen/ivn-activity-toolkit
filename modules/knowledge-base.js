/* =========================================================
   Kennisdragers Catalogus — CRUD module
   ========================================================= */

const VORM_OPTIES = ['wandeling', 'lezing', 'workshop', 'veldwerk', 'cursus', 'anders'];
const BESCHIKBAARHEID_OPTIES = ['altijd', 'op afspraak', 'seizoensgebonden'];

const SAMPLE_ENTRIES = [
  {
    naam: 'Anneke de Groot',
    expertiseTags: ['vlinders', 'dagvlinders', 'determinatie', 'Dommeldal'],
    vorm: 'workshop',
    beschikbaarheid: 'op afspraak',
    voorwaarden: 'Max. 12 deelnemers, loepen aanwezig. Voorkeur voor locaties langs de Dommel.',
    contact: 'anneke.degroot@ivnsonbreugel.nl'
  },
  {
    naam: 'Jan Vermeulen',
    expertiseTags: ['vogels', 'weidevogels', 'telwerk', 'S&B'],
    vorm: 'veldwerk',
    beschikbaarheid: 'seizoensgebonden',
    voorwaarden: 'Vroeg opstaan (v. 7:00), laarzen vereist, max. 8 pers. Actief in Sonniuswijk en omgeving.',
    contact: 'j.vermeulen@ivnsonbreugel.nl'
  },
  {
    naam: 'Lies van Soest',
    expertiseTags: ['bomen', 'heide', 'natuur-educatie', 'jeugd', 'Strabrechtse Heide'],
    vorm: 'wandeling',
    beschikbaarheid: 'altijd',
    voorwaarden: 'Geen bijzondere voorwaarden. Geeft ook lezingen op scholen in S&B.',
    contact: 'l.vansoest@ivnsonbreugel.nl'
  }
];

let kbFilter = '';
let kbEditId = null; // welke id is open in edit-mode
let kbExpandId = null; // welke id is open in detail-view

function esc(s) { return IVN.ui.escapeHtml(s != null ? String(s) : ''); }

/* ---------------------------------------------------------
   Data helpers
--------------------------------------------------------- */
function loadEntries() {
  return IVN.store.list('ivn_knowledge_');
}

function getEntry(id) {
  return IVN.store.get('ivn_knowledge_' + id);
}

function saveEntry(id, data) {
  IVN.store.set('ivn_knowledge_' + id, Object.assign({ id }, data));
}

function deleteEntry(id) {
  IVN.store.remove('ivn_knowledge_' + id);
}

function seedSampleData() {
  const existing = loadEntries();
  if (existing.length > 0) return;
  SAMPLE_ENTRIES.forEach(entry => {
    const id = IVN.store.generateId();
    saveEntry(id, Object.assign({ createdAt: new Date().toISOString() }, entry));
  });
}

/* ---------------------------------------------------------
   Render main page
--------------------------------------------------------- */
function render() {
  const entries = loadEntries();
  const filtered = kbFilter
    ? entries.filter(e => {
        const d = e.data;
        const q = kbFilter.toLowerCase();
        return (d.naam && d.naam.toLowerCase().includes(q)) ||
               (d.expertiseTags && d.expertiseTags.some(t => t.toLowerCase().includes(q)));
      })
    : entries;

  document.getElementById('appBody').innerHTML = `
    <div class="crud-header">
      <input class="form-input crud-search" id="kbSearch" value="${esc(kbFilter)}" placeholder="🔍 Filter op naam of expertise…" />
      <button class="smallbtn primary" id="addNewBtn">+ Nieuwe kennisdrager</button>
      <button class="smallbtn" id="exportKbBtn" title="Exporteer zichtbare items als Markdown">↓ Exporteer lijst</button>
    </div>

    <div id="newFormArea"></div>

    <div class="crud-list" id="kbList">
      ${filtered.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <p>${entries.length === 0 ? 'Nog geen kennisdragers. Voeg er een toe!' : 'Geen resultaten voor "' + esc(kbFilter) + '".'}</p>
        </div>
      ` : filtered.map(e => renderEntry(e.data, e.key)).join('')}
    </div>

    <div style="margin-top:12px;font-size:12px;color:var(--muted)">
      ${filtered.length} van ${entries.length} kennisdrager${entries.length !== 1 ? 's' : ''} zichtbaar
    </div>
  `;

  // Bind search
  document.getElementById('kbSearch').addEventListener('input', e => {
    kbFilter = e.target.value;
    render();
  });

  // Bind add new
  document.getElementById('addNewBtn').addEventListener('click', () => {
    kbEditId = null;
    document.getElementById('newFormArea').innerHTML = renderForm(null, null);
    bindFormEvents(document.getElementById('newFormArea'), null);
    document.getElementById('newFormArea').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Export
  document.getElementById('exportKbBtn').addEventListener('click', () => exportKb(filtered));

  // Delegate entry actions
  document.getElementById('kbList').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'toggle') {
      kbExpandId = kbExpandId === id ? null : id;
      render();
    } else if (action === 'edit') {
      kbExpandId = null;
      // render entry in edit mode
      const entryEl = document.querySelector(`[data-entry-id="${id}"]`);
      if (entryEl) {
        const data = IVN.store.get('ivn_knowledge_' + id);
        entryEl.querySelector('.crud-form').innerHTML = renderFormFields(data);
        entryEl.classList.add('editing');
        bindFormEvents(entryEl, id);
      }
    } else if (action === 'delete') {
      if (confirm(`Weet je zeker dat je "${btn.dataset.naam}" wilt verwijderen?`)) {
        deleteEntry(id);
        IVN.ui.showToast('Kennisdrager verwijderd.');
        render();
      }
    } else if (action === 'cancel-edit') {
      const entryEl = document.querySelector(`[data-entry-id="${id}"]`);
      if (entryEl) entryEl.classList.remove('editing');
    }
  });
}

function renderEntry(data, key) {
  if (!data) return '';
  const id = data.id || key.replace('ivn_knowledge_', '');
  const tags = Array.isArray(data.expertiseTags) ? data.expertiseTags : [];
  const isExpanded = kbExpandId === id;

  return `
    <div class="crud-item${isExpanded ? ' expanded' : ''}" data-entry-id="${id}">
      <div class="crud-item-header">
        <div>
          <div class="crud-item-title">${esc(data.naam)}</div>
          <div class="crud-item-meta">
            <span class="tag info" style="margin-right:4px">${esc(data.vorm || '—')}</span>
            <span class="tag" style="margin-right:4px">${esc(data.beschikbaarheid || '—')}</span>
            ${tags.slice(0, 4).map(t => `<span class="tag good">${esc(t)}</span>`).join('')}
            ${tags.length > 4 ? `<span class="tag" style="color:var(--muted)">+${tags.length - 4}</span>` : ''}
          </div>
        </div>
        <div class="crud-item-actions">
          <button class="smallbtn" data-action="toggle" data-id="${id}">${isExpanded ? '▲ Inklappen' : '▼ Details'}</button>
          <button class="smallbtn" data-action="edit" data-id="${id}">✏ Bewerken</button>
          <button class="smallbtn danger" data-action="delete" data-id="${id}" data-naam="${esc(data.naam)}">✕</button>
        </div>
      </div>
      <div class="crud-item-detail">
        <div style="display:grid;gap:8px;font-size:13px">
          <div><strong>Contact:</strong> ${esc(data.contact || '—')}</div>
          <div><strong>Voorwaarden:</strong> ${esc(data.voorwaarden || '—')}</div>
          <div><strong>Alle expertise:</strong> ${tags.map(t => `<span class="tag good">${esc(t)}</span>`).join(' ') || '—'}</div>
        </div>
      </div>
      <div class="crud-form">
        ${renderFormFields(data)}
      </div>
    </div>
  `;
}

function renderForm(data, id) {
  return `
    <div class="crud-item editing" style="margin-bottom:12px" ${id ? `data-entry-id="${id}"` : 'id="newEntryForm"'}>
      <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:12px">
        ${id ? 'Bewerken' : 'Nieuwe kennisdrager'}
      </div>
      <div class="crud-form" style="display:block">
        ${renderFormFields(data)}
      </div>
    </div>
  `;
}

function renderFormFields(data) {
  data = data || {};
  const tags = Array.isArray(data.expertiseTags) ? data.expertiseTags.join(', ') : '';
  return `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Naam <span class="required">*</span></label>
        <input class="form-input" name="naam" value="${esc(data.naam || '')}" placeholder="Volledige naam" />
      </div>
      <div class="form-group">
        <label class="form-label">Contact (e-mail of telefoon)</label>
        <input class="form-input" name="contact" value="${esc(data.contact || '')}" placeholder="naam@example.nl" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Expertise tags (kommagescheiden)</label>
      <input class="form-input" name="expertiseTags" value="${esc(tags)}" placeholder="bijv. vogels, weidevogels, telwerk" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Vorm</label>
        <select class="form-select" name="vorm">
          ${VORM_OPTIES.map(v => `<option value="${esc(v)}" ${data.vorm === v ? 'selected' : ''}>${esc(v)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Beschikbaarheid</label>
        <select class="form-select" name="beschikbaarheid">
          ${BESCHIKBAARHEID_OPTIES.map(b => `<option value="${esc(b)}" ${data.beschikbaarheid === b ? 'selected' : ''}>${esc(b)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Voorwaarden / opmerkingen</label>
      <textarea class="form-textarea" name="voorwaarden" placeholder="bijv. max. 15 deelnemers, eigen vervoer">${esc(data.voorwaarden || '')}</textarea>
    </div>
    <div class="controls" style="padding:0;margin-top:4px">
      <button type="button" class="smallbtn primary kb-save-btn">✓ Opslaan</button>
      <button type="button" class="smallbtn kb-cancel-btn">Annuleren</button>
    </div>
  `;
}

function bindFormEvents(container, editId) {
  const saveBtn = container.querySelector('.kb-save-btn');
  const cancelBtn = container.querySelector('.kb-cancel-btn');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const naam = container.querySelector('[name="naam"]')?.value.trim();
      if (!naam) {
        const el = container.querySelector('[name="naam"]');
        if (el) { el.classList.add('error'); el.focus(); }
        return;
      }
      const tagsRaw = container.querySelector('[name="expertiseTags"]')?.value || '';
      const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
      const data = {
        naam,
        contact: container.querySelector('[name="contact"]')?.value.trim() || '',
        expertiseTags: tags,
        vorm: container.querySelector('[name="vorm"]')?.value || 'wandeling',
        beschikbaarheid: container.querySelector('[name="beschikbaarheid"]')?.value || 'op afspraak',
        voorwaarden: container.querySelector('[name="voorwaarden"]')?.value.trim() || '',
        updatedAt: new Date().toISOString()
      };

      const id = editId || IVN.store.generateId();
      if (!editId) data.createdAt = new Date().toISOString();
      saveEntry(id, data);
      IVN.ui.showToast(editId ? 'Kennisdrager bijgewerkt!' : 'Kennisdrager toegevoegd!');
      kbEditId = null;
      render();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (editId) {
        const entryEl = document.querySelector(`[data-entry-id="${editId}"]`);
        if (entryEl) entryEl.classList.remove('editing');
      } else {
        document.getElementById('newFormArea').innerHTML = '';
      }
    });
  }
}

function exportKb(filteredEntries) {
  let md = `# Kennisdragers Catalogus — IVN\n\n`;
  md += `*Gegenereerd op ${new Date().toLocaleDateString('nl-NL')}*\n\n`;
  md += `| Naam | Expertise | Vorm | Beschikbaarheid | Contact |\n|---|---|---|---|---|\n`;
  filteredEntries.forEach(e => {
    const d = e.data;
    const tags = Array.isArray(d.expertiseTags) ? d.expertiseTags.join(', ') : '';
    md += `| ${d.naam || ''} | ${tags} | ${d.vorm || ''} | ${d.beschikbaarheid || ''} | ${d.contact || ''} |\n`;
  });
  md += `\n## Details\n\n`;
  filteredEntries.forEach(e => {
    const d = e.data;
    md += `### ${d.naam || '—'}\n\n`;
    md += `- **Expertise:** ${Array.isArray(d.expertiseTags) ? d.expertiseTags.join(', ') : '—'}\n`;
    md += `- **Vorm:** ${d.vorm || '—'}\n`;
    md += `- **Beschikbaarheid:** ${d.beschikbaarheid || '—'}\n`;
    md += `- **Voorwaarden:** ${d.voorwaarden || '—'}\n`;
    md += `- **Contact:** ${d.contact || '—'}\n\n`;
  });

  IVN.exportMarkdown('kennisdragers-catalogus.md', md);
  IVN.ui.showToast('Catalogus geëxporteerd!');
}

// Seed + render
seedSampleData();
render();
