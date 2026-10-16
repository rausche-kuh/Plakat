/* ---------- Zustand ----------
   `st` ist das aktuell bearbeitete Plakat. Es wird an vielen Stellen direkt verändert
   (st.layout = …); ganz ersetzt wird es nur über setState(). */
import { OCC } from '../occasions/index.js';
import { LAYOUT_BY_ID } from '../layouts/index.js';
import { FONTSETS } from '../data/fontsets.js';
import { clamp } from './util.js';

export const PLACE = 'Ev. Kirche St. Johannis', ADDRESS = 'Kirchplatz 1', PARISH = 'Ev.-luth. Kirchengemeinde St. Johannis';
export const FILTERS = ['original','sonnig','warm','sanft','sw','sepia'];
export const VARIANTS = ['hell','getoent','kraeftig','dunkel'];

export function defaults(occ='advent', keep){
  const t = OCC[occ].texts;
  return {v:1,id:null,name:'',occasion:occ,layout:'einladung',fontStyle:'herzlich',variant:'kraeftig',accent:null,
    ornament:true,frame:false,doodles:true,sunlight:true,titleScale:1,textScale:1,
    texts:{...t, place:keep?.place??PLACE, address:keep?.address??ADDRESS, parish:keep?.parish??PARISH},
    photo:{src:null,zoom:1,x:0,y:0,filter:'original',brightness:0},
    logo:{src:keep?.logo??null}};
}

/** Macht aus beliebigen Daten (Datei, KI-Antwort, Speicher) einen gültigen Zustand. */
export function sanitize(s){
  const d = defaults(OCC[s?.occasion]?s.occasion:'advent');
  if (!s || typeof s!=='object') return d;
  const out = {...d};
  out.id = typeof s.id==='string'?s.id:null;
  out.name = typeof s.name==='string'?s.name:'';
  out.occasion = OCC[s.occasion]?s.occasion:d.occasion;
  out.layout = LAYOUT_BY_ID[s.layout]?s.layout:d.layout;
  out.fontStyle = FONTSETS[s.fontStyle]?s.fontStyle:d.fontStyle;
  out.variant = VARIANTS.includes(s.variant)?s.variant:'hell';
  out.accent = typeof s.accent==='string' && /^#[0-9a-f]{6}$/i.test(s.accent)?s.accent:null;
  out.ornament = s.ornament!==false; out.frame = !!s.frame; out.doodles = s.doodles!==false; out.sunlight = s.sunlight!==false;
  out.titleScale = clamp(+s.titleScale||1,0.6,1.5); out.textScale = clamp(+s.textScale||1,0.8,1.3);
  out.texts = {...d.texts}; if (s.texts) for (const k in d.texts) if (typeof s.texts[k]==='string') out.texts[k]=s.texts[k];
  const p = s.photo||{};
  out.photo = {src: typeof p.src==='string'&&p.src.startsWith('data:image/')?p.src:null, zoom:clamp(+p.zoom||1,1,3), x:clamp(+p.x||0,-1,1), y:clamp(+p.y||0,-1,1), filter:FILTERS.includes(p.filter)?p.filter:'original', brightness:clamp(+p.brightness||0,-30,30)};
  out.logo = {src: typeof s.logo?.src==='string'&&s.logo.src.startsWith('data:image/')?s.logo.src:null};
  return out;
}

export let st = defaults();
export function setState(next){ st = next; }
