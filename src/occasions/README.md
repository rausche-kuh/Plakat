# Occasions

Each occasion is a file of its own: colours, sample texts and a drawn ornament.
New occasion: create a file (e.g. copy an existing one) and add it to `OCCASIONS` in `index.js`.
The tile, validity when loading and the list in the AI instruction follow from that.
Sample texts and names are German, because they appear on the posters.

```js
import { flame } from '../render/shapes.js';   // only if needed (flame, heart)

export default {
  id: 'sommerfest',          // stored in saved posters – never rename later
  name: 'Sommerfest',
  short: 'Sommer',           // optional: shorter name for tile and lists
  quiet: true,               // optional: quiet occasion – no decorations (strokes, hearts, church icon)
  colors: {                  // colour variants "Hell", "Getönt", "Dunkel"
    paper: '#…',             //   background "Hell"
    ink: '#…',               //   text
    accent: '#…',            //   accent (time, rules, ornament)
    onDark: '#…',            //   accent on dark ground ("Dunkel", "Vollbild")
    deep: '#…',              //   background "Dunkel", gradient in "Vollbild"
    soft: '#…',              //   background "Getönt", area without photo
    second: '#…',            //   optional: second colour (date stamps, arches, watercolour)
  },
  warm: { paper: '#…', ink: '#…', a: '#…', b: '#…' },   // colour variant "Kräftig": paper, text, accent, second colour
  texts: {                   // sample texts; missing fields stay empty
    eyebrow: 'Herzliche Einladung zum', title: '…', subtitle: '…', verse: '…', ref: '…',
    date: 'Sonntag, …', time: '… Uhr', people: 'Zeile 1\nZeile 2', boxTitle: '…', boxText: '…', note: '…', closing: '…',
  },
  ornament: {
    wf: 1,                   // width relative to height (e.g. 1.6 for the bunting)
    draw(c,x,y,s,k){ … },    // centred on (x,y), height s, width s*wf
  },                         // colours k: a = accent, b = lines, bg = background (for cut-outs), c = second colour
};
```

Place, address and parish are not sample texts of the occasion; they apply to all occasions (`src/core/state.js`).

For a quiet occasion, also adjust the fixed hint in `index.html` („Am Karfreitag und Ewigkeitssonntag
bleiben sie weg.“) and the exception rule in the AI instruction (`src/data/ki-prompt.js`).
