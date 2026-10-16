# Layouts

Jedes Layout ist eine eigene Datei in diesem Ordner. Für ein neues Layout musst du nur das hier lesen,
dazu `src/render/toolkit.js` und ein ähnliches bestehendes Layout als Vorlage.

## Neues Layout in zwei Schritten

1. Datei anlegen, z. B. `src/layouts/banner.js`:

   ```js
   /* Layout „Banner“ – kurze Beschreibung, was es ausmacht. */
   import { rgba, drawPhoto, blocks, fitDraw, footerH, drawFooter, drawFrame } from '../render/toolkit.js';

   export default {
     id: 'banner',        // Kennung in gespeicherten Plakaten und Dateien – später nie umbenennen
     name: 'Banner',      // Name auf der Kachel
     photo: true,         // zeigt das Layout ein Foto?
     // warm: true,       // nur wenn es den Herzlich-Baukasten nutzt (Verzierungen, Sonnenlicht)
     draw(env){
       const {W,H,u,th,st}=env;
       drawPhoto(env,{x:0,y:0,w:W,h:420*u},'rect');
       const top=470*u, fh=footerH(env), bottom=H-56*u, g=blocks(env,{orn:40});
       fitDraw(env,[...g.top,...g.verse],g.detail,{x:110*u,y:top,w:W-220*u,h:bottom-fh-(fh?40*u:0)-top},'center','center');
       drawFooter(env,110*u,W-220*u,bottom,'center',th.muted);
       if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
     }
   };
   ```

2. In `index.js` importieren und in `LAYOUTS` an der gewünschten Stelle eintragen.

Damit erledigt sich der Rest von selbst: Kachel mit Live-Miniatur im Tab „Layout“, Gültigkeit beim Laden
von Plakaten und Dateien, die Liste der erlaubten Layouts im KI-Auftrag sowie die Hinweise
„zeigt kein Foto“ (`photo: false`) und „Verzierungen wirken in …“ (`warm: true`).

## Koordinaten

Das Plakat ist **1000 Einheiten breit** und **≈ 1414 hoch** (A4 hochkant). `W` und `H` sind Pixel,
`u` ist Pixel pro Einheit – jedes Maß wird mit `u` multipliziert (`40*u`). So sieht das Plakat in der
Vorschau, in den Miniaturen und im 300-dpi-Export gleich aus.

## `env` – alles, was `draw(env)` bekommt

| Feld | Inhalt |
|---|---|
| `ctx` | Canvas-2D-Kontext. Der Hintergrund `th.bg` ist schon gefüllt. |
| `W`, `H`, `u` | Breite, Höhe in Pixeln, Pixel pro Einheit |
| `st` | Zustand des Plakats: `st.texts.*`, `st.ornament`, `st.frame`, `st.doodles`, `st.sunlight`, `st.titleScale`, `st.textScale`, `st.variant`, `st.accent`, `st.photo` |
| `th` | Farben aus Anlass + Farbvariante: `bg`, `ink`, `accent`, `soft`, `muted`, `line`, `deep`, `onDark`, `second` |
| `fs` | Schriftsatz (Rollen `title`, `verse`, `body`, `strong`, `italic`, `hand`, `handB`, `num`; siehe `src/data/fontsets.js`) |
| `occ` | der Anlass (`colors`, `warm`, `quiet` …) |
| `orn` | Zierelement des Anlasses: `orn.draw(ctx, x, y, size, {a, b, bg, c})`, mittig um (x,y), Breite `size*orn.wf` |
| `photo`, `logo` | Foto (bearbeitet) und Logo oder `null` – das Foto immer über `drawPhoto` zeichnen |
| `warmGrade` | auf `true` setzen, damit `drawPhoto` einen warmen Farbton über das Foto legt |

Lies den Zustand nur über `env.st`, nie global – die Miniaturen zeichnen dasselbe Plakat mit anderem Layout.

## Werkzeugkasten (`src/render/toolkit.js`)

**Klassischer Textsatz** – für die meisten Layouts der einfachste Weg:

- `blocks(env, {orn, col, titleBoost})` → `{top, verse, detail}`: die Texte als Gruppen.
  `top` = Zierelement (wenn `orn` gesetzt und eingeschaltet), Einladungszeile, Titel, Untertitel;
  `verse` = Bibelvers und Stelle; `detail` = Linie, Datum, Uhrzeit, Ort, Adresse, Mitwirkende, Kasten, Hinweis, Schlusszeile.
  Leere Felder fehlen automatisch. `col` ersetzt die Farben, z. B. `lightCols(env)` für helle Schrift auf Foto.
- `fitDraw(env, head, detail, rect, align, mode)`: setzt zwei Gruppen in `rect` und verkleinert alles, bis es passt.
  `align`: `'center'` | `'left'`; `mode`: `'center'` | `'top'` | `'bottom'` | `'spread'` (head oben, detail unten).
- `footerH(env)` / `drawFooter(env, x, w, bottom, align, color)`: Logo und Gemeindename unten.

**Bausteine**: `drawPhoto(env, rect, 'rect'|'arch'|'circle', {fill, k})`, `drawFrame(env, inset, color)`,
`shapePath`, `lightCols`, `ornCols`, `rgba`, `mix`.

**Herzlich-Baukasten** (siehe `einladung.js`, `pinnwand.js`): `warmCols`, `warmEls`, `warmCard`, `warmClosing`,
`warmStack`, `drawWarmFooter`, `sunGlow`, `paperGrain`, `drawPaper`, `drawBrush`, `sparkles`, `churchIcon`, `canDoodle`.

**Text auf unterster Ebene**: `fitText`, `fillLines`, `wrapLines`, `wrapBalanced`, `measureW`, `fontStr`, `quote`.

## Vorlagen

| Datei | Gut als Vorlage für |
|---|---|
| `medaillon.js`, `kirchenfenster.js` | Foto in einer Form, Text darunter |
| `klassisch.js` | Foto als Fläche, Zierelement auf der Kante |
| `vollbild.js` | Text auf dem Foto (helle Schrift, Verlauf) |
| `seitenspalte.js` | Foto als Spalte, linksbündiger Text |
| `passepartout.js` | Text oberhalb und unterhalb des Fotos |
| `typografie.js` | ohne Foto |
| `einladung.js`, `pinnwand.js` | Herzlich-Stil mit Papier und Pinsel |

## Prüfen

`npm run dev`, im Tab „Layout“ die Kachel wählen und durchprobieren: mehrere Anlässe (auch Karfreitag),
alle Schriften und Farbvarianten, mit und ohne Foto und Logo, sehr lange und leere Texte,
Titel- und Textgröße an den Grenzen, Zierelement und Rahmenlinie an/aus. Nichts darf abgeschnitten werden.
