// --- Decision tree data ---------------------------------------------------
// Each node: id, title, text, choices: [{label, meta, next, signalAdd?}]
// Result nodes use: result: {type, signals, priceAdvice, onePagerPreset}
const tree = {
  start: {
    title: "Hoe ziet het aanbod eruit?",
    text: "Eerst de grote klap: is het één bijeenkomst, of een reeks? Dat is meestal de sleutel.",
    choices: [
      { label: "Eén bijeenkomst", meta: "1 avond / 1 moment", next: "single" },
      { label: "Meerdere bijeenkomsten", meta: "reeks / traject", next: "series", signalAdd: ["reeks"] }
    ]
  },

  single: {
    title: "Wat is het karakter van die ene bijeenkomst?",
    text: "Gaat het vooral om informeren/inspireren, of is het actief oefenen met vaardigheden?",
    choices: [
      { label: "Vooral zenden + vragen", meta: "spreker, presentatie, Q&A", next: "talkLike", signalAdd: ["spreker/lezingvorm"] },
      { label: "Actief oefenen/doen", meta: "deelnemers doen opdrachten", next: "workshopLike", signalAdd: ["praktisch oefenen"] },
      { label: "Buiten / veld (met gids)", meta: "wandeling/veldbezoek", next: "excursionLike", signalAdd: ["buiten/veld"] }
    ]
  },

  talkLike: {
    title: "Is het primair ledenservice (keuzehulp/praktisch advies)?",
    text: "Een informatieavond is vaak 'keuzehulp' of praktische uitleg zonder leerdoelen. Een lezing is meer inspiratie/kennisdeling.",
    choices: [
      { label: "Ja, keuzehulp/praktisch voor leden", meta: "bijv. verrekijker/telescoop keuze", next: "RESULT_infoavond", signalAdd: ["ledenservice", "geen leerdoelen"] },
      { label: "Nee, vooral kennis/inspiratie onderwerp", meta: "bijv. natuurthema, project, soortgroep", next: "RESULT_lezing", signalAdd: ["kennisdeling"] }
    ]
  },

  workshopLike: {
    title: "Is het klein en materiaal-intensief?",
    text: "Workshops hebben vaak materialen/ruimte nodig. Dat stuurt de kostprijs meer dan 'lezing' dat doet.",
    choices: [
      { label: "Ja, materialen/kleine groep", meta: "loepen, determinatie, knutsel, apparatuur", next: "RESULT_workshop", signalAdd: ["materiaal/ruimte"] },
      { label: "Nee, vooral oefenen maar weinig kosten", meta: "bijv. basis vogelgeluid oefenen", next: "RESULT_workshop_light", signalAdd: ["workshop licht"] }
    ]
  },

  excursionLike: {
    title: "Is het publiek of vooral werkgroep/vrijwilligers?",
    text: "Werkgroepactiviteiten zijn vaak intern/praktisch (monitoring/beheer). Excursies zijn vaak publiek/leden gericht.",
    choices: [
      { label: "Publiek of leden (natuurbeleving)", meta: "excursie met gids", next: "RESULT_excursie", signalAdd: ["excursie"] },
      { label: "Werkgroep / vrijwilligers-doel", meta: "beheer, monitoring, telactie", next: "RESULT_werkgroep", signalAdd: ["vrijwilligers/werkgroep"] }
    ]
  },

  series: {
    title: "Is er opbouw met leerdoelen?",
    text: "Meerdere bijeenkomsten kan een losse reeks zijn, of een echte cursus. Leerdoelen + opbouw = meestal cursus.",
    choices: [
      { label: "Ja, duidelijke opbouw + leerdoelen", meta: "'na afloop kan je…'", next: "courseSignals", signalAdd: ["leerdoelen/opbouw"] },
      { label: "Nee, losse avonden/activiteitenreeks", meta: "kan je los volgen", next: "seriesType", signalAdd: ["losse reeks"] }
    ]
  },

  courseSignals: {
    title: "Is er toetsing/certificaat of opleiding tot vrijwilliger?",
    text: "Toetsing/certificaat of 'opleiding tot X' maakt het vaak een opleiding/vrijwilligerscursus.",
    choices: [
      { label: "Ja, certificaat/opleiding tot vrijwilliger", meta: "gids, natuurouder, kwaliteit borgen", next: "RESULT_opleiding", signalAdd: ["certificaat/opleiding"] },
      { label: "Nee, wel cursus met begeleiding", meta: "bijv. 4–8 avonden vogelcursus", next: "RESULT_cursus", signalAdd: ["cursus"] }
    ]
  },

  seriesType: {
    title: "Wat is de reeks dan wél?",
    text: "Een reeks kan een activiteitenkalender zijn, of een werkgroeptraject zonder leerdoelen/toetsing.",
    choices: [
      { label: "Reeks excursies/avonden voor publiek/leden", meta: "bijv. 3 excursies in de lente", next: "RESULT_activiteitenreeks", signalAdd: ["activiteitenreeks"] },
      { label: "Werkgroeptraject (monitoring/beheer)", meta: "bijv. maandelijkse telavonden", next: "RESULT_werkgroep_reeks", signalAdd: ["werkgroeptraject"] }
    ]
  },

  // --- Result nodes -------------------------------------------------------
  RESULT_infoavond: {
    result: {
      type: "Informatieavond (leden)",
      signals: [
        {text:"Eén bijeenkomst", tag:"info"},
        {text:"Ledenservice/keuzehulp", tag:"good"},
        {text:"Geen leerdoelen/toetsing", tag:"good"}
      ],
      priceAdvice:
        "Meestal gratis voor leden of lage bijdrage. Als er zaal/spreker-kosten zijn: transparant doorrekenen of dekken uit begroting 'ledenwaarde'.",
      onePagerPreset: {
        Type: "Informatieavond (leden)",
        Doel: "Ledenwaarde / praktische keuzehulp",
        Doelgroep: "Leden (eventueel introducees)",
        Format: "1 avond, 1–2 uur, demo + Q&A",
        Prijsbeleid: "Gratis leden of kleine bijdrage (kosten transparant)",
        Kostenraming: "Zaal + koffie/thee + evt. spreker; uren registreren"
      }
    }
  },

  RESULT_lezing: {
    result: {
      type: "Lezing",
      signals: [
        {text:"Eén bijeenkomst", tag:"info"},
        {text:"Spreker + Q&A", tag:"info"},
        {text:"Inspiratie/kennisdeling", tag:"good"}
      ],
      priceAdvice:
        "Vaak kleine entree (leden gratis of korting). Bij gastspreker: vaste afspraak/maximum vergoeding + zaal/koffie.",
      onePagerPreset: {
        Type: "Lezing",
        Doel: "Kennisdeling / inspiratie / werving",
        Doelgroep: "Leden + publiek",
        Format: "1 avond, 1–2 uur + vragen",
        Prijsbeleid: "Kleine entree, ledenkorting of gratis",
        Kostenraming: "Spreker + zaal + koffie/thee + communicatie"
      }
    }
  },

  RESULT_workshop: {
    result: {
      type: "Workshop",
      signals: [
        {text:"Eén bijeenkomst", tag:"info"},
        {text:"Actief oefenen", tag:"good"},
        {text:"Materialen/kleine groep", tag:"warn"}
      ],
      priceAdvice:
        "Meestal betaalde bijdrage (materiaal/ruimte). Ledenkorting kan. Max deelnemers duidelijk en kostprijs per deelnemer berekenen.",
      onePagerPreset: {
        Type: "Workshop",
        Doel: "Vaardigheden oefenen",
        Doelgroep: "Leden + publiek",
        Format: "1 sessie (2–4 uur), hands-on",
        Prijsbeleid: "Bijdrage gebaseerd op materiaal/ruimte",
        Kostenraming: "Materiaal + zaal + evt. begeleider + onvoorzien"
      }
    }
  },

  RESULT_workshop_light: {
    result: {
      type: "Workshop (licht)",
      signals: [
        {text:"Eén bijeenkomst", tag:"info"},
        {text:"Actief oefenen", tag:"good"},
        {text:"Weinig directe kosten", tag:"good"}
      ],
      priceAdvice:
        "Kan gratis/laag voor leden. Als het populair is: kleine bijdrage om no-shows te beperken en koffie/ruimte te dekken.",
      onePagerPreset: {
        Type: "Workshop (licht)",
        Doel: "Oefenen / community",
        Doelgroep: "Leden (evt. publiek)",
        Format: "1 sessie, interactief",
        Prijsbeleid: "Gratis/laag (afhankelijk van kosten)",
        Kostenraming: "Zaal + koffie/thee; uren registreren"
      }
    }
  },

  RESULT_excursie: {
    result: {
      type: "Excursie",
      signals: [
        {text:"Buiten/veld", tag:"info"},
        {text:"Gids/wandeling", tag:"good"},
        {text:"Natuurbeleving", tag:"good"}
      ],
      priceAdvice:
        "Vaak gratis of kleine bijdrage. Ledenvoordeel logisch. Eventueel inschrijfgeld om no-shows te beperken.",
      onePagerPreset: {
        Type: "Excursie",
        Doel: "Natuurbeleving + educatie",
        Doelgroep: "Leden + publiek",
        Format: "1–3 uur buiten, met gids",
        Prijsbeleid: "Gratis of kleine bijdrage (no-show rem)",
        Kostenraming: "Geen/laag; evt. vergunning/parkeren/communicatie"
      }
    }
  },

  RESULT_werkgroep: {
    result: {
      type: "Werkgroepactiviteit",
      signals: [
        {text:"Vrijwilligers/werkgroep", tag:"good"},
        {text:"Praktisch/doelgericht", tag:"info"},
        {text:"Vaak intern", tag:"info"}
      ],
      priceAdvice:
        "Meestal gratis (deel van vrijwilligerswerk). Kosten dekken via begroting, subsidies of projectmiddelen.",
      onePagerPreset: {
        Type: "Werkgroepactiviteit",
        Doel: "Vrijwilligerswerk / monitoring / beheer",
        Doelgroep: "Werkgroep + aspirant-vrijwilligers",
        Format: "Praktisch, veld/avond, taakgericht",
        Prijsbeleid: "Gratis",
        Kostenraming: "Projectkosten via begroting/subsidie; uren registreren"
      }
    }
  },

  RESULT_cursus: {
    result: {
      type: "Cursus",
      signals: [
        {text:"Meerdere bijeenkomsten", tag:"warn"},
        {text:"Leerdoelen + opbouw", tag:"warn"},
        {text:"Begeleiding/docent", tag:"info"}
      ],
      priceAdvice:
        "Prijs op basis van kostprijs en lengte. Ledenkorting past vaak. Transparant: zaal + materialen + begeleiding + onvoorzien.",
      onePagerPreset: {
        Type: "Cursus",
        Doel: "Kennis/vaardigheid opbouwen",
        Doelgroep: "Leden + niet-leden",
        Format: "Reeks (bijv. 4–8 avonden), opbouw",
        Prijsbeleid: "Ledenprijs + niet-ledenprijs (kostendekkend)",
        Kostenraming: "Zaal + koffie/thee + docent + materialen + onvoorzien"
      }
    }
  },

  RESULT_opleiding: {
    result: {
      type: "Opleiding / vrijwilligerscursus",
      signals: [
        {text:"Reeks + opbouw", tag:"warn"},
        {text:"Opleiden tot rol (kwaliteit)", tag:"warn"},
        {text:"Certificaat/voorwaarden", tag:"info"}
      ],
      priceAdvice:
        "Meestal kostendekkend traject met duidelijke afspraken. Overweeg lidmaatschap als voorwaarde en inzetafspraken (vrijwilligers).",
      onePagerPreset: {
        Type: "Opleiding / vrijwilligerscursus",
        Doel: "Kaderopbouw + kwaliteit borgen",
        Doelgroep: "Vrijwilligers (of aspirant)",
        Format: "Langere reeks + praktijk",
        Prijsbeleid: "Kostendekkend; lidmaatschap gewenst/vereist",
        Kostenraming: "Docenten + materialen + organisatie + onvoorzien"
      }
    }
  },

  RESULT_activiteitenreeks: {
    result: {
      type: "Activiteitenreeks (losse deelname)",
      signals: [
        {text:"Meerdere bijeenkomsten", tag:"warn"},
        {text:"Geen leerdoelen/toetsing", tag:"good"},
        {text:"Los te volgen", tag:"info"}
      ],
      priceAdvice:
        "Per onderdeel prijs/beleid bepalen (excursie/lezing/workshop). Maak een kalender met consistente regels (leden voordeel).",
      onePagerPreset: {
        Type: "Activiteitenreeks",
        Doel: "Ledenwaarde + publiek aanbod",
        Doelgroep: "Leden + publiek",
        Format: "Meerdere losse momenten",
        Prijsbeleid: "Per activiteit; consistent ledenvoordeel",
        Kostenraming: "Per onderdeel; bundel communicatie"
      }
    }
  },

  RESULT_werkgroep_reeks: {
    result: {
      type: "Werkgroeptraject (reeks)",
      signals: [
        {text:"Meerdere bijeenkomsten", tag:"warn"},
        {text:"Vrijwilligers/monitoring", tag:"good"},
        {text:"Geen leerdoelen/toetsing", tag:"good"}
      ],
      priceAdvice:
        "Meestal gratis. Focus op planning, veiligheid, en instroom (aspirant-vrijwilligers). Kosten via begroting/projectmiddelen.",
      onePagerPreset: {
        Type: "Werkgroeptraject (reeks)",
        Doel: "Monitoring/beheer continuïteit",
        Doelgroep: "Werkgroep + instroom",
        Format: "Maandelijks/periodiek",
        Prijsbeleid: "Gratis",
        Kostenraming: "Project/werkgroepbudget; uren registreren"
      }
    }
  }
};

