/* ---------- Auftrag für die KI (Dialog „KI-Entwurf“) ----------
   Die erlaubten Werte für Anlass, Layout, Schrift, Farbvariante und Bildstimmung werden aus den
   Verzeichnissen eingesetzt – neue Layouts (mit Gruppe und Beschreibung) und Anlässe kennt die KI damit automatisch.
   Hinter den Auftrag hängt das Programm die Infos des Nutzers. */
import { OCC_KEYS } from '../occasions/index.js';
import { LAYOUTS, LAYOUT_GROUPS } from '../layouts/index.js';
import { FONTSETS } from './fontsets.js';
import { VARIANTS, FILTERS } from '../core/state.js';

const layoutList = () => LAYOUT_GROUPS.map(g=>`${g.name}:\n`+LAYOUTS.filter(l=>l.group===g.id).map(l=>`- ${l.id}: ${l.about||l.name}`).join('\n')).join('\n');

export const kiPrompt = () => String.raw`Du erstellst Entwürfe für Plakate einer evangelischen Kirchengemeinde. Das Ergebnis ist JSON, das ich in mein Programm „Plakatwerkstatt“ einfüge. Halte dich exakt an das folgende Format, sonst lässt es sich nicht öffnen.

AUFGABE
Lies die Infos am Ende dieser Nachricht und erstelle daraus ZWEI Plakatentwürfe in einem JSON:
1. Entwurf „herzlich“: fontStyle "herzlich", variant "kraeftig", layout "einladung"
2. Entwurf „Alternative“: dieselben Texte mit dem Layout aus der Gruppe „Herzlich und bunt“, das am besten passt (siehe LAYOUTS), z. B. "milchglas" für Feste im Freien, "aquarell" für Taufe und Familien.
Ausnahme: Bei Karfreitag, Ewigkeitssonntag, Trauer- oder Gedenkanlässen nimm stattdessen fontStyle "edel", variant "hell", layout "klassisch" (Entwurf 1) und layout "typografie" (Entwurf 2).

FORMAT (genau so, nur die Werte ändern)
{
  "format": "plakatwerkstatt",
  "version": 1,
  "posters": [
    {
      "name": "Kurzer Name des Entwurfs",
      "state": {
        "occasion": "…",
        "layout": "…",
        "fontStyle": "…",
        "variant": "…",
        "accent": null,
        "ornament": true,
        "frame": false,
        "doodles": true,
        "sunlight": true,
        "titleScale": 1,
        "textScale": 1,
        "texts": {
          "eyebrow": "",
          "title": "",
          "subtitle": "",
          "verse": "",
          "ref": "",
          "date": "",
          "time": "",
          "place": "",
          "address": "",
          "people": "",
          "boxTitle": "",
          "boxText": "",
          "note": "",
          "closing": "",
          "parish": ""
        },
        "photo": { "filter": "sonnig" }
      }
    }
  ]
}
Der zweite Entwurf folgt in derselben Liste "posters": nach der } des ersten ein Komma, dann sein vollständiges { "name": …, "state": … }.

ERLAUBTE WERTE
- occasion: ${OCC_KEYS.join(', ')}
  (Andere Veranstaltungen: nimm den passendsten, z. B. Seniorennachmittag oder Basar → gemeindefest, Musik aller Art → konzert)
- layout: ${LAYOUTS.map(l=>l.id).join(', ')} (Beschreibungen unter LAYOUTS)
- fontStyle: ${Object.keys(FONTSETS).join(', ')}
- variant: ${VARIANTS.join(', ')}
- photo.filter: ${FILTERS.join(', ')}
- accent: null (Farbe des Anlasses) oder eine Farbe als "#RRGGBB"
- titleScale zwischen 0.6 und 1.5, textScale zwischen 0.8 und 1.3
- Keine Fotos, Logos oder Bildadressen ins JSON (die lade ich selbst hoch)

LAYOUTS
${layoutList()}

DIE TEXTFELDER
- eyebrow: kleine Einladungszeile über dem Titel, grammatisch passend zum Titel, z. B. „Herzliche Einladung zum“ + Titel „Erntedankfest“. Bei stillen Anlässen leer lassen.
- title: kurz und klar, höchstens 4 Wörter. Ein Zeilenumbruch als \n ist erlaubt.
- subtitle: eine kurze Ergänzung, z. B. „Familiengottesdienst mit Erntekrone“.
- verse und ref: ein passender Bibelvers nach Luther mit Stellenangabe, z. B. „Psalm 145,15“. Nur verwenden, wenn ich einen nenne oder du dir bei Wortlaut UND Stelle sicher bist. Sonst beide leer lassen. Ohne Anführungszeichen, die setzt das Programm.
- date: ausgeschrieben mit Wochentag, z. B. „Sonntag, 18. Oktober 2026“. Prüfe, dass der Wochentag zum Datum passt. Fehlt das Jahr, nimm das nächste passende Datum in der Zukunft.
- time: z. B. „10:00 Uhr“ oder „ab 11:00 Uhr“.
- place und address: z. B. „Kirche Jabel“ und „Dorfstraße 5“.
- people: Mitwirkende oder Programmpunkte, ein Eintrag pro Zeile, getrennt mit \n. Höchstens 4 Zeilen. Eine kurze Erläuterung zu einem Programmpunkt hängst du mit " – " an, z. B. „Gemeinschaftsbuffet – Geschirr und Besteck bringt ihr mit“; einige Layouts setzen sie kleiner darunter.
- boxTitle und boxText: der hervorgehobene Kasten für das Zweitwichtigste nach dem Termin, z. B. „Für die ganze Familie!“ und ein Satz dazu. Der Satz soll konkret sein (was genau passiert), keine Floskeln wie „bunte Überraschungen“.
- note: ein praktischer Hinweis, z. B. „Eintritt frei – Spenden erbeten“.
- closing: kurze Schlusszeile, z. B. „Wir freuen uns auf euch!“. Bei stillen Anlässen leer lassen.
- parish: Name der Gemeinde für die Fußzeile.

WICHTIGE REGELN
- Jedes Feld in "texts" muss vorhanden sein. Was du nicht füllst, setzt du auf "" (leerer Text). Lässt du ein Feld weg, setzt das Programm einen Beispieltext ein.
- Erfinde keine Namen, Uhrzeiten, Orte, Adressen oder Programmpunkte. Nutze nur, was in meinen Infos steht. Fehlt etwas, lass das Feld leer – stelle keine Rückfragen.
- Lieber wenig Text als viel. Ein Plakat wird im Vorbeigehen gelesen.
- Ansprache: herzlich und persönlich („euch“), ohne Übertreibungen und ohne Ausrufezeichen in jeder Zeile.
- Bei stillen Anlässen: "doodles": false, "sunlight": false, "filter": "original".

AUSGABE
Gib das Ergebnis als EINEN JSON-Codeblock direkt hier im Chat aus, ohne Text davor oder danach. Keine Datei, kein Download-Link, kein eigenes Fenster (Canvas, Artefakt) – ich kopiere die Antwort aus dem Chat. Beide Entwürfe stehen vollständig in diesem einen Block.

JSON-REGELN (ein einziger Fehler, und der Entwurf lässt sich nicht öffnen)
- Feldnamen und Texte stehen in geraden Anführungszeichen: "title": "Erntedankfest"
- Innerhalb eines Textes nie gerade Anführungszeichen " – für Zitate „ “ nehmen.
- Zeilenumbrüche in einem Text nur als \n schreiben, nie als echte neue Zeile.
- Zwischen zwei Einträgen steht ein Komma, nach dem letzten Eintrag vor } oder ] keins.
- true, false, null und Zahlen ohne Anführungszeichen.
- Keine Kommentare, keine Auslassungen wie „…“ oder „wie oben“ – alles ausschreiben.
Prüfe das JSON vor der Ausgabe Zeile für Zeile gegen diese Regeln.

MEINE INFOS:
`;
