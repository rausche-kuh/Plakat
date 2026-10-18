/* Layout „Raster“ – das Foto als grobes Punktraster im Kreis wie ein Siebdruck, die Punkte laufen zum Rand ins Papier aus.
   Einladungszeile im Bogen über dem Kreis, Zierelement auf dem Ring, kräftiger Titel darunter.
   Wenig Tinte: die Punkte decken höchstens knapp die Hälfte, auch ein dunkles Foto wird kein schwarzer Block. */
import { rgba, luma, fontStr, sz, drawPhoto, blocks, fitDraw, footerH, drawFooter, drawFrame, arranged } from '../render/toolkit.js';

/** Foto in r zeichnen, Pixel zurücklesen und die Fläche wieder mit Papier füllen → l(x,y): Helligkeit 0–1, ohne Foto null */
function sample(env,r){
  const {ctx,W,H,th}=env; drawPhoto(env,r,'rect');
  const x0=Math.max(0,Math.floor(r.x)), y0=Math.max(0,Math.floor(r.y)), w=Math.min(W,Math.ceil(r.x+r.w))-x0, h=Math.min(H,Math.ceil(r.y+r.h))-y0;
  if (w<1||h<1) return null;
  const d=env.photo? ctx.getImageData(x0,y0,w,h).data : null; ctx.fillStyle=th.bg; ctx.fillRect(x0,y0,w,h);
  if (!d) return null;
  const px=(x,y)=>{ const i=(Math.min(h-1,Math.max(0,Math.round(y-y0)))*w+Math.min(w-1,Math.max(0,Math.round(x-x0))))*4; return (0.299*d[i]+0.587*d[i+1]+0.114*d[i+2])/255; };
  return (x,y,s)=>(px(x,y)*2+px(x-s,y)+px(x+s,y)+px(x,y-s)+px(x,y+s))/6;
}
/** Tonwerte strecken: die 4 % dunkelsten werden voll, die 4 % hellsten leer; die Mitten etwas heller (weniger Tinte) */
function stretch(a){ const s=Float32Array.from(a).sort(), lo=s[Math.floor(s.length*0.04)]||0, hi=s[Math.floor(s.length*0.96)]||1;
  return v=>Math.pow(Math.min(1,Math.max(0,(v-lo)/Math.max(0.2,hi-lo))),1.25); }
/** Text im Bogen über (cx,cy) mit Radius R, mittig oben; gibt false zurück, wenn er nicht in den Bogen passt */
function arcText(ctx,txt,font,px,sp,cx,cy,R,maxA,color){
  ctx.font=fontStr(font,px); const ws=[...txt].map(c=>ctx.measureText(c).width+sp), tot=ws.reduce((a,b)=>a+b,0)-sp;
  if (tot/R>maxA) return false;
  let a=-Math.PI/2-tot/R/2; ctx.fillStyle=color; ctx.textAlign='center';
  [...txt].forEach((c,i)=>{ const m=a+(ws[i]-sp)/2/R; ctx.save(); ctx.translate(cx+R*Math.cos(m),cy+R*Math.sin(m)); ctx.rotate(m+Math.PI/2); ctx.fillText(c,0,0); ctx.restore(); a+=ws[i]/R; });
  ctx.textAlign='left'; return true;
}

