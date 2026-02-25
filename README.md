# IVN Werkgroep Toolkit

Een statische webapp (HTML/CSS/JS, geen frameworks) die werkgroepen en bestuur ondersteunt bij het inschalen van ideeën, jaarplannen, kostprijzen, communicatie, kennisbeheer, evaluaties en meer.

---

## Hoe openen

### Optie 1: Rechtstreeks als bestand
Open `index.html` in een moderne browser (Chrome, Firefox, Safari, Edge):

```
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

**Let op:** Op `file://` werkt alles behalve de downloadfunctie in sommige browsers (Firefox in strict mode). Als downloads geblokkeerd worden, open je de app via een lokale server (zie Optie 2).

### Optie 2: Lokale statische server (aanbevolen)
Met Python (standaard aanwezig op macOS/Linux):

```bash
cd /pad/naar/ivn-activity-toolkit
python3 -m http.server 8080
```

Open dan `http://localhost:8080` in de browser.

Met Node.js:
```bash
npx serve .
```

### Optie 3: GitHub Pages
Bij elke push naar de `main` branch wordt de app automatisch gepubliceerd via GitHub Actions naar GitHub Pages.

---

## Modules

| Module | Bestand | Functie |
|---|---|---|
| Activiteit Classifier | `modules/classifier.html` | Beslisboom voor activiteitstype en prijsadvies |
| Jaarplan Wizard | `modules/yearplan.html` | 6-staps jaarplan wizard |
| Kostprijs & Prijsbeleid | `modules/cost-pricing.html` | Break-even berekening en scenario's |
| Communicatie Templates | `modules/comms.html` | Social, website en e-mailteksten |
| Kennisdragers Catalogus | `modules/knowledge-base.html` | CRUD-lijst van experts en vrijwilligers |
| Werkgroep Gezondheid | `modules/health.html` | Gezondheidsscore met actiepunten |
| Partner Intake | `modules/partner-intake.html` | Intakeverslag + concept MoU |
| Evaluatie | `modules/evaluation.html` | Post-mortem evaluaties per activiteit |
| Dashboard | `modules/dashboard.html` | Overzicht + backup/herstel |

---

## Data & localStorage

Alle data wordt opgeslagen in de **lokale browser-opslag (localStorage)**. Dit betekent:

- Data is **alleen beschikbaar op het apparaat en de browser** waar je de toolkit gebruikt.
- Data gaat **verloren** bij het wissen van browserdata (cookies, cache).
- Data is **niet gesynchroniseerd** tussen apparaten — gebruik de export/import functie om data over te zetten.

### localStorage sleutels

Alle sleutels beginnen met `ivn_`:

| Sleutel | Inhoud |
|---|---|
| `ivn_activity_<timestamp>` | Opgeslagen activiteitskaarten |
| `ivn_yearplan_<timestamp>` | Jaarplannen |
| `ivn_costpricing_<timestamp>` | Kostprijsberekeningen |
| `ivn_knowledge_<id>` | Kennisdragers (stabiele ID voor CRUD) |
| `ivn_health_<timestamp>` | Gezondheidsscores |
| `ivn_partner_<timestamp>` | Partner intakes |
| `ivn_evaluation_<timestamp>` | Evaluaties |
| `ivn_settings` | App-instellingen |

---

## Export & Import (backup)

### Exporteren (backup maken)
1. Ga naar het **Dashboard** of de **hoofdpagina**.
2. Klik op **"Exporteer backup (JSON)"**.
3. Er wordt een bestand `ivn-backup-YYYY-MM-DD.json` gedownload.

Sla dit bestand op een veilige plek op (bijv. gedeelde map, USB stick).

### Importeren (backup herstellen)
1. Ga naar het **Dashboard** of de **hoofdpagina**.
2. Klik op **"Herstel backup"**.
3. Selecteer het eerder gedownloade `.json` bestand.
4. De data wordt ingeladen en de pagina ververst.

**Let op:** Importeren voegt data toe aan bestaande data. Bestaande records met dezelfde sleutel worden overschreven.

### Per module exporteren
Elke module heeft een eigen **"Exporteer Markdown"** knop. Dit downloadt de huidige uitkomst als `.md` bestand, geschikt voor gebruik in notities, documenten of e-mail.

---

## Voorbeelddata

Bij eerste gebruik worden automatisch **voorbeeldrecords** geseed:

- **3 kennisdragers** in de Kennisdragers Catalogus (vlinders, vogels, bomen)
- **1 jaarplan** (Werkgroep Natuur Midden-Brabant — 2025)

Deze voorbeelddata verschijnt alleen als er nog geen data aanwezig is.

---

## Technische details

- **Pure HTML/CSS/JavaScript (ES6)** — geen frameworks, geen build-tooling.
- **Geen backend** — volledig client-side, werkt offline.
- **Geen `<script type="module">`** — voor volledige compatibiliteit met `file://` protocol.
- **Gedeelde utilities** via `window.IVN` namespace (`assets/app.js`).
- **CSS-variabelen** voor consistent IVN-thema (`--accent: #7ab648`).

### Bestandsstructuur

```
/index.html                    Navigatiehub
/assets/
  styles.css                   Gedeelde stijlen
  app.js                       IVN namespace + utilities
  data/schema.json             localStorage sleutelschema
  templates/                   Markdown-sjablonen
    jaarplan.md
    kostprijs.md
    partner-intake.md
    evaluatie.md
    rapport.md
/modules/
  classifier.html + .js        Activiteit Classifier
  yearplan.html + .js          Jaarplan Wizard
  cost-pricing.html + .js      Kostprijs & Prijsbeleid
  comms.html + .js             Communicatie Templates
  knowledge-base.html + .js   Kennisdragers Catalogus
  health.html + .js            Werkgroep Gezondheid
  partner-intake.html + .js   Partner Intake
  evaluation.html + .js        Evaluatie
  dashboard.html + .js         Dashboard
/.github/workflows/static.yml  GitHub Pages deployment
```

---

## Bijdragen

Voel je vrij om verbeteringen voor te stellen via een GitHub issue of pull request.

---

*IVN Werkgroep Toolkit — Versie 1.0*
