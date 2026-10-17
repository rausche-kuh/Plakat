/* ---------- Anlässe: Verzeichnis ----------
   Ein neuer Anlass = eine neue Datei in diesem Ordner + eine Zeile in OCCASIONS.
   Aufbau einer Anlass-Datei: siehe README.md in diesem Ordner. */
import advent from './advent.js';
import weihnachten from './weihnachten.js';
import passion from './passion.js';
import ostern from './ostern.js';
import pfingsten from './pfingsten.js';
import erntedank from './erntedank.js';
import reformation from './reformation.js';
import konfirmation from './konfirmation.js';
import taufe from './taufe.js';
import konzert from './konzert.js';
import gemeindefest from './gemeindefest.js';
import ewigkeit from './ewigkeit.js';

/** Reihenfolge = Reihenfolge der Kacheln im Tab „Anlass“. Der erste Eintrag ist der Standard. */
export const OCCASIONS = [advent, weihnachten, passion, ostern, pfingsten, erntedank, reformation, konfirmation, taufe, konzert, gemeindefest, ewigkeit];

/** Textfelder, die ein Anlass als Beispieltext mitbringt (fehlende werden zu ''). */
export const TPL_KEYS = ['eyebrow','title','subtitle','verse','ref','date','time','people','boxTitle','boxText','note','closing'];

export const OCC = {};
for (const o of OCCASIONS){ const t={}; TPL_KEYS.forEach(k=>t[k]=''); OCC[o.id]={...o, texts:Object.assign(t,o.texts)}; }
export const OCC_KEYS = OCCASIONS.map(o=>o.id);

export const getOccasion = id => OCC[id] || OCC[OCC_KEYS[0]];
/** Kurzname für Kacheln und Listen */
export const occLabel = o => o ? (o.short||o.name) : '';
