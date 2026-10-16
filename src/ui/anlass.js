/* ---------- Tab „Anlass“: Grundstimmung, Anlass, Farbe, Schrift ---------- */
import { st } from '../core/state.js';
import { mix } from '../core/color.js';
import { theme } from '../core/theme.js';
import { OCCASIONS, OCC, TPL_KEYS, occLabel } from '../occasions/index.js';
import { FONTSETS } from '../data/fontsets.js';
import { $, $$, toast } from './dom.js';
import { syncUI, changed } from './sync.js';

/** Grundstimmungen (Kacheln in index.html): Voreinstellungen für Schrift, Farbe und Layout.
    Eine Kachel gilt als gewählt, wenn Schrift und Farbvariante passen. */
const MOODS = {
  herzlich:{fontStyle:'herzlich',variant:'kraeftig',layout:'einladung',doodles:true,sunlight:true},
  freundlich:{fontStyle:'freundlich',variant:'getoent',layout:'farbfeld'},
  ruhig:{fontStyle:'edel',variant:'hell',layout:'klassisch'}
};

function textsAreTemplate(occ){ const t=OCC[occ].texts; return TPL_KEYS.every(k=>(st.texts[k]||'').trim()===(t[k]||'').trim() || !(st.texts[k]||'').trim()); }
/** Wechselt den Anlass; unveränderte Beispieltexte werden ersetzt, eigene Texte bleiben. */
function setOccasion(key){
  if (key===st.occasion) return;
  const untouched=textsAreTemplate(st.occasion);
  st.occasion=key; st.accent=null;
  if (untouched){ TPL_KEYS.forEach(k=>st.texts[k]=OCC[key].texts[k]); $('#tplHint').hidden=true; }
  else { $('#tplApply').textContent=`Beispieltexte für ${occLabel(OCC[key])} einsetzen`; $('#tplHint').hidden=false; }
  syncUI(); changed();
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
  $('#tplApply').addEventListener('click',()=>{ TPL_KEYS.forEach(k=>st.texts[k]=OCC[st.occasion].texts[k]); $('#tplHint').hidden=true; syncUI(); changed(); toast('Beispieltexte eingesetzt'); });

  /* Farbe */
  $$('#variantSeg button').forEach(b=>b.addEventListener('click',()=>{ st.variant=b.dataset.v; syncUI(); changed(); }));
  $('#accentPick').addEventListener('input',e=>{ st.accent=e.target.value; changed(); });
  $('#accentReset').addEventListener('click',()=>{ st.accent=null; syncUI(); changed(); });

  /* Schriften */
  const fontGrid=$('#fontGrid');
  Object.entries(FONTSETS).forEach(([key,f])=>{
    const b=document.createElement('button'); b.className='tile'; b.dataset.font=key;
    b.innerHTML=`<span class="sample" style="font-family:${f.css},Georgia,serif;font-weight:${f.cssW}">Gottesdienst</span><span class="lbl">${f.name}</span><span class="sub">${f.sub}</span>`;
    b.addEventListener('click',()=>{ st.fontStyle=key; syncUI(); changed(); });
    fontGrid.append(b);
  });

  /* Grundstimmung */
  $$('#moodGrid .tile').forEach(b=>b.addEventListener('click',()=>{
    Object.assign(st,MOODS[b.dataset.mood]);
    st.accent=null; syncUI(); changed();
  }));
}

export function syncAnlass(){
  $$('#occGrid .tile').forEach(t=>t.setAttribute('aria-pressed',t.dataset.occ===st.occasion));
  $$('#fontGrid .tile').forEach(t=>t.setAttribute('aria-pressed',t.dataset.font===st.fontStyle));
  $$('#variantSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===st.variant));
  $('#accentPick').value=theme(st).accent; $('#accentReset').hidden=!st.accent;
  $$('#moodGrid .tile').forEach(t=>{ const m=MOODS[t.dataset.mood]; t.setAttribute('aria-pressed', st.fontStyle===m.fontStyle&&st.variant===m.variant); });
}
