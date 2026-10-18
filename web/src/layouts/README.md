# Layouts

Each layout is a file of its own in this folder. To write a new one you only need this page,
`web/src/render/toolkit.js` and a similar existing layout as a template (see the table below).

## A new layout in two steps

1. Create the file, e.g. `web/src/layouts/banner.js` (code comments and UI strings are German, like the rest of the code):

   ```js
   /* Layout „Banner“ – kurze Beschreibung, was es ausmacht. */
   import { rgba, drawPhoto, blocks, fitDraw, footerH, drawFooter, drawFrame } from '../render/toolkit.js';

   export default {
     id: 'banner',        // stored in saved posters and files – never rename later
     name: 'Banner',      // name on the tile (German)
     group: 'freundlich', // 'herzlich' | 'freundlich' | 'ruhig' – group in the Layout tab (LAYOUT_GROUPS in index.js)
     about: 'Foto oben als breites Band, Text mittig darunter',  // German one-liner: tile tooltip and AI instruction
     photo: true,         // does the layout show a photo?
     // warm: true,       // only if it uses the "Herzlich" extras (decorations, sunlight)
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

2. Import it in `index.js` and add it to `LAYOUTS` at the desired position (order within a group = order of the tiles).

Everything else follows automatically: the tile with a live thumbnail under its group in step 2 "Gestaltung",
validity when loading posters and files, the grouped layout list with descriptions in the AI instruction,
and the hints "zeigt kein Foto" (`photo: false`) and "Verzierungen wirken in …" (`warm: true`).

To let people move its parts with "Anordnung ändern", see [Movable parts](#movable-parts) below.

**Removing a layout:** delete the file and its line, and add its id to `RETIRED` in `index.js` with the layout
that should open instead. Saved posters keep working.

## Coordinates

The poster is **1000 units wide** and **≈ 1414 high** (A4 portrait). `W` and `H` are pixels,
`u` is pixels per unit, so every measure is multiplied by `u` (`40*u`). That way the poster looks the same in the
preview, in the thumbnails and in the 300 dpi export.

## `env`: everything `draw(env)` receives

| Field | Content |
|---|---|
| `ctx` | Canvas 2D context. The background `th.bg` is already filled. |
| `W`, `H`, `u` | width, height in pixels, pixels per unit |
| `st` | poster state: `st.texts.*`, `st.sizes` (size factor per text field, read it with `sz(st, key)`), `st.textScale`, `st.ornament`, `st.frame`, `st.doodles`, `st.sunlight`, `st.variant`, `st.accent`, `st.photo` |
| `th` | colours from occasion + colour variant: `bg`, `ink`, `accent`, `soft`, `muted`, `line`, `deep`, `onDark`, `second` |
| `fs` | font set (roles `title`, `verse`, `body`, `strong`, `italic`, `hand`, `handB`, `num`, and optionally `script` for single decorative words, so fall back to `handB`; see `web/src/data/fontsets.js`) |
| `occ` | the occasion (`colors`, `warm`, `quiet` …) |
| `orn` | the occasion's ornament: `orn.draw(ctx, x, y, size, {a, b, bg, c})`, centred on (x,y), width `size*orn.wf` |
| `photo`, `logo` | photo (processed) and logo, or `null`. Without an own photo, `photo` is the example photo (`example` holds its focus point). Always draw the photo via `drawPhoto`. |
| `warmGrade` | set to `true` so `drawPhoto` lays a warm tint over the photo |

Read the state only through `env.st`, never the global one, because the thumbnails draw the same poster with a different layout.

## Toolkit (`web/src/render/toolkit.js`)

**Classic typesetting** is the simplest route for most layouts:

- `blocks(env, {orn, col, titleBoost})` → `{top, verse, detail}`: the texts as groups.
  `top` = ornament (if `orn` is set and switched on), invitation line, title, subtitle;
  `verse` = Bible verse and reference; `detail` = rule, date, time, place, address, people, box, note, closing line.
  Empty fields are left out automatically. `col` replaces the colours, e.g. `lightCols(env)` for light text on a photo.
- `fitDraw(env, head, detail, rect, align, mode)`: sets two groups in `rect` and shrinks everything until it fits.
  `align`: `'center'` | `'left'`; `mode`: `'center'` | `'top'` | `'bottom'` | `'spread'` (head at the top, detail at the bottom).
- `footerH(env)` / `drawFooter(env, x, w, bottom, align, color)`: logo and parish name at the bottom.

**Building blocks**: `drawPhoto(env, rect, 'rect'|'arch'|'circle', {fill, k})`, `drawFrame(env, inset, color)`, `arranged` (see below),
`shapePath`, `lightCols`, `ornCols`, `rgba`, `mix`.

**Herzlich kit** (see `einladung.js`, `pinnwand.js`): `warmCols`, `warmEls`, `warmCard`, `warmClosing`,
`warmStack`, `drawWarmFooter`, `sunGlow`, `paperGrain`, `drawPaper`, `drawBrush`, `sparkles`, `churchIcon`, `canDoodle`.

**Elements and decor** (`decor.js`, see `milchglas.js`, `abriss.js`, `aquarell.js`, `farbfeld.js`). Elements have the
form `{gap, measure(k) → height, draw(y), width()}` and can be stacked with `warmStack` (distributes space) or
`stackAt` (compact from y):

- `textEl(env, {text, font, size, lh, color, x, w, align, shadow, deg, upper, sp})`: one text block.
- `infoEl(env, {rows:[{icon:'date'|'time'|'place', text, sub}], …})`: date, time and place with line icons.
- `listEl(env, {items: listItems(T.people), …})`: programme as a bullet list; text after „ – “ becomes a smaller line.
- `panelEl(env, els, {x, w, gc: glassCols(env), notch, anchor, align, deg})`: frosted glass panel that hugs its content.
- `dateParts(text)` → `{wd, day, month, year}` or `null`; `dateBadge(env, cx, cy, R, parts, {fill, ink, deg, scallop, fonts})`.
- `frost`, `glassPath`, `tornPath` (torn paper edge), `wash` + `washLayer` (watercolour), `blobPath` (painted outline),
  `icon`, `rrect`, `inkOn` (readable text colour on a fill).

**Text at the lowest level**: `fitText`, `fillLines`, `wrapLines`, `wrapBalanced`, `measureW`, `fontStr`, `quote`.

**Text sizes:** every text field has its own size factor from step 3 "Texte" (50–200 %). `blocks`, the Herzlich kit and the
footer apply it already. When a layout sets a size itself, multiply it by `sz(st, key)`: the title by `sz(st,'title')` alone,
every other text also by `st.textScale` (e.g. `size: 38*st.textScale*sz(st,'subtitle')`). In `infoEl`, each row takes its
factor as `f` (and `sf` for the line below). Where two fields share one element (place and address on one line), use the
place factor, or the address factor when the place is empty.

## Movable parts

Under the preview, "Anordnung ändern" lets people drag a layout's large parts and resize them with a handle at the
bottom-right corner. A layout takes part by listing its parts and running each part's rectangle through `arranged()`:

```js
parts: ['photo','text'],  // stored in saved posters – never rename later
draw(env){
  const {W,H,u}=env, p=arranged(env,'photo',{x:0,y:0,w:W,h:420*u});  // the layout's rect, or where the user put it
  drawPhoto(env,p,'rect');
  fitDraw(env,head,detail,arranged(env,'text',{x:110*u,y:470*u,w:W-220*u,h:800*u}),'center','center');
}
```

- `arranged(env, id, rect)` returns the rect the user set, or `rect` itself, in pixels, plus `k`: the text size (1 = as in
  the layout, 0.5–2; a bigger part means bigger text). `fitDraw`, `warmStack` and `stackAt` (5th argument) start at `k`.
  The rect is remembered in `env.parts` for the outline in the preview, so if the layout still changes it (a minimum height,
  as in `bogen.js`), change the returned object.
- A part is a large block, such as the photo or the whole text, never a single field. Whatever belongs to it is computed from
  the returned rect, so it moves along: the ornament on the photo edge, the date stamp, the arches, the shading behind text
  on a full-bleed photo (`vollbild.js`, `einladung.js`). Neighbours are computed from the *default* rects, so moving one
  part never pushes another.
- Call `arranged()` before building elements that take a fixed `x`/`w` (`textEl`, `warmEls`, …) and pass its `x`/`w` in.
  Anything drawn at `W/2` stays behind otherwise (see the box in `aquarell.js`).
- Only parts the user touched are stored (`st.arrange[layout][id]`, poster units). Untouched parts keep adapting to the
  content as before, and a poster nobody rearranged looks exactly as without the feature.
- Without `parts`, the button is hidden. Pinnwand, Abriss, Doppelbogen and Milchglas have none: their photo size follows
  the amount of text, or all their text is fitted as one.

## Templates

| File | Good template for |
|---|---|
| `klassisch.js`, `bogen.js` | photo as an area or shape, text centred below |
| `vollbild.js` | text on the photo (light type, gradient) |
| `seitenspalte.js` | photo as a column, left-aligned text |
| `farbfeld.js` | colour field, tilted photo, date stamp, icon rows |
| `typografie.js` | no photo |
| `einladung.js`, `pinnwand.js` | Herzlich style with paper and brush strokes |
| `milchglas.js` | text panels on a full-bleed photo, regions shrink together |
| `abriss.js`, `aquarell.js` | Herzlich style with element stacks and adaptive photo size |
| `abendlicht.js` | photo fading into the background, text column that shrinks as a whole |
| `doppelbogen.js` | photo in a custom clip shape, text on the photo with a soft background glow |

## Checking

Run `npm run dev`, pick the tile in step 2 "Gestaltung" and try it out:

- several occasions, including Karfreitag
- all fonts and colour variants
- with and without photo and logo
- very long and empty texts
- text sizes at their limits (50 and 200 % on single fields in step "Texte", the text slider in step "Gestaltung")
- ornament and frame on and off
- with `parts`: each part moved, enlarged and shrunk in "Anordnung ändern"

Nothing may be cut off or overlap. For many combinations at once, render posters with
`renderPoster(ctx, state, W)` in a Playwright script and look at a contact sheet.