// --- State ---------------------------------------------------------------
const state = {
  nodeId: "start",
  history: [],   // stack of {nodeId, choiceLabel}
  signals: new Set()
};

// --- DOM ---------------------------------------------------------------
const wrapEl          = document.getElementById("wrap");
const nodeTitleEl     = document.getElementById("nodeTitle");
const nodeTextEl      = document.getElementById("nodeText");
const resultSignalsEl = document.getElementById("resultSignals");
const choicesEl       = document.getElementById("choices");
const breadcrumbsEl   = document.getElementById("breadcrumbs");
const priceAdviceEl   = document.getElementById("priceAdvice");
const onePagerEl      = document.getElementById("onePager");
const statusPillEl    = document.getElementById("statusPill");

const backBtn    = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");
const copyBtn    = document.getElementById("copyBtn");

// --- Helpers -------------------------------------------------------------
function tagHtml(text, cls){
  return `<span class="tag ${cls}">${escapeHtml(text)}</span>`;
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function buildOnePager(preset){
  const lines = [];
  for(const [k,v] of Object.entries(preset)){
    lines.push(`${k}: ${v}`);
  }
  lines.push("");
  lines.push("Inhoud (5 bullets):");
  lines.push("- …");
  lines.push("- …");
  lines.push("- …");
  lines.push("- …");
  lines.push("- …");
  lines.push("");
  lines.push("Kosten (kort):");
  lines.push("- Direct: …");
  lines.push("- Indirect (uren): …");
  lines.push("- Onvoorzien: …");
  return lines.join("\n");
}

function currentPathText(){
  if(state.history.length === 0) return "Start";
  return state.history.map(h => h.choiceLabel).join(" → ");
}

function setPill(){
  const node = tree[state.nodeId];
  if(node.result){
    statusPillEl.textContent = "Klaar \u2713";
    statusPillEl.style.borderColor = "rgba(90,200,90,0.60)";
    statusPillEl.style.background   = "rgba(90,200,90,0.12)";
  } else {
    statusPillEl.textContent = "Inschalen";
    statusPillEl.style.borderColor = "rgba(122,182,72,0.30)";
    statusPillEl.style.background   = "rgba(0,0,0,0.20)";
  }
}

// --- Render --------------------------------------------------------------
function render(){
  const node = tree[state.nodeId];
  const isResult = !!node.result;

  // Toggle two-column layout and summary panel
  wrapEl.classList.toggle("is-result", isResult);

  // Copy button only active on result
  copyBtn.disabled = !isResult;

  setPill();

  // breadcrumbs
  breadcrumbsEl.innerHTML = "";
  if(state.history.length === 0){
    breadcrumbsEl.innerHTML = `<span class="crumb">Start</span>`;
  } else {
    state.history.forEach((h, idx) => {
      const c = document.createElement("span");
      c.className = "crumb";
      c.textContent = `${idx+1}. ${h.choiceLabel}`;
      breadcrumbsEl.appendChild(c);
    });
  }

  choicesEl.innerHTML = "";
  resultSignalsEl.innerHTML = "";

  if(isResult){
    // result view
    nodeTitleEl.textContent = node.result.type;
    nodeTextEl.textContent = "Je activiteit is ingeschaald. Gebruik het advies rechts als leidraad voor prijs en communicatie.";

    // signals in main card
    resultSignalsEl.innerHTML = node.result.signals.map(s => tagHtml(s.text, s.tag)).join("");

    // fill summary panel
    priceAdviceEl.textContent = node.result.priceAdvice;
    onePagerEl.textContent = buildOnePager(node.result.onePagerPreset);

    // tip below the signals
    const tip = document.createElement("p");
    tip.className = "result-tip";
    tip.textContent = "Kopieer de 1-pager (rechts) en mail hem naar het bestuur voor een kort besluit.";
    choicesEl.appendChild(tip);
  } else {
    // question view
    nodeTitleEl.textContent = node.title;
    nodeTextEl.textContent = node.text;

    // choices
    node.choices.forEach(ch => {
      const b = document.createElement("button");
      b.className = "btn";
      b.innerHTML = `
        <div>
          <div class="label-text">${escapeHtml(ch.label)}</div>
          <div class="meta">${escapeHtml(ch.meta || "")}</div>
        </div>
        <div class="arrow">\u203a</div>
      `;
      b.addEventListener("click", () => {
        if(Array.isArray(ch.signalAdd)){
          ch.signalAdd.forEach(s => state.signals.add(s));
        }
        state.history.push({ nodeId: state.nodeId, choiceLabel: ch.label });
        state.nodeId = ch.next;
        render();
      });
      choicesEl.appendChild(b);
    });

    // show path so far (only once a few steps in)
    const sigs = Array.from(state.signals);
    if(sigs.length > 0){
      const row = document.createElement("p");
      row.className = "node-text";
      row.style.marginTop = "14px";
      row.style.fontSize = "12px";
      row.textContent = `Pad zo ver: ${sigs.join(", ")}`;
      choicesEl.appendChild(row);
    }
  }

  // back button state
  backBtn.disabled = state.history.length === 0;
}

// --- Controls ------------------------------------------------------------
backBtn.addEventListener("click", () => {
  if(state.history.length === 0) return;
  const last = state.history.pop();
  state.nodeId = last.nodeId;
  // We keep signals simple; if you want perfect signal rollback, use a signal stack.
  // For practical use, it's fine; restart is always available.
  render();
});

restartBtn.addEventListener("click", () => {
  state.nodeId = "start";
  state.history = [];
  state.signals = new Set();
  render();
});

copyBtn.addEventListener("click", async () => {
  const node = tree[state.nodeId];
  const path = currentPathText();
  let text = `Pad: ${path}\n\n`;

  if(node.result){
    text += `Uitkomst: ${node.result.type}\n\n`;
    text += `Waarom:\n- ${node.result.signals.map(s => s.text).join("\n- ")}\n\n`;
    text += `Advies (prijs/kaders):\n${node.result.priceAdvice}\n\n`;
    text += `Activiteitskaart (1-pager):\n${buildOnePager(node.result.onePagerPreset)}\n`;
  }

  try{
    await navigator.clipboard.writeText(text);
    statusPillEl.textContent = "Gekopieerd \u2713";
    setTimeout(() => setPill(), 1200);
  } catch(e){
    alert("Kopieer handmatig uit het tekstvak in het advies-paneel.");
  }
});

// initial render
render();
