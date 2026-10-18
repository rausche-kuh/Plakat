# Plakatwerkstatt

A poster workshop for church congregations. You design posters for services and events in the browser,
then print them as a PDF or share them as an image. The user interface is in German, because the
people who use it are; this documentation is in English.

## Why this exists

In our congregation's group chats, AI-generated posters have become the favourites: warm,
hand-lettered, photo-heavy and a little playful. But image generators also bring the uncanny side:

- misspelled or garbled text and invented dates
- churches and people that don't exist
- the same glossy light on everything
- no way to fix one typo without re-rolling the whole picture

Plakatwerkstatt keeps the look and drops the uncanny part:

- **Real text.** Every letter is typeset by code in a real font, exactly as entered. Nothing is "painted".
- **Real photos.** You upload your own picture of your church, your choir, your Erntekrone.
- **The styles people like, done deliberately.** Paper notes, brush strokes, hand lettering, frosted panels
  and watercolour washes are drawn on a canvas. The same input always gives the same poster.
- **Everything stays editable.** Change the time, swap the photo, try another layout, all in one click.

## Privacy: nothing leaves the browser

Plakatwerkstatt runs entirely in the browser. There is no server, no account, no tracking and no built-in AI call.

- Texts, photos, logos and saved posters stay on the device (IndexedDB); PDF and PNG are created locally.
- "Als Link weitergeben" packs texts and design (no photo, no logo) into the link itself, after the `#`.
  Browsers never send that part to the server, so the poster only travels where you send the link.
  This needs the app on a web address; it is hidden in the Claude artifact and in the file opened from disk.
- The only network requests load the web fonts from Google Fonts. They carry no poster content,
  but like on any website using Google Fonts, the visitor's IP address reaches Google. If that
  matters for your congregation, host the font files yourself and replace the link in `web/index.html`.
- Using an AI is **optional** and always a manual copy-and-paste step you control.
  See **[docs/ai-guide.md](docs/ai-guide.md)** for how to use it with ChatGPT, Claude & co.,
  what gets shared, and how to teach the workshop a new look.

## Getting started

```sh
npm install      # once (only esbuild, for the build)
npm run dev      # → http://localhost:8000
npm run build    # → dist/plakatwerkstatt.html
```

`web/index.html` loads the sources as ES modules, so it needs a web server (`npm run dev`, GitHub Pages or similar);
opening it via `file://` does not work. `npm run build` bundles everything into **one** HTML file that works
on double-click and can be published as a Claude artifact.

## Deploying

Upload the folder `web/` and point the web server at it. Nothing else in the repository is needed online.

