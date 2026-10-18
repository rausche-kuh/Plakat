/* ---------- Bausteine der Layouts: Foto, Fußzeile, Rahmen, Farbsätze ---------- */
import { mix } from '../core/color.js';
import { shapePath } from './shapes.js';
import { sz, fontStr, measureW, drawSpaced } from './text.js';

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
    // Beispielfoto: ohne Zoom, Ausschnitt so nah wie möglich um seinen Fokuspunkt
    const p=env.photo, ex=env.example, sc=Math.max(r.w/p.width,r.h/p.height)*(ex?1:st.photo.zoom), dw=p.width*sc, dh=p.height*sc;
    const at=(o,len,d,a,f)=>ex ? Math.min(o,Math.max(o+len-d,o+len/2-f*d)) : o-(d-len)*(a+1)/2;
    ctx.drawImage(p, at(r.x,r.w,dw,st.photo.x,ex?.focus[0]), at(r.y,r.h,dh,st.photo.y,ex?.focus[1]), dw, dh);
    if (env.warmGrade){ ctx.globalCompositeOperation='soft-light'; ctx.fillStyle='rgba(255,168,80,0.38)'; ctx.fillRect(r.x,r.y,r.w,r.h); ctx.globalCompositeOperation='source-over'; }
    env.photoRect={...r,dw,dh,empty:!!ex};
  } else {
    ctx.fillStyle=ph.fill||th.soft; ctx.fillRect(r.x,r.y,r.w,r.h);
    const o=env.orn, s=Math.min(r.w/o.wf,r.h)*0.34;
    ctx.globalAlpha=0.45; o.draw(ctx,r.x+r.w/2,r.y+r.h/2,s,ph.k||{a:th.accent,b:th.line,bg:ph.fill||th.soft,c:th.second});
    env.photoRect={...r,dw:r.w,dh:r.h,empty:true};
  }
  ctx.restore();
}

/** Verschiebbarer Teil des Layouts („Anordnung ändern“): das Rechteck r des Layouts oder das, auf das der Nutzer
    den Teil gezogen hat – in Pixeln, dazu k = Textgröße (1 = wie im Layout). Merkt sich beides in env.parts für die Vorschau.
    Ändert das Layout das Ergebnis noch (z. B. Mindesthöhe), stimmt auch der Umriss in der Vorschau. */
export function arranged(env,id,r){
  const {u,st}=env, a=st.arrange?.[st.layout]?.[id], p=a? {x:a.x*u,y:a.y*u,w:a.w*u,h:a.h*u,k:a.k} : {...r,k:1};
  env.parts.push({id,r:p,def:r}); return p;
}

/** Höhe der Fußzeile (Logo und Gemeindename) in Pixeln, 0 wenn beides fehlt */
export function footerH(env){ const {u,st}=env; let h=0; if ((st.texts.parish||'').trim()) h+=20*u*st.textScale*sz(st,'parish'); if (env.logo) h+=62*u+(h?16*u:0); return h; }
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
    const f=st.textScale*sz(st,'parish'); let px=14*u*f*fs.bs; ctx.font=fontStr(fs.body,px); const txt=name.toUpperCase();
    while (measureW(ctx,txt,px*0.14)>w && px>4){ px*=0.94; ctx.font=fontStr(fs.body,px); }
    ctx.fillStyle=color; drawSpaced(ctx,txt,align==='center'?x+w/2:x,y+15*u*f,px*0.14,align);
  }
}
/** Feine Rahmenlinie im Abstand inset vom Rand */
export function drawFrame(env,inset,color){ const {ctx,W,H,u}=env; ctx.strokeStyle=color; ctx.lineWidth=Math.max(1,1.3*u); ctx.strokeRect(inset,inset,W-2*inset,H-2*inset); }
