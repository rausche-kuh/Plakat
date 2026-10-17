/* ---------- Schritt 2 „Gestaltung“: Grundstimmung, Farbe, Layout-Kacheln mit Live-Miniaturen (nach Gruppen);
   unter „Weitere Einstellungen“ Akzentfarbe, Schrift und Feinschliff ---------- */
import { st } from '../core/state.js';
import { theme } from '../core/theme.js';
import { LAYOUTS, LAYOUT_GROUPS } from '../layouts/index.js';
import { FONTSETS } from '../data/fontsets.js';
import { renderPoster } from '../render/poster.js';
import { $, $$, listDe } from './dom.js';
import { syncUI, changed } from './sync.js';

const layoutCanvases={}; let thumbTimer;

/** Grundstimmungen (Kacheln in index.html): Voreinstellungen für Schrift, Farbe und Layout.
    Eine Kachel gilt als gewählt, wenn Schrift und Farbvariante passen. */
const MOODS = {
  herzlich:{fontStyle:'herzlich',variant:'kraeftig',layout:'einladung',doodles:true,sunlight:true},
  freundlich:{fontStyle:'freundlich',variant:'getoent',layout:'farbfeld'},
  ruhig:{fontStyle:'edel',variant:'hell',layout:'klassisch'}
};

/** Zeichnet alle Miniaturen mit dem aktuellen Plakat neu (leicht verzögert) */
export function renderLayoutThumbs(){
  clearTimeout(thumbTimer);
  thumbTimer=setTimeout(()=>{
    for (const key in layoutCanvases) renderPoster(layoutCanvases[key].getContext('2d'),{...st,layout:key},200,1600);
  },180);
}

export function initLayoutTab(){
  /* Grundstimmung */
  $$('#moodGrid .tile').forEach(b=>b.addEventListener('click',()=>{
    Object.assign(st,MOODS[b.dataset.mood]);
    st.accent=null; syncUI(); changed();
  }));

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

  /* Layouts */
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
  $$('#fontGrid .tile').forEach(t=>t.setAttribute('aria-pressed',t.dataset.font===st.fontStyle));
  $$('#variantSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===st.variant));
  $('#accentPick').value=theme(st).accent; $('#accentReset').hidden=!st.accent;
  $$('#moodGrid .tile').forEach(t=>{ const m=MOODS[t.dataset.mood]; t.setAttribute('aria-pressed', st.fontStyle===m.fontStyle&&st.variant===m.variant); });
  $$('#layoutGroups .tile').forEach(t=>t.setAttribute('aria-pressed',t.dataset.layout===st.layout));
  $('#optOrnament').checked=st.ornament; $('#optFrame').checked=st.frame; $('#optDoodles').checked=st.doodles; $('#optSun').checked=st.sunlight;
  $('#titleScale').value=Math.round(st.titleScale*100); $('#titleScaleOut').textContent=Math.round(st.titleScale*100)+' %';
  $('#textScale').value=Math.round(st.textScale*100); $('#textScaleOut').textContent=Math.round(st.textScale*100)+' %';
}
