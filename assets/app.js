/* =========================================================
   IVN Werkgroep Toolkit — Gedeelde utilities
   window.IVN namespace — geladen vóór elke module-JS
   ========================================================= */

(function () {
  'use strict';

  const IVN = {};

  /* ---------------------------------------------------------
     Toast notificatie
  --------------------------------------------------------- */
  let _toastEl = null;
  let _toastTimer = null;

  function _getToast() {
    if (!_toastEl) {
      _toastEl = document.createElement('div');
      _toastEl.className = 'toast';
      document.body.appendChild(_toastEl);
    }
    return _toastEl;
  }

  /* ---------------------------------------------------------
     UI helpers
  --------------------------------------------------------- */
  IVN.ui = {
    escapeHtml(s) {
      return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    },

    showToast(message, duration) {
      duration = duration || 2200;
      const t = _getToast();
      t.textContent = message;
      t.classList.add('show');
      clearTimeout(_toastTimer);
      _toastTimer = setTimeout(() => t.classList.remove('show'), duration);
    },

    serializeForm(formEl) {
      const data = {};
      const fd = new FormData(formEl);
      fd.forEach((v, k) => { data[k] = v; });
      return data;
    },

    populateForm(formEl, data) {
      if (!data) return;
      Object.entries(data).forEach(([k, v]) => {
        const el = formEl.elements[k];
        if (!el) return;
        if (el.type === 'checkbox') {
          el.checked = !!v;
        } else {
          el.value = v;
        }
      });
    },

    createButton(label, onClick, variant) {
      variant = variant || 'secondary';
      const b = document.createElement('button');
      b.className = 'smallbtn' + (variant === 'primary' ? ' primary' : variant === 'danger' ? ' danger' : '');
      b.textContent = label;
      b.addEventListener('click', onClick);
      return b;
    },

    formatDate(iso) {
      if (!iso) return '—';
      try {
        return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) { return iso; }
    },

    formatEuro(val) {
      const n = parseFloat(val) || 0;
      return '€\u202f' + n.toFixed(2).replace('.', ',');
    },

    starsHtml(rating) {
      rating = parseInt(rating) || 0;
      let h = '';
      for (let i = 1; i <= 5; i++) {
        h += `<span class="star${i <= rating ? ' filled' : ''}">★</span>`;
      }
      return h;
    }
  };

  /* ---------------------------------------------------------
     localStorage wrapper
  --------------------------------------------------------- */
  IVN.store = {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify({ _v: 1, _ts: Date.now(), data: value }));
      } catch (e) { console.warn('IVN.store.set failed:', e); }
    },

    get(key, fallback) {
      if (fallback === undefined) fallback = null;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return (parsed && parsed.data !== undefined) ? parsed.data : fallback;
      } catch (e) { return fallback; }
    },

    getMeta(key) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return { _ts: parsed._ts, _v: parsed._v };
      } catch (e) { return null; }
    },

    remove(key) {
      localStorage.removeItem(key);
    },

    list(prefix) {
      const results = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          try {
            const parsed = JSON.parse(localStorage.getItem(k));
            results.push({ key: k, _ts: parsed._ts || 0, data: parsed.data });
          } catch (e) { /* skip corrupt */ }
        }
      }
      return results.sort((a, b) => b._ts - a._ts);
    },

    exportAll() {
      const dump = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ivn_')) {
          dump[k] = localStorage.getItem(k);
        }
      }
      return dump;
    },

    importAll(dump) {
      if (!dump || typeof dump !== 'object') return 0;
      let count = 0;
      Object.entries(dump).forEach(([k, v]) => {
        if (k.startsWith('ivn_')) {
          localStorage.setItem(k, v);
          count++;
        }
      });
      return count;
    },

    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }
  };

  /* ---------------------------------------------------------
     Reset alle data
  --------------------------------------------------------- */
  IVN.resetAll = function () {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('ivn_')) keys.push(k);
    }
    if (keys.length === 0) {
      IVN.ui.showToast('Geen data om te verwijderen.');
      return false;
    }
    const ok = confirm(
      `Weet je zeker dat je ALLE toolkit-data wilt verwijderen?\n\n` +
      `Dit verwijdert ${keys.length} record(s): jaarplannen, evaluaties, kennisdragers, ` +
      `activiteitskaarten, scores, etc.\n\n` +
      `Maak eerst een backup via "Exporteer backup (JSON)" als je de data wilt bewaren.\n\n` +
      `Deze actie kan niet ongedaan worden gemaakt.`
    );
    if (!ok) return false;
    keys.forEach(k => localStorage.removeItem(k));
    IVN.ui.showToast('Alle data verwijderd. Pagina wordt herladen…');
    setTimeout(() => location.reload(), 1200);
    return true;
  };

  /* ---------------------------------------------------------
     Bestandsdownload utilities
  --------------------------------------------------------- */
  IVN.downloadFile = function (filename, content, mimeType) {
    mimeType = mimeType || 'text/plain;charset=utf-8';
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    } catch (e) {
      // Fallback voor browsers die createObjectURL blokkeren op file://
      const win = window.open('', '_blank');
      if (win) {
        win.document.write('<pre>' + IVN.ui.escapeHtml(content) + '</pre>');
        win.document.title = filename;
      } else {
        alert('Download geblokkeerd. Kopieer de inhoud handmatig.');
      }
    }
  };

  IVN.exportMarkdown = function (filename, content) {
    IVN.downloadFile(filename, content, 'text/markdown;charset=utf-8');
  };

  IVN.exportJSON = function (filename) {
    filename = filename || ('ivn-backup-' + new Date().toISOString().slice(0, 10) + '.json');
    const dump = IVN.store.exportAll();
    IVN.downloadFile(filename, JSON.stringify(dump, null, 2), 'application/json');
    IVN.ui.showToast('Backup gedownload: ' + filename);
  };

  IVN.importJSON = function (file, onSuccess) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const dump = JSON.parse(e.target.result);
        const count = IVN.store.importAll(dump);
        IVN.ui.showToast(count + ' items hersteld uit backup.');
        if (typeof onSuccess === 'function') onSuccess(count);
      } catch (err) {
        alert('Ongeldig backup-bestand. Zorg dat het een .json export is van deze toolkit.');
      }
    };
    reader.readAsText(file);
  };

  /* ---------------------------------------------------------
     Activiteitskaart opslaan (classifier module)
  --------------------------------------------------------- */
  IVN.saveActivityCard = function (cardData) {
    const id = 'ivn_activity_' + Date.now();
    IVN.store.set(id, Object.assign({ savedAt: new Date().toISOString() }, cardData));
    IVN.ui.showToast('Activiteitskaart opgeslagen!');
    return id;
  };

  /* ---------------------------------------------------------
     Markdown helpers
  --------------------------------------------------------- */
  IVN.md = {
    h1: (t) => '# ' + t + '\n',
    h2: (t) => '\n## ' + t + '\n',
    h3: (t) => '\n### ' + t + '\n',
    p:  (t) => '\n' + t + '\n',
    li: (t) => '- ' + t,
    bold: (t) => '**' + t + '**',
    hr: () => '\n---\n',

    table(headers, rows) {
      const sep = headers.map(() => '---');
      const lines = [
        '| ' + headers.join(' | ') + ' |',
        '| ' + sep.join(' | ') + ' |',
        ...rows.map(r => '| ' + r.join(' | ') + ' |')
      ];
      return lines.join('\n') + '\n';
    },

    meta(pairs) {
      return pairs.map(([k, v]) => `**${k}:** ${v}`).join('  \n') + '\n';
    }
  };

  /* ---------------------------------------------------------
     Clipboard helper
  --------------------------------------------------------- */
  IVN.copyText = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      IVN.ui.showToast('Gekopieerd naar klembord!');
      return true;
    } catch (e) {
      // Fallback: tijdelijk textarea
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        IVN.ui.showToast('Gekopieerd naar klembord!');
        return true;
      } catch (e2) {
        alert('Kopiëren mislukt. Selecteer de tekst handmatig.');
        return false;
      }
    }
  };

  /* ---------------------------------------------------------
     Module-header helper (terug naar overzicht link)
  --------------------------------------------------------- */
  IVN.renderModuleHeader = function (containerEl, moduleTitle) {
    if (!containerEl) return;
    const hub = document.querySelector('.module-header');
    if (hub) return; // al aanwezig

    // Voeg 'Terug'-link in het panel in als eerste child
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
      if (!panel.querySelector('.module-header')) {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'module-header';
        headerDiv.innerHTML = `<a class="back-link" href="../index.html">← Overzicht</a>`;
        if (moduleTitle) {
          headerDiv.innerHTML += `<span style="color:var(--muted);font-size:12px">/ ${IVN.ui.escapeHtml(moduleTitle)}</span>`;
        }
        panel.insertBefore(headerDiv, panel.firstChild);
      }
    });
  };

  /* ---------------------------------------------------------
     Datum-utilities
  --------------------------------------------------------- */
  IVN.dateStr = function (d) {
    d = d || new Date();
    return d.toISOString().slice(0, 10);
  };

  IVN.monthLabel = function (isoDate) {
    try {
      return new Date(isoDate).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' });
    } catch (e) { return isoDate; }
  };

  /* ---------------------------------------------------------
     Expose global
  --------------------------------------------------------- */
  window.IVN = IVN;

})();
