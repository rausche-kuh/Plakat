/* ---------- Tab „Layout“: Layout-Kacheln mit Live-Miniaturen (nach Gruppen), Feinschliff ---------- */
import { st } from '../core/state.js';
import { LAYOUTS, LAYOUT_GROUPS } from '../layouts/index.js';
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
  const box=$('#layoutGroups');
  LAYOUT_GROUPS.forEach(gr=>{
    const list=LAYOUTS.filter(l=>l.group===gr.id); if (!list.length) return;
    const sec=document.createElement('section'); sec.className='lgroup';
    sec.innerHTML=`<h3>${gr.name}</h3><p class="hint">${gr.sub}</p>`;
    const grid=document.createElement('div'); grid.className='grid layouts';
    list.forEach(({id:key,name,about})=>{
      const b=document.createElement('button'); b.className='tile'; b.dataset.layout=key; if (about) b.title=about;
      const c=document.createElement('canvas'); c.width=200; c.height=Math.round(200*Math.SQRT2); layoutCanvases[key]=c;
      b.append(c); const l=document.createElement('span'); l.className='lbl'; l.textContent=name; b.append(l);
      b.addEventListener('click',()=>{ st.layout=key; syncUI(); changed(); });
      grid.append(b);
    });
    sec.append(grid); box.append(sec);
  });
  // Hinweis, wo Verzierungen und Sonnenlicht wirken: ganze Gruppen beim Namen nennen, sonst die Layouts aufzählen
  const warm=LAYOUTS.filter(l=>l.warm), whole=LAYOUT_GROUPS.filter(g=>LAYOUTS.some(l=>l.group===g.id) && LAYOUTS.filter(l=>l.group===g.id).every(l=>l.warm));
  const rest=warm.filter(l=>!whole.some(g=>g.id===l.group)).map(l=>`„${l.name}“`), parts=[...whole.map(g=>`allen Layouts unter „${g.name}“`),...rest];
  $('#warmLayoutsHint').textContent = !warm.length ? '' : whole.length ? `Verzierungen und Sonnenlicht wirken in ${listDe(parts)}.`
    : `Verzierungen und Sonnenlicht wirken ${warm.length>1?'in den Layouts':'im Layout'} ${listDe(rest)}.`;

  /* Feinschliff */
  $('#optOrnament').addEventListener('change',e=>{ st.ornament=e.target.checked; changed(); });
  $('#optFrame').addEventListener('change',e=>{ st.frame=e.target.checked; changed(); });
  $('#optDoodles').addEventListener('change',e=>{ st.doodles=e.target.checked; changed(); });
  $('#optSun').addEventListener('change',e=>{ st.sunlight=e.target.checked; changed(); });
  $('#titleScale').addEventListener('input',e=>{ st.titleScale=e.target.value/100; $('#titleScaleOut').textContent=e.target.value+' %'; changed(); });
  $('#textScale').addEventListener('input',e=>{ st.textScale=e.target.value/100; $('#textScaleOut').textContent=e.target.value+' %'; changed(); });
}

export function syncLayoutTab(){
  $$('#layoutGroups .tile').forEach(t=>t.setAttribute('aria-pressed',t.dataset.layout===st.layout));
  $('#optOrnament').checked=st.ornament; $('#optFrame').checked=st.frame; $('#optDoodles').checked=st.doodles; $('#optSun').checked=st.sunlight;
  $('#titleScale').value=Math.round(st.titleScale*100); $('#titleScaleOut').textContent=Math.round(st.titleScale*100)+' %';
  $('#textScale').value=Math.round(st.textScale*100); $('#textScaleOut').textContent=Math.round(st.textScale*100)+' %';
}