Send `Cache-Control: no-cache`, so browsers check every file on each visit. Without it they may keep old
JavaScript modules after an update and mix them with new ones, and the app stops at start-up. Unchanged files
only cost a short "304 Not Modified". For nginx, put this in the `server` block (not in a `location`, where
nginx would drop the server's other `add_header` lines, e.g. HSTS):

```nginx
root /path/to/Plakat/web;
add_header Cache-Control "no-cache";
```

## Layouts

Every layout works with every occasion, font and colour variant. In step 2, "Gestaltung", they are grouped
from playful to quiet:

| Group (UI name) | Layouts | For |
|---|---|---|
| **Herzlich und bunt** | Einladung, Pinnwand, Milchglas, Abriss, Aquarell | Festivals, families, summer events. These are the community favourites in the style of AI posters. |
| **Freundlich und klar** | Farbfeld, Bogen, Vollbild, Abendlicht, Doppelbogen | Concerts, baptisms, youth: clear shapes with some colour |
| **Ruhig und edel** | Klassisch, Seitenspalte, Nur Schrift | Funerals, Good Friday, remembrance |

- **Milchglas** is modelled on a summer-picnic poster from the group chat: a full-bleed photo,
  hand-lettered title and frosted glass panels.
- **Abriss** puts the photo above a torn paper edge, with the date as a round stamp.
- **Aquarell** sets the photo in a painted shape on paper with watercolour washes.
- **Farbfeld** has a bold colour field, a tilted photo print and a date stamp.
- **Bogen** sets the photo in an arch inside colourful rainbow arches.
- **Abendlicht** fades the photo on the right into the background, with a big title, one word in script
  and the date on a coloured band. It is modelled on a prayer-service poster template.
- **Doppelbogen** sets the photo in a two-lobed shape, with a large stacked date and a very large title.
  It is modelled on a concert poster template. Both look like their models with the colour "Dunkel"
  and the font "Plakativ" (heavy grotesque), which works with every other layout too.

Under the preview, „Anordnung ändern“ lets you drag the large parts of a layout (photo, text …) and resize them;
the text re-fits inside. It works in all layouts except Pinnwand, Abriss, Doppelbogen and Milchglas.

Medaillon, Passepartout and Kirchenfenster were retired. Saved posters that used them open as "Klassisch".

## Project structure

```
web/                  the website: everything nginx serves (see "Deploying")
  index.html          UI skeleton (tabs, fields, dialog)
  css/                theme · layout · components · responsive (in this order)
  src/
    main.js           start-up: wire up the UI, load the draft and fonts
    layouts/          one layout per file + index.js (registry, groups)   → README.md
    occasions/        one occasion per file: colours, sample texts, ornament   → README.md
    data/
      fontsets.js     font choices (Herzlich, Edel, …)
      beispielfotos.js  example photos: which occasion shows which, focus point
      ki-prompt.js    instruction for ChatGPT/Claude in the "KI-Entwurf" dialog (German)
    render/           drawing on the canvas
      poster.js       renderPoster(): builds env and calls the layout
      toolkit.js      single export of all drawing helpers for layouts
      blocks.js       classic typesetting (groups, automatic shrinking)
      warm.js         "Herzlich" kit (paper, brush strokes, handwriting)
      decor.js        newer building blocks: frosted glass, torn paper, watercolour, date stamp, icons, list items
      parts.js        photo, footer, frame
      text.js, shapes.js
    core/             no UI: state, colour scheme, images, storage, file format, PDF writer
    ui/               one module per step (anlass, texte, foto, layout = step "Gestaltung") and dialog (ablage = "Meine Plakate", ki, export) + preview, anordnung ("Anordnung ändern"), sync
  assets/beispielfotos/ example photos (WebP) with source and licence   → README.md
scripts/              build.mjs (single file), serve.mjs (dev server)
docs/product-concept.md  users, principles, step structure, sample texts and photos
docs/ai-guide.md      using the workshop with AI (optional)
```

## Extending

- **New layout:** [`web/src/layouts/README.md`](web/src/layouts/README.md). One file and one line in the registry.
- **New occasion:** [`web/src/occasions/README.md`](web/src/occasions/README.md). Same idea.
- **New font:** an entry in `web/src/data/fontsets.js` and the family in the Google Fonts link in `web/index.html`.

The identifiers (`id` of layouts and occasions, keys of font sets) are stored in saved posters and files,
so never rename them. A layout that is removed gets an entry in `RETIRED` in `web/src/layouts/index.js`.

## Data flow

The state of the current poster (`st` in `web/src/core/state.js`) is a plain object: occasion, layout, font,
colour variant, options, texts, `confirmed` (sample texts kept with „Passt so“), `arrange` (parts moved with
„Anordnung ändern“, per layout), photo and logo (as data URLs).
Whether a text is still a sample is not stored: `sampleKeys()` compares it with the occasion's sample text. The UI changes `st` and calls `changed()`
(`web/src/ui/sync.js`), which redraws the preview and saves the draft. `renderPoster(ctx, st, W)` draws the poster
at any resolution, the same way for preview, thumbnails and export. Saved files and AI answers go through
`sanitize()`, so unknown values fall back to defaults.
