/* ---------- Vorschau: Zeichnen, Hinweise unter der Vorschau, Ausschnitt per Ziehen ---------- */
import { st } from '../core/state.js';
import { clamp } from '../core/util.js';
import { renderPoster } from '../render/poster.js';
import { getLayout } from '../layouts/index.js';
import { $ } from './dom.js';
import { changed } from './sync.js';
import { syncPhotoUI } from './foto.js';

export const coarse = matchMedia('(pointer:coarse)').matches;
let cv, cctx, lastEnv=null, rafId=0, panMode=false, dragging=null;

function sizeCanvas(){
  const dpr=Math.min(window.devicePixelRatio||1,2.5), w=Math.round(clamp((cv.clientWidth||500)*dpr,300,1700));
  if (cv.width!==w){ cv.width=w; cv.height=Math.round(w*Math.SQRT2); }
}
export function requestRender(){ cancelAnimationFrame(rafId); rafId=requestAnimationFrame(()=>{ sizeCanvas(); lastEnv=renderPoster(cctx,st,cv.width,1600); updateStageBar(); }); }

export function updateStageBar(){
  const layout=getLayout(st.layout), usesPhoto=layout.photo;
  $('#noPhotoBtn').hidden = !(usesPhoto && !st.photo.src);
  $('#panToggle').hidden = !(coarse && usesPhoto && st.photo.src);
  $('#noPhotoLayoutHint').hidden = usesPhoto;
  if (!usesPhoto) $('#noPhotoLayoutName').textContent = layout.name;
}

function canvasPoint(e){ const r=cv.getBoundingClientRect(), f=cv.width/r.width; return {x:(e.clientX-r.left)*f,y:(e.clientY-r.top)*f,f}; }
function inPhoto(p){ const pr=lastEnv&&lastEnv.photoRect; return pr && !pr.empty && p.x>=pr.x && p.x<=pr.x+pr.w && p.y>=pr.y && p.y<=pr.y+pr.h; }

export function initPreview(){
  cv=$('#poster'); cctx=cv.getContext('2d');
  new ResizeObserver(()=>requestRender()).observe(cv);

  /* Ausschnitt per Ziehen verschieben (Maus direkt, Finger nach „Ausschnitt verschieben“) */
  $('#panHint').textContent = coarse ? 'Tipp: Tippen Sie unter der Vorschau auf „Ausschnitt verschieben“ und ziehen Sie das Foto dann mit dem Finger.' : 'Tipp: Ziehen Sie das Foto in der Vorschau mit der Maus, um den Ausschnitt zu verschieben.';
  $('#panToggle').addEventListener('click',()=>{ panMode=!panMode; cv.classList.toggle('pan',panMode); $('#panToggle').setAttribute('aria-pressed',panMode); $('#panToggle').textContent=panMode?'Fertig':'Ausschnitt verschieben'; });
  cv.addEventListener('pointerdown',e=>{
    if (e.pointerType!=='mouse' && !panMode) return;
    const p=canvasPoint(e); if (!inPhoto(p)) return;
    dragging={x:e.clientX,y:e.clientY}; cv.setPointerCapture(e.pointerId); cv.style.cursor='grabbing'; e.preventDefault();
  });
  cv.addEventListener('pointermove',e=>{
    if (!dragging){ if (e.pointerType==='mouse') cv.style.cursor=inPhoto(canvasPoint(e))?'grab':'default'; return; }
    const f=cv.width/cv.getBoundingClientRect().width, dx=(e.clientX-dragging.x)*f, dy=(e.clientY-dragging.y)*f, pr=lastEnv.photoRect;
    dragging={x:e.clientX,y:e.clientY};
    if (pr.dw>pr.w+1) st.photo.x=clamp(st.photo.x-2*dx/(pr.dw-pr.w),-1,1);
    if (pr.dh>pr.h+1) st.photo.y=clamp(st.photo.y-2*dy/(pr.dh-pr.h),-1,1);
    syncPhotoUI(); requestRender();
  });
  const endDrag=()=>{ if (dragging){ dragging=null; cv.style.cursor='grab'; changed(); } };
  cv.addEventListener('pointerup',endDrag); cv.addEventListener('pointercancel',endDrag);
}
