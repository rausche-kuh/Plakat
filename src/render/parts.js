/* ---------- Bausteine der Layouts: Foto, Fußzeile, Rahmen, Farbsätze ---------- */
import { mix } from '../core/color.js';
import { shapePath } from './shapes.js';
import { fontStr, measureW, drawSpaced } from './text.js';

/** Farben für ein Zierelement aus einem Farbsatz {accent, line|ink, ornBg?, second?} */
export function ornCols(env,col){ return {a:col.accent,b:col.line||col.ink,bg:col.ornBg||env.th.bg,c:col.second||env.th.second}; }

/** Heller Farbsatz für Text auf Foto oder dunklem Grund (z. B. Vollbild) */
export const lightCols = env => ({ink:'#FFFFFF',muted:'rgba(255,255,255,0.84)',accent:env.th.onDark,line:'rgba(255,255,255,0.88)',ornBg:env.th.deep,second:mix(env.th.second,'#ffffff',0.35)});

/** Foto in Rechteck r, beschnitten auf shape ('rect'|'arch'|'circle').
   Ohne Foto: Fläche ph.fill (sonst th.soft) mit blassem Zierelement, Farben ph.k.
   Merkt sich die Fläche in env.photoRect, damit man den Ausschnitt in der Vorschau ziehen kann. */
export function drawPhoto(env,r,shape,ph={}){
  const {ctx,th,st}=env;
  ctx.save(); shapePath(ctx,r,shape); ctx.clip();
  if (env.photo){
    const p=env.photo, sc=Math.max(r.w/p.width,r.h/p.height)*st.photo.zoom, dw=p.width*sc, dh=p.height*sc;
    ctx.drawImage(p, r.x-(dw-r.w)*(st.photo.x+1)/2, r.y-(dh-r.h)*(st.photo.y+1)/2, dw, dh);
    if (env.warmGrade){ ctx.globalCompositeOperation='soft-light'; ctx.fillStyle='rgba(255,168,80,0.38)'; ctx.fillRect(r.x,r.y,r.w,r.h); ctx.globalCompositeOperation='source-over'; }
    env.photoRect={...r,dw,dh};
  } else {
    ctx.fillStyle=ph.fill||th.soft; ctx.fillRect(r.x,r.y,r.w,r.h);
    const o=env.orn, s=Math.min(r.w/o.wf,r.h)*0.34;
    ctx.globalAlpha=0.45; o.draw(ctx,r.x+r.w/2,r.y+r.h/2,s,ph.k||{a:th.accent,b:th.line,bg:ph.fill||th.soft,c:th.second});
    env.photoRect={...r,dw:r.w,dh:r.h,empty:true};
  }
  ctx.restore();
}

/** Höhe der Fußzeile (Logo und Gemeindename) in Pixeln, 0 wenn beides fehlt */
export function footerH(env){ const {u,st}=env; let h=0; if ((st.texts.parish||'').trim()) h+=20*u*st.textScale; if (env.logo) h+=62*u+(h?16*u:0); return h; }
/** Fußzeile über der Unterkante bottom zeichnen */
export function drawFooter(env,x,w,bottom,align,color){
  const {ctx,u,fs,st}=env, name=(st.texts.parish||'').trim(), fh=footerH(env);
  if (!fh) return;
  let y=bottom-fh;
  if (env.logo){
    const L=env.logo; let lh=62*u, lw=lh*L.naturalWidth/L.naturalHeight;
    if (lw>w*0.6){ lw=w*0.6; lh=lw*L.naturalHeight/L.naturalWidth; }
    const lx = align==='center'? x+w/2-lw/2 : x;
    ctx.drawImage(L,lx,y+(62*u-lh)/2,lw,lh); y+=62*u+16*u;
  }
  if (name){
    let px=14*u*st.textScale*fs.bs; ctx.font=fontStr(fs.body,px); const txt=name.toUpperCase();
    while (measureW(ctx,txt,px*0.14)>w && px>4){ px*=0.94; ctx.font=fontStr(fs.body,px); }
    ctx.fillStyle=color; drawSpaced(ctx,txt,align==='center'?x+w/2:x,y+15*u*st.textScale,px*0.14,align);
  }
}
/** Feine Rahmenlinie im Abstand inset vom Rand */
export function drawFrame(env,inset,color){ const {ctx,W,H,u}=env; ctx.strokeStyle=color; ctx.lineWidth=Math.max(1,1.3*u); ctx.strokeRect(inset,inset,W-2*inset,H-2*inset); }