export default {
  id: 'raster',
  name: 'Raster',
  group: 'schwarzweiss',
  about: 'Foto als grobes Punktraster im Kreis, Einladung im Bogen darüber, kräftiger Titel – druckt scharf auch auf dem Kopierer',
  photo: true,
  parts: ['photo','text'],
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, R0=300*u, def={x:W/2-R0,y:100*u,w:2*R0,h:2*R0}, p=arranged(env,'photo',def);
    const cx=p.x+p.w/2, cy=p.y+p.h/2, rx=p.w/2, ry=p.h/2, dark=luma(th.bg)<0.5;
    // Punktraster, um 45° gedreht; Punktfläche wächst mit der Dunkelheit (auf dunklem Grund mit der Helligkeit), Tonwerte gestreckt
    const l=sample(env,p), c=11*u, cap=0.58, A=Math.PI/4, ca=Math.cos(A), sa=Math.sin(A), n=Math.ceil(Math.hypot(rx,ry)/c)+1, pts=[];
    for (let i=-n;i<=n;i++) for (let j=-n;j<=n;j++){
      const x=cx+(i*ca-j*sa)*c, y=cy+(i*sa+j*ca)*c, t=Math.hypot((x-cx)/rx,(y-cy)/ry); if (t>=1) continue;
      const v=l? l(x,y,c/3) : 0; pts.push(x,y,t,l? (dark?v:1-v) : st.ornament? (t<0.46?0:0.95*Math.pow((1-t)/0.54,0.8)*Math.min(1,(t-0.46)/0.08)) : 0.85*(1-t));
    }
    const tone=l? stretch(pts.filter((_,i)=>i%4===3)) : v=>v;
    ctx.fillStyle=Math.abs(luma(th.accent)-luma(th.bg))>0.45? th.accent : th.ink; ctx.beginPath();   // Akzent nur, wenn er sich genug vom Grund abhebt
    for (let i=0;i<pts.length;i+=4){
      const [x,y,t]=[pts[i],pts[i+1],pts[i+2]], f=l? Math.min(1,(1-t)/0.3) : 1, cov=tone(pts[i+3])*cap*f*f*(3-2*f); if (cov<0.015) continue;
      const r=c*Math.sqrt(cov/Math.PI); ctx.moveTo(x+r,y); ctx.arc(x,y,r,0,Math.PI*2);
    }
    ctx.fill();
    // feiner Ring mit Abstand zum Raster
    const g=14*u; ctx.strokeStyle=th.ink; ctx.lineWidth=Math.max(1,1.6*u); ctx.beginPath(); ctx.ellipse(cx,cy,rx+g,ry+g,0,0,Math.PI*2); ctx.stroke();
    // Zierelement: ohne Foto groß in der Mitte, sonst auf dem Ring unten
    const o=env.orn, oc={a:th.accent,b:th.ink,bg:th.bg,c:th.second};
    if (st.ornament && !l){ ctx.save(); o.draw(ctx,cx,cy,Math.min(rx,ry)*Math.min(0.62,0.95/o.wf),oc); ctx.restore(); }
    let ringB=def.y+def.h+g;   // Text richtet sich nach dem Kreis des Layouts, nicht nach dem verschobenen
    if (st.ornament && l){ const r=44*u, oy=cy+ry+g; ctx.fillStyle=th.bg; ctx.beginPath(); ctx.arc(cx,oy,r,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx,oy,r,0,Math.PI*2); ctx.stroke(); ctx.save(); o.draw(ctx,cx,oy,Math.min(50*u,76*u/o.wf),oc); ctx.restore(); ringB+=r; }
    // Einladungszeile im Bogen über dem Kreis, sonst wie üblich über dem Titel
    const eb=(T.eyebrow||'').trim().toUpperCase(), b=blocks(env,{titleBoost:1.3}); let head=[...b.top,...b.verse];
    if (eb){ let px=24*u*st.textScale*sz(st,'eyebrow')*fs.bs, ok=false; const R=Math.max(rx,ry)+g+16*u;
      for (;px>=13*u && !ok && cy-R-px>24*u;px*=0.94) ok=arcText(ctx,eb,fs.strong,px,px*0.18,cx,cy,R,Math.PI*0.62,th.ink);
      if (ok) head=head.slice(1); }
    const top=ringB+46*u, fh=footerH(env), bottom=H-56*u;
    fitDraw(env,head,b.detail,arranged(env,'text',{x:100*u,y:top,w:W-200*u,h:bottom-fh-(fh?36*u:0)-top}),'center','center');
    drawFooter(env,100*u,W-200*u,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
