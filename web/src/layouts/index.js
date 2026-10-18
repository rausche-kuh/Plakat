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
import abendlicht from './abendlicht.js';
import doppelbogen from './doppelbogen.js';
import seitenspalte from './seitenspalte.js';
import typografie from './typografie.js';
import holzschnitt from './holzschnitt.js';
import scherenschnitt from './scherenschnitt.js';
import raster from './raster.js';
import flugblatt from './flugblatt.js';
import kupferstich from './kupferstich.js';
import kontur from './kontur.js';

/** Gruppen im Schritt „Gestaltung“ – von verspielt bis still. Jedes Layout nennt seine Gruppe in `group`. */
export const LAYOUT_GROUPS = [
  {id:'herzlich', name:'Herzlich und bunt', sub:'Papier, Pinsel und Handschrift – für Feste und Familien'},
  {id:'freundlich', name:'Freundlich und klar', sub:'Klare Formen mit etwas Farbe'},
  {id:'ruhig', name:'Ruhig und edel', sub:'Für Trauer, Karfreitag und Gedenken'},
  {id:'schwarzweiss', name:'Klar in Schwarz-Weiß', sub:'Wenig Tinte, kräftige Linien – auch für den Kopierer'},
];

/** Reihenfolge innerhalb der Gruppen = Reihenfolge der Kacheln im Schritt „Gestaltung“ und in der KI-Anleitung. */
export const LAYOUTS = [einladung, pinnwand, milchglas, abriss, aquarell, farbfeld, bogen, vollbild, abendlicht, doppelbogen, klassisch, seitenspalte, typografie, holzschnitt, scherenschnitt, raster, flugblatt, kupferstich, kontur];

/** Frühere Layouts, die es nicht mehr gibt: gespeicherte Plakate öffnen sich mit dem Ersatz. */
const RETIRED = {medaillon:'klassisch', passepartout:'klassisch', kirchenfenster:'klassisch'};

export const LAYOUT_BY_ID = Object.fromEntries(LAYOUTS.map(l=>[l.id,l]));
/** Gültige Layout-Kennung für id (auch für frühere Layouts) oder null */
export const layoutId = id => LAYOUT_BY_ID[id]? id : LAYOUT_BY_ID[RETIRED[id]]? RETIRED[id] : null;
export const getLayout = id => LAYOUT_BY_ID[layoutId(id)] || LAYOUTS[0];
