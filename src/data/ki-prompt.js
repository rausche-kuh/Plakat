/* ---------- Auftrag für die KI (Tab „KI-Entwurf“) ----------
   Die erlaubten Werte für Anlass, Layout, Schrift, Farbvariante und Bildstimmung werden aus den
   Verzeichnissen eingesetzt – neue Layouts und Anlässe kennt die KI damit automatisch.
   Hinter den Auftrag hängt das Programm die Infos des Nutzers. */
import { OCC_KEYS } from '../occasions/index.js';
import { LAYOUTS } from '../layouts/index.js';
import { FONTSETS } from './fontsets.js';
import { VARIANTS, FILTERS } from '../core/state.js';

export const kiPrompt = () => String.raw`Du erstellst Entwürfe für Plakate einer evangelischen Kirchengemeinde. Das Ergebnis ist eine JSON-Datei, die ich in mein Programm „Plakatwerkstatt“ importiere. Halte dich exakt an das folgende Format, sonst lässt sich die Datei nicht öffnen.

AUFGABE
Lies die Infos am Ende dieser Nachricht und erstelle daraus ZWEI Plakatentwürfe in einer Datei:
1. Entwurf „herzlich“: fontStyle "herzlich", variant "kraeftig", layout "einladung"
2. Entwurf „Alternative“: dasselbe mit layout "pinnwand"
Ausnahme: Bei Karfreitag, Ewigkeitssonntag, Trauer- oder Gedenkanlässen nimm stattdessen fontStyle "edel", variant "hell", layout "klassisch" (Entwurf 1) und layout "kirchenfenster" (Entwurf 2).

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
        "photo": { "src": null, "zoom": 1, "x": 0, "y": 0, "filter": "sonnig", "brightness": 0 },
        "logo": { "src": null }
      }
    }
  ]
}

ERLAUBTE WERTE
- occasion: ${OCC_KEYS.join(', ')}
  (Andere Veranstaltungen: nimm den passendsten, z. B. Seniorennachmittag oder Basar → gemeindefest, Musik aller Art → konzert)
- layout: ${LAYOUTS.map(l=>l.id).join(', ')}
- fontStyle: ${Object.keys(FONTSETS).join(', ')}
- variant: ${VARIANTS.join(', ')}
- photo.filter: ${FILTERS.join(', ')}
- accent: null (Farbe des Anlasses) oder eine Farbe als "#RRGGBB"
- titleScale zwischen 0.6 und 1.5, textScale zwischen 0.8 und 1.3
- photo.src und logo.src IMMER null lassen (Fotos lade ich selbst hoch)

DIE TEXTFELDER
- eyebrow: kleine Einladungszeile über dem Titel, grammatisch passend zum Titel, z. B. „Herzliche Einladung zum“ + Titel „Erntedankfest“. Bei stillen Anlässen leer lassen.
- title: kurz und klar, höchstens 4 Wörter. Ein Zeilenumbruch als \n ist erlaubt.
- subtitle: eine kurze Ergänzung, z. B. „Familiengottesdienst mit Erntekrone“.
- verse und ref: ein passender Bibelvers nach Luther mit Stellenangabe, z. B. „Psalm 145,15“. Nur verwenden, wenn ich einen nenne oder du dir bei Wortlaut UND Stelle sicher bist. Sonst beide leer lassen. Ohne Anführungszeichen, die setzt das Programm.
- date: ausgeschrieben mit Wochentag, z. B. „Sonntag, 18. Oktober 2026“. Prüfe, dass der Wochentag zum Datum passt. Fehlt das Jahr, nimm das nächste passende Datum in der Zukunft.
- time: z. B. „10:00 Uhr“ oder „ab 11:00 Uhr“.
- place und address: z. B. „Kirche Jabel“ und „Dorfstraße 5“.
- people: Mitwirkende oder Programmpunkte, ein Eintrag pro Zeile, getrennt mit \n. Höchstens 4 Zeilen.
- boxTitle und boxText: der hervorgehobene Kasten für das Zweitwichtigste nach dem Termin, z. B. „Für die ganze Familie!“ und ein Satz dazu. Der Satz soll konkret sein (was genau passiert), keine Floskeln wie „bunte Überraschungen“.
- note: ein praktischer Hinweis, z. B. „Eintritt frei – Spenden erbeten“.
- closing: kurze Schlusszeile, z. B. „Wir freuen uns auf euch!“. Bei stillen Anlässen leer lassen.
- parish: Name der Gemeinde für die Fußzeile.

WICHTIGE REGELN
- Jedes Feld in "texts" muss vorhanden sein. Was du nicht füllst, setzt du auf "" (leerer Text). Lässt du ein Feld weg, setzt das Programm einen Beispieltext ein.
- Erfinde keine Namen, Uhrzeiten, Orte, Adressen oder Programmpunkte. Nutze nur, was in meinen Infos steht. Fehlt etwas, lass das Feld leer.
- Lieber wenig Text als viel. Ein Plakat wird im Vorbeigehen gelesen.
- Ansprache: herzlich und persönlich („euch“), ohne Übertreibungen und ohne Ausrufezeichen in jeder Zeile.
- Bei stillen Anlässen: "doodles": false, "sunlight": false, "filter": "original".

AUSGABE
Wenn du Dateien erstellen kannst, gib das Ergebnis als Datei „plakat.json“ zum Herunterladen aus. Sonst gib ausschließlich EINEN JSON-Codeblock aus, ohne Text davor oder danach und ohne Kommentare im JSON. Prüfe vor der Ausgabe, dass das JSON gültig ist: Anführungszeichen, Kommas, keine überzähligen Kommas.

MEINE INFOS:
`;
