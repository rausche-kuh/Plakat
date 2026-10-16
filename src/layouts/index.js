/* ---------- Layouts: Verzeichnis ----------
   Ein neues Layout = eine neue Datei in diesem Ordner + eine Zeile in LAYOUTS.
   Anleitung: README.md in diesem Ordner. */
import einladung from './einladung.js';
import pinnwand from './pinnwand.js';
import klassisch from './klassisch.js';
import kirchenfenster from './kirchenfenster.js';
import vollbild from './vollbild.js';
import passepartout from './passepartout.js';
import medaillon from './medaillon.js';
import seitenspalte from './seitenspalte.js';
import typografie from './typografie.js';

/** Reihenfolge = Reihenfolge der Kacheln im Tab „Layout“ und in der KI-Anleitung. */
export const LAYOUTS = [einladung, pinnwand, klassisch, kirchenfenster, vollbild, passepartout, medaillon, seitenspalte, typografie];

export const LAYOUT_BY_ID = Object.fromEntries(LAYOUTS.map(l=>[l.id,l]));
export const getLayout = id => LAYOUT_BY_ID[id] || LAYOUTS[0];
