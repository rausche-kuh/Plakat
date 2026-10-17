# Plakatwerkstatt – notes for Claude

Browser tool for parish posters (canvas, ES modules, no framework). Goal: the warm, hand-lettered look of
AI-generated posters, but with real text, real photos and nothing uncanny. See `README.md` ("Why this exists").

**Languages:** the UI and everything that ends up on a poster are German. Code comments are German too,
matching the existing code. Markdown docs are English.

## Big changes: grill, plan, then ponytail

A big change is a new feature or tab, a change across several modules, anything that touches the saved poster
format, or a new dependency. Small fixes skip this. The skills live in `.claude/skills/`.

1. **Grill:** start with a grill-me session (`/grill-me`, or the `grilling` skill when you start it yourself).
   No code yet.
2. **Plan:** the session ends in a short written plan: the decisions, the files to touch and how to check the
   result (see "Trying it out"). The user confirms it before anything gets built.
3. **Implement:** build the confirmed plan with the `ponytail` skill: the smallest change that does all of the
   plan. Anything new that comes up goes back to the user, not into the code.

**Design work on the editor UI:** the `impeccable` skill (`/impeccable <command>`). Its product context is
`docs/product-concept.md`, and the rules below win over its advice (no generated images, no network requests).

## Only read what the task needs

- **New layout:** `web/src/layouts/README.md`, `web/src/render/toolkit.js` and a similar layout from the templates table
  in that README. Then the line in `web/src/layouts/index.js` (with `group` and `about`). Nothing else.
- **New occasion:** `web/src/occasions/README.md` and an existing occasion as a template, then `web/src/occasions/index.js`.
- **Typesetting:** `web/src/render/blocks.js` (classic), `web/src/render/warm.js` (Herzlich) or `web/src/render/decor.js`
  (elements of the newer layouts). Each affects several layouts, so check which ones use it.
- **UI:** the tab's module in `web/src/ui/` plus its place in `web/index.html`. Styles in `web/css/components.css`.
- **AI usage / instruction:** `docs/ai-guide.md`, `web/src/data/ki-prompt.js`.
- **Product direction, UI structure, sample texts and photos:** `docs/product-concept.md`.
- Overview of all folders: `README.md`.

## Rules

- **Privacy:** posters, texts, photos and logos never leave the browser. No uploads, analytics, external APIs
  or AI calls from the app. AI use stays a manual copy-and-paste step by the user (dialog "KI-Entwurf", offered in step 1).
  The fonts from Google Fonts are the only network requests.
- Layouts and drawing helpers read the state only through `env.st`, never the global `st` (thumbnails render with a different layout).
- Measures in poster units times `u` (width = 1000 units).
- Never rename `id`s of layouts/occasions or font-set keys, because they are stored in saved posters.
  A removed layout goes into `RETIRED` in `web/src/layouts/index.js`.
- UI modules have no side effects on load; everything happens in `init…()`, called from `web/src/main.js`.
- Compact style like the existing code (dense drawing lines), no build step needed for development.
- `web/` is the website as deployed, and everything in it is public. Docs, notes and scripts go outside it
  (only the READMEs next to the layouts, occasions and example photos stay in `web/`).
- No `?v=…` on imports, script tags or stylesheets. The server sends `Cache-Control: no-cache` (README, "Deploying"),
  so browsers always fetch changed files. A `?v=` on only some imports loads a module twice (two separate `st`).
- Draw decorations in code (shapes, textures). Don't add generated images. The only bundled images are the real example
  photos in `web/assets/beispielfotos/` (CC0 or public domain only, see its README).

## Trying it out

`npm run dev` (http://localhost:8000). Check layouts with screenshots of the preview (e.g. with Playwright).
Cover several occasions, all colour variants and fonts, with and without a photo, and long and empty texts.
`npm run build` creates `dist/plakatwerkstatt.html` (not checked in).
