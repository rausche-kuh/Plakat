# Using Plakatwerkstatt with AI (optional)

Plakatwerkstatt works fully without AI. Some people like to let a chatbot write the first draft,
and maintainers can use a coding assistant to add new looks. This guide covers both, and it is
explicit about what gets shared with whom.

**The ground rule:** the workshop itself never sends your texts, photos or posters anywhere.
Anything an AI sees, you pasted or uploaded to it yourself.

---

## 1. Let a chatbot draft a poster

The **„KI-Entwurf“** helper (step 1 „Anlass“, below „Weiter“: **„KI-Entwurf öffnen“**) builds a ready-made instruction (in German) that tells ChatGPT, Claude or a similar
assistant exactly which file format, occasions, layouts, fonts and colour variants exist. The AI sends back
a small JSON file, and the workshop turns it into one or two finished drafts.

### Step by step

1. Click **„KI-Entwurf öffnen“** in step 1 and type the facts under **„1. Infos zur Veranstaltung eingeben“**. Keywords are enough:
   *"Sommerpicknick, Sa 4.7.2026, 14 Uhr, Freifläche Gemeindehaus Vollrathsruhe, bei Regen Mehrzweckhalle.
   Jeder bringt Geschirr und Essen mit, Federball, Wikingerschach, Public Viewing."*
2. Click **„Auftrag kopieren“** and paste it into a **new** chat with the AI.
3. Copy the AI's **complete** answer (the copy button under the answer or on the code block works best) and paste
   it into **„3. Antwort der KI einfügen“**, then click **„Entwurf übernehmen“**. The instruction asks for one JSON
   code block in the chat. If the AI made a file anyway, download it and click **„Datei der KI öffnen“**.
4. The dialog closes and the draft shows in the preview. All drafts are also saved under **„Meine Plakate“** (header).
5. Upload **your own photo** in step 4 **Foto**, read everything once, then export.

### What the AI gets, and what it doesn't

| Shared with the AI provider | Never shared |
|---|---|
| The instruction text (layout list, rules) | Your photos and logo |
| Whatever you typed under step 1 | Your saved posters |
| | Anything else on your device |

Only type what would appear on the public poster anyway. Leave out private phone numbers, children's names,
health details and anything you would not pin to the church door. Your chat with the AI is governed by that
provider's terms, not by Plakatwerkstatt.

### What to check before printing

The instruction tells the AI not to invent names, times or places, and to quote a Bible verse only when it
is sure of the wording **and** the reference. Still check these:

- **Date and weekday.** Does "Samstag, 4. Juli 2026" really fall on a Saturday?
- **Bible verse.** Does the wording match the Lutherbibel, and is the reference right?
- **Names and places.** Are they spelled exactly as you gave them?

### Tips

- Ask for changes in the same chat, e.g. *„Mach den Titel kürzer“* or *„Bitte noch ein Entwurf mit layout aquarell“*,
  then paste the new answer again.
- Programme items with an explanation: *„Gemeinschaftsbuffet – Geschirr und Essen bringt ihr mit“*.
  Several layouts set the part after „ – “ smaller, underneath.
- For quiet occasions (Good Friday, Ewigkeitssonntag, funerals) the instruction makes the AI choose the
  calm layouts and turn off decorations.

### Why not let the AI make the whole picture?

Image generators produce the look people like, but also the uncanny details: misspelled words, made-up
dates, churches and faces that don't exist, and posters you cannot correct. Plakatwerkstatt takes only
what language models are good at, namely wording and choices, and draws the poster itself with real
text and your real photo.

### If something goes wrong

When the answer can't be read, the dialog says why, shows the affected spot and what to do. Usually the
quickest fix is to paste that message into the chat and ask for a corrected JSON. Typical causes:

- *No JSON in the answer*: the AI put it into a file or a side window (Canvas, Artifact). Copy it from there,
  open the file with „Datei der KI öffnen“, or ask: *„Bitte gib das JSON als Codeblock hier im Chat aus.“*
- *Incomplete*: not all of the answer was copied, or the AI stopped in the middle. Ask it to send the whole JSON again.
- *A mistake at a certain spot*: a straight quote `"` inside a text, a real line break inside a text, a missing or
  extra comma, curly quotes `„ “` around a field, a comment, an omission like `...`, or several JSON blocks.
  These are slips of the AI; the message names the spot so you can also fix small ones yourself.
- *No poster in the JSON*: the AI ignored the format. Ask it to stick exactly to the format in the instruction.
- A field has sample text you didn't want: the AI left the field out. Clear it in the **Texte** tab.

---

## 2. Teach the workshop a new look (maintainers)

When a poster from the group chat gets a lot of love, you can turn its *style*, not the picture itself, into a
new layout. The layout "Milchglas" was made this way from a summer-picnic poster.

1. Open this repository with a coding assistant such as Claude Code. [`CLAUDE.md`](../CLAUDE.md) tells it
   where everything is and which rules apply.
2. Give it the poster image and ask, for example: *"Build a new layout in the style of this poster."*
3. Let it check the result with screenshots, as described in
   [`src/layouts/README.md`](../src/layouts/README.md#checking). Look at several occasions, all colour variants
   and fonts, with and without a photo, and with very long and empty texts.
4. Review the diff and the screenshots like any other contribution.

Rules for new looks:

- Draw everything in code (shapes, ornaments, textures). Don't bake in AI-generated images.
- No network calls, analytics or external APIs in the app. Posters stay in the browser.
- UI text stays German. Docs are English.

**Privacy note:** the image you show the coding assistant goes to that AI provider. Only use posters you are
allowed to share, and crop or blur people, especially children.

---

## 3. Where the instruction lives

The German instruction for chatbots is `src/data/ki-prompt.js`. The lists of occasions, layouts (with their
`about` descriptions, grouped), fonts and colour variants are inserted automatically from the registries,
so a new layout or occasion is known to the AI without touching the prompt.
