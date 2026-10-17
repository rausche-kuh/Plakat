# Product concept

The first version of Plakatwerkstatt was a test of the use case, built without a concept. It worked:
people liked the posters. This document describes how the workshop turns from that prototype into a product.
It is the reference for the structure of the UI. The README ("Why this exists") explains the look.

## Background

- **Then:** whoever was in charge of the posters filled in a fixed template (often a Word file) and printed it,
  usually in black and white.
- **Now:** posters are shared in WhatsApp groups. Colour and photos cost nothing any more, but the templates
  have not caught up. So people turned to ChatGPT. That is a much needed improvement, but it looks cheap and
  invents things (see README).
- **Prototype feedback:** the options are nice and useful, but too many at once. People did not understand the
  structure; it was nothing they were used to and not easy to follow.

## Users

Anyone who is in charge of making the posters: parish office, volunteers, pastors. They are not designers and
make a poster now and then. What they know is a template they fill in and print.

## Principles

1. **Fill in like a form.** The steps follow the order people think in: what is it for, how does it look,
   what does it say, which photo. The look comes before the texts because the layout decides where each piece of
   information goes and how much room it gets.
2. **The basics are enough.** Every step leads to a good poster without opening anything else.
3. **More options are welcome, as long as the UI stays clean.** Everything beyond the basics sits in a folded
   section "Weitere Einstellungen" at the end of a step, closed by default. Nothing gets removed.
4. **Nothing made-up leaves unnoticed.** Sample texts are clearly marked until the user edits or confirms them,
   example photos until the user uploads their own, and the export warns about what is left.
5. Unchanged from the prototype: real text, real photos, everything stays in the browser.

## Structure

The tabs are numbered steps, and the tab bar holds nothing else. All tabs stay freely clickable (no forced
wizard), and each step ends with a "Weiter: …" button that brings the next step to the top of the screen (on a
phone the preview sits above the steps, so the page scrolls down to them).

Two things are not steps and sit outside the tab bar, each in its own dialog:

- **Meine Plakate** (save, saved posters, backup files): a button in the header next to "Speichern" and
  "Exportieren", because it is about the whole poster, not one step.
- **KI-Entwurf**: offered below "Weiter" in step 1 ("Lieber mit einem KI-Entwurf beginnen?"), because an AI
  draft is another way to start. When the draft is applied, the dialog closes and the poster shows in the preview.

| Step | Basic | Weitere Einstellungen |
|---|---|---|
| **1 Anlass** | Occasion tiles | – |
| **2 Gestaltung** | Grundstimmung, Farbe, the layout thumbnails in their three groups | Akzentfarbe, Schrift, Feinschliff (decorations, frame, sunlight, size of all texts except the title) |
| **3 Texte** | All fields, grouped like a form: *Was?* · *Wann und wo?* · *Mehr dazu* · *Absender*. Each field has a quiet size control inside it | – (texts are content, folding them away would hide sample texts that still print) |
| **4 Foto** | Upload (until then an example photo, or "Ohne Foto"), drag in the preview, zoom, Bildstimmung | Ausschnitt sliders, reset, brightness |

The last step's button "Weiter: Exportieren" opens the export dialog.

## Text sizes

Each layout sets its own sizes, and the workshop shrinks everything together when a poster gets too full. On top of
that, every text field in step 3 has a size control inside the field, at its right edge: a small and a large "A" change
the size in 10 % steps from 50 to 200 % of what the layout would use. Once a field is not at 100 %, the value shows
between the two letters, in the accent colour, so changed fields stand out; clicking it goes back to 100 %.

- **Why percent, not points:** the same text is drawn at different sizes in each layout, in the preview and in the
  300 dpi export, and the automatic shrinking applies on top. A percentage stays true across all of them, also when
  the layout changes.
- **Gestaltung:** the slider "Größe der Texte (außer Titel)" still scales all texts except the title at once. The
  former slider for the title is gone; its value lives on as the title field's size.
- **Shared elements:** where a layout puts place and address on one line, the line follows the place size. The round
  date stamp grows with the date size, up to 150 %.
- **Storage:** one field, `sizes`, with a factor per text field; only changed fields are stored. Posters saved with the
  old `titleScale` open with that value as the title size. AI drafts don't set sizes.

## Sample texts

An occasion brings sample texts, so the preview looks like a finished poster from the start. They are examples,
not facts: the dates are invented and "Ev. Kirche St. Johannis" does not exist.

- **What counts as a sample:** a field that still holds exactly the occasion's sample text, or the default
  Ort/Adresse/Gemeinde, and that the user has not confirmed. Empty fields never count.
- **Marking in step 3 (Texte):** the field is amber, its label carries a "Beispiel" tag, and two buttons sit below it:
  "Passt so" (keep it as it is) and "Leeren". Typing removes the marking at once. The top of the step says
  "Noch N Beispieltexte – bitte prüfen".
- **Under the preview:** "N Beispieltexte ungeprüft"; a click jumps to the first one.
- **Changing the occasion:** decided field by field. Fields that still hold a sample get the new occasion's
  sample; edited, confirmed and emptied fields stay.
- **Export:** if samples are left, the export dialog first lists them and asks whether to export anyway
  ("Zu den Texten" / "Trotzdem exportieren"). Exporting anyway does not confirm them; they stay marked.
  Saving, "Meine Plakate" and backup files are not affected.
- **Storage:** a saved poster has one extra field, `confirmed`, listing the fields kept "as is". Whether a field
  is a sample is not stored but derived by comparing it with the occasion's sample text, so older posters and
  files show their samples marked without any conversion.
- **AI drafts:** texts that come from an AI answer count as the user's own; the AI only rewrites what the user
  typed in.

## Example photos

Until the user uploads a photo, the poster shows a real example photo picked by occasion (Ostern: an Easter fire,
Konzert: organ pipes …), so the preview and the layout thumbnails show how the design works with a photo. The
examples only preview the design: they are small, heavily compressed and not meant to be printed.

- **Photos:** seven real photos, CC0 or public domain only, so an exported poster needs no credit line. Sources,
  licences and the occasion mapping: `assets/beispielfotos/README.md`. No generated images.
- **Crop:** each photo has a fixed focus point that every layout crops around. Zoom, dragging and the Ausschnitt
  sliders are hidden while an example shows; Bildstimmung and Helligkeit apply.
- **Marking:** the Foto step shows a "Beispiel" tag and says which example is showing; under the preview a button
  "Beispielfoto – eigenes hochladen" opens the file picker. There is no "Passt so": the example is never the
  user's own church, so it stays marked until they upload a photo.
- **"Ohne Foto":** a checkbox in the Foto step (while no own photo is in) brings back the coloured area with the
  occasion's ornament. Removing an own photo brings the example back, unless "Ohne Foto" is ticked.
- **Export:** the warning lists the example photo along with any unchecked sample texts. The first button is
  "Zu den Texten", or "Zum Foto" when only the photo is left. Layouts without a photo never warn about it.
- **Storage:** one field, `photo.example`. New posters and applied AI drafts start with `true`; "Ohne Foto" sets
  it to `false`. Posters saved before example photos existed have no field and open as before, without one.

## Decided against

- A forced step-by-step wizard: the numbered tabs give the order, but people can jump.
- Blocking the export: a warning is enough; the user decides.
- Highlighting sample texts on the poster preview itself. Maybe later, if testers still miss the marking.
- Picking an occasion also changing the look (font, colour, layout). Occasion and look stay independent.
