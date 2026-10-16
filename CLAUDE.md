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

## Only read what the task needs

- **New layout:** `src/layouts/README.md`, `src/render/toolkit.js` and a similar layout from the templates table
  in that README. Then the line in `src/layouts/index.js` (with `group` and `about`). Nothing else.
- **New occasion:** `src/occasions/README.md` and an existing occasion as a template, then `src/occasions/index.js`.
- **Typesetting:** `src/render/blocks.js` (classic), `src/render/warm.js` (Herzlich) or `src/render/decor.js`
  (elements of the newer layouts). Each affects several layouts, so check which ones use it.
- **UI:** the tab's module in `src/ui/` plus its place in `index.html`. Styles in `css/components.css`.
- **AI usage / instruction:** `docs/ai-guide.md`, `src/data/ki-prompt.js`.
- Overview of all folders: `README.md`.

## Rules

- **Privacy:** posters, texts, photos and logos never leave the browser. No uploads, analytics, external APIs
  or AI calls from the app. AI use stays a manual copy-and-paste step by the user (tab "KI-Entwurf").
  The fonts from Google Fonts are the only network requests.
- Layouts and drawing helpers read the state only through `env.st`, never the global `st` (thumbnails render with a different layout).
- Measures in poster units times `u` (width = 1000 units).
- Never rename `id`s of layouts/occasions or font-set keys, because they are stored in saved posters.
  A removed layout goes into `RETIRED` in `src/layouts/index.js`.
- UI modules have no side effects on load; everything happens in `init…()`, called from `src/main.js`.
- Compact style like the existing code (dense drawing lines), no build step needed for development.
- Draw decorations in code (shapes, textures). Don't add generated images.

## Trying it out

`npm run dev` (http://localhost:8000). Check layouts with screenshots of the preview (e.g. with Playwright).
Cover several occasions, all colour variants and fonts, with and without a photo, and long and empty texts.
`npm run build` creates `dist/plakatwerkstatt.html` (not checked in).
