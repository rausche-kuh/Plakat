/* ---------- Tab „Layout“: Layout-Kacheln mit Live-Miniaturen, Feinschliff ---------- */
import { st } from '../core/state.js';
import { LAYOUTS } from '../layouts/index.js';
import { renderPoster } from '../render/poster.js';
import { $, $$, listDe } from './dom.js';
import { syncUI, changed } from './sync.js';

const layoutCanvases={}; let thumbTimer;

/** Zeichnet alle Miniaturen mit dem aktuellen Plakat neu (leicht verzögert) */
export function renderLayoutThumbs(){
  clearTimeout(thumbTimer);
  thumbTimer=setTimeout(()=>{
    for (const key in layoutCanvases) renderPoster(layoutCanvases[key].getContext('2d'),{...st,layout:key},200,1600);
  },180);
}

export function initLayoutTab(){
  const layoutGrid=$('#layoutGrid');
  LAYOUTS.forEach(({id:key,name})=>{
    const b=document.createElement('button'); b.className='tile'; b.dataset.layout=key;
    const c=document.createElement('canvas'); c.width=200; c.height=Math.round(200*Math.SQRT2); layoutCanvases[key]=c;
    b.append(c); const l=document.createElement('span'); l.className='lbl'; l.textContent=name; b.append(l);
    b.addEventListener('click',()=>{ st.layout=key; syncUI(); changed(); });
    layoutGrid.append(b);
  });
  const warm=LAYOUTS.filter(l=>l.warm).map(l=>`„${l.name}“`);
  $('#warmLayoutsHint').textContent = !warm.length ? '' : `Verzierungen und Sonnenlicht wirken ${warm.length>1?'in den Layouts':'im Layout'} ${listDe(warm)}.`;

  /* Feinschliff */
  $('#optOrnament').addEventListener('change',e=>{ st.ornament=e.target.checked; changed(); });
  $('#optFrame').addEventListener('change',e=>{ st.frame=e.target.checked; changed(); });
  $('#optDoodles').addEventListener('change',e=>{ st.doodles=e.target.checked; changed(); });
  $('#optSun').addEventListener('change',e=>{ st.sunlight=e.target.checked; changed(); });
  $('#titleScale').addEventListener('input',e=>{ st.titleScale=e.target.value/100; $('#titleScaleOut').textContent=e.target.value+' %'; changed(); });
  $('#textScale').addEventListener('input',e=>{ st.textScale=e.target.value/100; $('#textScaleOut').textContent=e.target.value+' %'; changed(); });
}

export function syncLayoutTab(){
  $$('#layoutGrid .tile').forEach(t=>t.setAttribute('aria-pressed',t.dataset.layout===st.layout));
  $('#optOrnament').checked=st.ornament; $('#optFrame').checked=st.frame; $('#optDoodles').checked=st.doodles; $('#optSun').checked=st.sunlight;
  $('#titleScale').value=Math.round(st.titleScale*100); $('#titleScaleOut').textContent=Math.round(st.titleScale*100)+' %';
  $('#textScale').value=Math.round(st.textScale*100); $('#textScaleOut').textContent=Math.round(st.textScale*100)+' %';
}
