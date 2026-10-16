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
   and the export warns about the ones that are left.
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
| **2 Gestaltung** | Grundstimmung, Farbe, the layout thumbnails in their three groups | Akzentfarbe, Schrift, Feinschliff (decorations, frame, sunlight, text sizes) |
| **3 Texte** | All fields, grouped like a form: *Was?* · *Wann und wo?* · *Mehr dazu* · *Absender* | – (texts are content, folding them away would hide sample texts that still print) |
| **4 Foto** | Upload, drag in the preview, zoom, Bildstimmung | Ausschnitt sliders, reset, brightness |

The last step's button "Weiter: Exportieren" opens the export dialog.

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

## Decided against

- A forced step-by-step wizard: the numbered tabs give the order, but people can jump.
- Blocking the export: a warning is enough; the user decides.
- Highlighting sample texts on the poster preview itself. Maybe later, if testers still miss the marking.
- Picking an occasion also changing the look (font, colour, layout). Occasion and look stay independent.
