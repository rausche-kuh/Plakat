/* ---------- Zustand ----------
   `st` ist das aktuell bearbeitete Plakat. Es wird an vielen Stellen direkt verändert
   (st.layout = …); ganz ersetzt wird es nur über setState(). */
import { OCC } from '../occasions/index.js';
import { layoutId, LAYOUT_BY_ID } from '../layouts/index.js';
import { FONTSETS } from '../data/fontsets.js';
import { clamp } from './util.js';

export const PLACE = 'Ev. Kirche St. Johannis', ADDRESS = 'Kirchplatz 1', PARISH = 'Ev.-luth. Kirchengemeinde St. Johannis';
export const FILTERS = ['original','sonnig','warm','sanft','sw','sepia'];
export const VARIANTS = ['hell','getoent','kraeftig','dunkel'];
export const SIZE_MIN = 0.5, SIZE_MAX = 2;   // Größe eines Textfelds (Schritt „Texte“)

export function defaults(occ='advent', keep){
  const t = OCC[occ].texts;
  return {v:1,id:null,name:'',occasion:occ,layout:'einladung',fontStyle:'herzlich',variant:'kraeftig',accent:null,
    ornament:true,frame:false,doodles:true,sunlight:true,textScale:1,sizes:{},arrange:{},
    texts:{...t, place:keep?.place??PLACE, address:keep?.address??ADDRESS, parish:keep?.parish??PARISH}, confirmed:[],
    photo:{src:null,example:true,zoom:1,x:0,y:0,filter:'original',brightness:0},
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
  out.layout = layoutId(s.layout) || d.layout;
  out.fontStyle = FONTSETS[s.fontStyle]?s.fontStyle:d.fontStyle;
  out.variant = VARIANTS.includes(s.variant)?s.variant:'hell';
  out.accent = typeof s.accent==='string' && /^#[0-9a-f]{6}$/i.test(s.accent)?s.accent:null;
  out.ornament = s.ornament!==false; out.frame = !!s.frame; out.doodles = s.doodles!==false; out.sunlight = s.sunlight!==false;
  out.textScale = clamp(+s.textScale||1,0.8,1.3);
  out.texts = {...d.texts}; if (s.texts) for (const k in d.texts) if (typeof s.texts[k]==='string') out.texts[k]=s.texts[k];
  // Größe je Textfeld als Faktor; ältere Plakate hatten nur titleScale für den Titel
  const sz = {...(s.titleScale!=null && {title:s.titleScale}), ...s.sizes}; out.sizes = {};
  for (const k in d.texts){ const v=clamp(Math.round(+sz[k]*100)/100||1,SIZE_MIN,SIZE_MAX); if (v!==1) out.sizes[k]=v; }
  // „Anordnung ändern“: je Layout die verschobenen Teile {x,y,w,h} in Plakat-Einheiten und k (Textgröße)
  out.arrange = {};
  for (const id in s.arrange){ const parts=LAYOUT_BY_ID[id]?.parts, a=s.arrange[id]; if (!parts || !a || typeof a!=='object') continue;
    for (const p of parts){ const r=a[p]; if (!r || typeof r!=='object') continue;
      const w=clamp(+r.w||0,40,1000), h=clamp(+r.h||0,40,1416);   // 1416: Plakathöhe ≈ 1414 plus Rundung (anordnung.js)
      (out.arrange[id]??={})[p]={x:clamp(+r.x||0,0,1000-w),y:clamp(+r.y||0,0,1416-h),w,h,k:clamp(+r.k||1,0.5,2)}; } }
  out.confirmed = Array.isArray(s.confirmed) ? s.confirmed.filter(k=>Object.hasOwn(d.texts,k)) : [];
  const p = s.photo||{};
  out.photo = {src: typeof p.src==='string'&&p.src.startsWith('data:image/')?p.src:null, example:p.example===true, zoom:clamp(+p.zoom||1,1,3), x:clamp(+p.x||0,-1,1), y:clamp(+p.y||0,-1,1), filter:FILTERS.includes(p.filter)?p.filter:'original', brightness:clamp(+p.brightness||0,-30,30)};
  out.logo = {src: typeof s.logo?.src==='string'&&s.logo.src.startsWith('data:image/')?s.logo.src:null};
  return out;
}

/** Felder, die noch genau den Beispieltext des Anlasses (oder den Standard-Ort) zeigen und nicht mit „Passt so“ bestätigt sind.
    Wird nicht gespeichert, sondern verglichen – so zeigen auch ältere Plakate ihre Beispieltexte. */
export function sampleKeys(s){
  const t={...OCC[s.occasion].texts, place:PLACE, address:ADDRESS, parish:PARISH};
  return Object.keys(t).filter(k=>t[k] && s.texts[k]===t[k] && !s.confirmed.includes(k));
}

export let st = defaults();
export function setState(next){ st = next; }
