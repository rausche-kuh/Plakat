/* ---------- Schritt 1 „Anlass“: Kacheln der Anlässe ---------- */
import { st, sampleKeys } from '../core/state.js';
import { mix } from '../core/color.js';
import { ensureImages } from '../core/images.js';
import { OCCASIONS, OCC, TPL_KEYS, occLabel } from '../occasions/index.js';
import { $, $$, toast } from './dom.js';
import { syncUI, changed } from './sync.js';

/** Wechselt den Anlass Feld für Feld: Beispieltexte werden ersetzt, eigene, bestätigte und geleerte Felder bleiben. */
async function setOccasion(key){
  if (key===st.occasion) return;
  const old=OCC[st.occasion].texts, open=sampleKeys(st), next=OCC[key].texts;
  const kept=TPL_KEYS.filter(k=>!open.includes(k) && (old[k] || st.texts[k]));
  st.occasion=key; st.accent=null;
  TPL_KEYS.forEach(k=>{ if (!kept.includes(k)) st.texts[k]=next[k]; });
  if (kept.some(k=>st.texts[k]!==next[k])){ $('#tplApply').textContent=`Beispieltexte für ${occLabel(OCC[key])} einsetzen`; $('#tplHint').hidden=false; }
  else $('#tplHint').hidden=true;
  await ensureImages(st); syncUI(); changed();
}

export function initAnlass(){
  /* Anlass-Kacheln mit Zierelement */
  const occGrid=$('#occGrid');
  OCCASIONS.forEach(({id:key})=>{
    const o=OCC[key], c0=o.colors, b=document.createElement('button'); b.className='tile'; b.dataset.occ=key; b.setAttribute('aria-pressed','false');
    const c=document.createElement('canvas'); c.width=180; c.height=120; const x=c.getContext('2d');
    x.fillStyle=c0.soft; x.fillRect(0,0,180,120);
    const k={a:c0.accent,b:mix(c0.ink,c0.soft,0.2),bg:c0.soft,c:c0.second||mix(c0.accent,c0.ink,0.35)};
    x.save(); o.ornament.draw(x,90,60,o.ornament.wf>1?56:84,k); x.restore();
    b.append(c); const l=document.createElement('span'); l.className='lbl'; l.textContent=occLabel(o); b.append(l);
    b.addEventListener('click',()=>setOccasion(key));
    occGrid.append(b);
  });
  $('#tplApply').addEventListener('click',()=>{
    TPL_KEYS.forEach(k=>st.texts[k]=OCC[st.occasion].texts[k]); st.confirmed=st.confirmed.filter(k=>!TPL_KEYS.includes(k));
    $('#tplHint').hidden=true; syncUI(); changed(); toast('Beispieltexte eingesetzt');
  });
}

export function syncAnlass(){
  $$('#occGrid .tile').forEach(t=>t.setAttribute('aria-pressed',t.dataset.occ===st.occasion));
}
