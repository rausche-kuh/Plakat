# Anlässe

Jeder Anlass ist eine eigene Datei: Farben, Beispieltexte und ein gezeichnetes Zierelement.
Neuer Anlass: Datei anlegen (z. B. eine bestehende kopieren) und in `index.js` in `OCCASIONS` eintragen.
Kachel, Gültigkeit beim Laden und die Liste im KI-Auftrag ergeben sich daraus.

```js
import { flame } from '../render/shapes.js';   // nur falls gebraucht (flame, heart)

export default {
  id: 'sommerfest',          // Kennung in gespeicherten Plakaten – später nie umbenennen
  name: 'Sommerfest',
  short: 'Sommer',           // optional: kürzerer Name für Kachel und Liste
  quiet: true,               // optional: stiller Anlass – keine Verzierungen (Striche, Kirchen-Symbol)
  colors: {                  // Farbvarianten „Hell“, „Getönt“, „Dunkel“
    paper: '#…',             //   Hintergrund „Hell“
    ink: '#…',               //   Schrift
    accent: '#…',            //   Akzent (Uhrzeit, Linien, Zierelement)
    onDark: '#…',            //   Akzent auf dunklem Grund („Dunkel“, „Vollbild“)
    deep: '#…',              //   Hintergrund „Dunkel“, Verlauf bei „Vollbild“
    soft: '#…',              //   Hintergrund „Getönt“, Fläche ohne Foto
    second: '#…',            //   optional: Zweitfarbe
  },
  warm: { paper: '#…', ink: '#…', a: '#…', b: '#…' },   // Farbvariante „Kräftig“: Papier, Schrift, Akzent, Zweitfarbe
  texts: {                   // Beispieltexte; fehlende Felder bleiben leer
    eyebrow: 'Herzliche Einladung zum', title: '…', subtitle: '…', verse: '…', ref: '…',
    date: 'Sonntag, …', time: '… Uhr', people: 'Zeile 1\nZeile 2', boxTitle: '…', boxText: '…', note: '…', closing: '…',
  },
  ornament: {
    wf: 1,                   // Breite im Verhältnis zur Höhe (z. B. 1.6 für die Wimpelkette)
    draw(c,x,y,s,k){ … },    // mittig um (x,y), Höhe s, Breite s*wf
  },                         // Farben k: a = Akzent, b = Linien, bg = Hintergrund (zum Ausstanzen), c = Zweitfarbe
};
```

Ort, Adresse und Gemeinde sind keine Beispieltexte des Anlasses, sondern gelten für alle (`src/core/state.js`).

Bei einem stillen Anlass zusätzlich den festen Hinweis in `index.html` („Am Karfreitag und Ewigkeitssonntag
bleiben sie weg.“) und die Ausnahme-Regel im KI-Auftrag (`src/data/ki-prompt.js`) anpassen.
