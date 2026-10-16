/* ---------- Werkzeugkasten für Layouts ----------
   Alles, was eine Layout-Datei zum Zeichnen braucht, kommt von hier.
   Anleitung und Beschreibung von env: src/layouts/README.md */

// Farben
export { mix, rgba } from '../core/color.js';
// Formen: Pfade für Foto-Ausschnitte, Zufall mit festem Startwert, Drehen
export { shapePath, rng, rot, flame, heart } from './shapes.js';
// Textsatz auf unterster Ebene
export { fontStr, measureW, drawSpaced, wrapLines, wrapBalanced, quote, tLines, maxLineW, fillLines, fitText } from './text.js';
// Bausteine: Foto, Fußzeile, Rahmen, Farbsätze
export { drawPhoto, footerH, drawFooter, drawFrame, lightCols, ornCols } from './parts.js';
// Klassischer Textsatz (Klassisch, Vollbild, Seitenspalte, Nur Schrift, Bogen, Farbfeld)
export { blocks, measureGroup, drawGroup, fitDraw } from './blocks.js';
// Herzlich-Baukasten (Einladung, Pinnwand, Abriss, Aquarell)
export { canDoodle, drawPaper, drawBrush, churchIcon, sparkles, warmCols, warmEls, warmCard, warmClosing, warmStack, warmFooterH, drawWarmFooter, sunGlow, paperGrain } from './warm.js';
// Dekor und Elemente der neueren Layouts (Milchglas, Abriss, Aquarell, Bogen, Farbfeld)
export { dateParts, listItems, luma, inkOn, glassCols, icon, rrect, glassPath, frost, tornPath, wash, washLayer, blobPath, dateBadge, textEl, infoEl, listEl, panelEl, stackAt, stackH } from './decor.js';
