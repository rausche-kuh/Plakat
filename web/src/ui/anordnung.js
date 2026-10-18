/* ---------- „Anordnung ändern“: Teile des Layouts in der Vorschau verschieben und in der Größe ändern ----------
   Die Layouts melden ihre Teile über arranged() in env.parts. Gezogene Teile kommen in st.arrange[Layout]
   (Plakat-Einheiten, k = Textgröße). Ohne Modus bleibt die Vorschau wie bisher (Foto-Ausschnitt ziehen). */
import { st } from '../core/state.js';
import { clamp } from '../core/util.js';
import { $ } from './dom.js';
import { changed } from './sync.js';
import { requestRender, canvasPoint, lastEnv } from './preview.js';

export let arranging=false;
let cv, drag=null, guide=false, armed=0;
const HR=11, INK='#2D4B6B';   // Griff: Radius in CSS-Pixeln, getroffen wird er im doppelten Abstand (Finger)

/** Griff unten rechts, bei Teilen am Plakatrand ganz sichtbar */
const handle=(r,env,f)=>({x:Math.min(r.x+r.w,env.W-HR*f),y:Math.min(r.y+r.h,env.H-HR*f)});
/** Was liegt unter p? Zuerst die Griffe, sonst der kleinste Teil – so bleibt ein kleiner Teil auf einem großen greifbar */
function hit(p){
  const parts=lastEnv?.parts||[];
  for (const q of parts){ const c=handle(q.r,lastEnv,p.f); if (Math.hypot(p.x-c.x,p.y-c.y)<=2*HR*p.f) return {q,resize:true}; }
  const q=parts.filter(({r})=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h).sort((a,b)=>a.r.w*a.r.h-b.r.w*b.r.h)[0];
  return q && {q,resize:false};
}

function setMode(on){
  arranging=on; drag=null; guide=false; cv.classList.toggle('arrange',on); cv.style.cursor='';
  const b=$('#arrangeBtn'); b.textContent=on?'Fertig':'Anordnung ändern'; b.setAttribute('aria-pressed',on);
  $('#arrangeReset').hidden=$('#arrangeHint').hidden=!on;
  requestRender();
}
/** Nach jedem Zeichnen: Knopf nur bei Layouts mit Teilen; wechselt man zu einem ohne, endet der Modus */
export function syncArrange(layout){
  $('#arrangeBtn').hidden=!layout.parts;
  if (arranging && !layout.parts) setMode(false);
  $('#arrangeReset').disabled=!st.arrange[st.layout];
}

/** Umrisse, Griffe und beim Ziehen die Mittellinie – nur über die Vorschau, nie in den Export */
export function drawArrange(ctx,env){
  const f=cv.width/(cv.clientWidth||cv.width);
  ctx.save();
  if (guide){ ctx.strokeStyle='#D6336C'; ctx.lineWidth=1.5*f; ctx.beginPath(); ctx.moveTo(env.W/2,0); ctx.lineTo(env.W/2,env.H); ctx.stroke(); }
  for (const {r} of env.parts){
    // weiß darunter, gestrichelt darüber: auf hellem und dunklem Grund zu sehen
    ctx.setLineDash([]); ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=3*f; ctx.strokeRect(r.x,r.y,r.w,r.h);
    ctx.setLineDash([6*f,4*f]); ctx.strokeStyle=INK; ctx.lineWidth=1.5*f; ctx.strokeRect(r.x,r.y,r.w,r.h);
    const c=handle(r,env,f); ctx.setLineDash([]); ctx.fillStyle='#FFFFFF'; ctx.lineWidth=2*f;
    ctx.beginPath(); ctx.arc(c.x,c.y,HR*f*0.8,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function down(e){
  if (!arranging) return;
  const p=canvasPoint(e), h=hit(p); if (!h) return;
  drag={...h,p0:p,r0:{...h.q.r}}; cv.setPointerCapture(e.pointerId); e.preventDefault();
}
function move(e){
  if (!arranging) return;
  const p=canvasPoint(e);
  if (!drag){ if (e.pointerType==='mouse'){ const h=hit(p); cv.style.cursor=h? (h.resize?'nwse-resize':'move') : ''; } return; }
  // Plakathöhe in Einheiten schwankt je nach Auflösung um ±2 (Rundung): unten bis 1416 erlauben, der Rest wird abgeschnitten
  const {W,H,u}=lastEnv, PH=1416*u, r0=drag.r0, d=drag.q.def, dx=p.x-drag.p0.x, dy=p.y-drag.p0.y, min=80*u; let r;
  if (drag.resize){ const w=clamp(r0.w+dx,min,W-r0.x), h=clamp(r0.h+dy,min,PH-r0.y);
    r={...r0,w,h,k:clamp(Math.min(w/d.w,h/d.h)||1,0.5,2)}; }   // größer gezogen = größere Schrift, nur breiter = längere Zeilen
  else { let x=clamp(r0.x+dx,0,W-r0.w); guide=Math.abs(x+r0.w/2-W/2)<10*u; if (guide) x=(W-r0.w)/2;
    r={...r0,x,y:clamp(r0.y+dy,0,PH-r0.h)}; }
  const n=v=>Math.round(v/u*10)/10, y=n(r.y), h= r.y+r.h>H-u? 1416-y : n(r.h);   // unten bündig bleibt bündig, bei jeder Auflösung
  (st.arrange[st.layout]??={})[drag.q.id]={x:n(r.x),y,w:n(r.w),h,k:Math.round(r.k*100)/100};
  requestRender();
}
function up(){ if (!drag) return; drag=null; guide=false; changed(); }

/** Zurücksetzen fragt wie „Löschen“: erst „Wirklich zurücksetzen?“, der zweite Klick setzt zurück */
function reset(){
  const b=$('#arrangeReset');
  if (!armed){ b.textContent='Wirklich zurücksetzen?'; armed=setTimeout(()=>{ armed=0; b.textContent='Zurücksetzen'; },3500); return; }
  clearTimeout(armed); armed=0; b.textContent='Zurücksetzen';
  delete st.arrange[st.layout]; changed();
}

export function initArrange(){
  cv=$('#poster');
  $('#arrangeBtn').addEventListener('click',()=>setMode(!arranging));
  $('#arrangeReset').addEventListener('click',reset);
  cv.addEventListener('pointerdown',down); cv.addEventListener('pointermove',move);
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
}
