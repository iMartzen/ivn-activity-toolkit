# Jaarplan {{werkgroepNaam}} — {{jaar}}

*Gegenereerd op {{datum}}*

---

## Werkgroep

- **Naam:** {{werkgroepNaam}}
- **Locatie/regio:** {{locatie}}
- **Jaar:** {{jaar}}

## Coördinatoren

| Rol | Naam | E-mail |
|---|---|---|
| Inhoud | {{coordinator1.naam}} | {{coordinator1.email}} |
| Organisatie | {{coordinator2.naam}} | {{coordinator2.email}} |

## IVN Doelen {{jaar}}

{{#doelen}}
- {{label}}
{{/doelen}}

**Toelichting:** {{doelToelichting}}

## Kennisproducten

| Titel | Type | Doelgroep | Verantwoordelijke |
|---|---|---|---|
{{#kennisproducten}}
| {{titel}} | {{type}} | {{doelgroep}} | {{wie}} |
{{/kennisproducten}}

## Activiteitenagenda

| Datum/Maand | Type | Doelgroep | Max. deelnemers |
|---|---|---|---|
{{#agenda}}
| {{datum}} | {{type}} | {{doelgroep}} | {{capaciteit}} |
{{/agenda}}

## Begroting

### Inkomsten

{{#begroting.inkomsten}}
- {{beschrijving}}: € {{bedrag}}
{{/begroting.inkomsten}}

### Uitgaven

{{#begroting.uitgaven}}
- [{{categorie}}] {{beschrijving}}: € {{bedrag}}
{{/begroting.uitgaven}}

**Totaal inkomsten:** € {{totaalInkomsten}}
**Totaal uitgaven:** € {{totaalUitgaven}}
**Saldo:** € {{saldo}}

## Opmerkingen

{{opmerkingen}}

---

*Dit jaarplan is gegenereerd via de IVN Werkgroep Toolkit.*
