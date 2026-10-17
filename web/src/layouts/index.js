/* ---------- Layouts: Verzeichnis ----------
   Ein neues Layout = eine neue Datei in diesem Ordner + eine Zeile in LAYOUTS.
   Anleitung: README.md in diesem Ordner. */
import einladung from './einladung.js';
import pinnwand from './pinnwand.js';
import milchglas from './milchglas.js';
import abriss from './abriss.js';
import aquarell from './aquarell.js';
import farbfeld from './farbfeld.js';
import bogen from './bogen.js';
import klassisch from './klassisch.js';
import vollbild from './vollbild.js';
import seitenspalte from './seitenspalte.js';
import typografie from './typografie.js';

/** Gruppen im Schritt „Gestaltung“ – von verspielt bis still. Jedes Layout nennt seine Gruppe in `group`. */
export const LAYOUT_GROUPS = [
  {id:'herzlich', name:'Herzlich und bunt', sub:'Papier, Pinsel und Handschrift – für Feste und Familien'},
  {id:'freundlich', name:'Freundlich und klar', sub:'Klare Formen mit etwas Farbe'},
  {id:'ruhig', name:'Ruhig und edel', sub:'Für Trauer, Karfreitag und Gedenken'},
];

/** Reihenfolge innerhalb der Gruppen = Reihenfolge der Kacheln im Schritt „Gestaltung“ und in der KI-Anleitung. */
export const LAYOUTS = [einladung, pinnwand, milchglas, abriss, aquarell, farbfeld, bogen, vollbild, klassisch, seitenspalte, typografie];

/** Frühere Layouts, die es nicht mehr gibt: gespeicherte Plakate öffnen sich mit dem Ersatz. */
const RETIRED = {medaillon:'klassisch', passepartout:'klassisch', kirchenfenster:'klassisch'};

export const LAYOUT_BY_ID = Object.fromEntries(LAYOUTS.map(l=>[l.id,l]));
/** Gültige Layout-Kennung für id (auch für frühere Layouts) oder null */
export const layoutId = id => LAYOUT_BY_ID[id]? id : LAYOUT_BY_ID[RETIRED[id]]? RETIRED[id] : null;
export const getLayout = id => LAYOUT_BY_ID[layoutId(id)] || LAYOUTS[0];
