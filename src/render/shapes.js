/* ---------- Formen und Zeichen-Hilfen ---------- */

/** Flamme mit Fußpunkt (cx,by), Breite w, Höhe h – nur der Pfad, füllen/zeichnen macht der Aufrufer */
export function flame(c,cx,by,w,h){
  c.beginPath(); c.moveTo(cx,by-h);
  c.bezierCurveTo(cx+w*0.1,by-h*0.7,cx+w*0.56,by-h*0.5,cx+w*0.5,by-h*0.24);
  c.bezierCurveTo(cx+w*0.45,by+h*0.03,cx-w*0.45,by+h*0.03,cx-w*0.5,by-h*0.24);
  c.bezierCurveTo(cx-w*0.56,by-h*0.5,cx-w*0.1,by-h*0.7,cx,by-h); c.closePath();
}
/** Herz um (cx,cy) mit Breite w – nur der Pfad */
export function heart(c,cx,cy,w){
  c.beginPath(); c.moveTo(cx,cy+w*0.42);
  c.bezierCurveTo(cx-w*0.62,cy-w*0.02,cx-w*0.34,cy-w*0.56,cx,cy-w*0.2);
  c.bezierCurveTo(cx+w*0.34,cy-w*0.56,cx+w*0.62,cy-w*0.02,cx,cy+w*0.42); c.closePath();
}
/** Pfad für ein Rechteck r={x,y,w,h}: shape 'rect', 'arch' (Rundbogen oben) oder 'circle' */
export function shapePath(ctx,r,shape){
  ctx.beginPath();
  if (shape==='arch'){ const rad=r.w/2; ctx.moveTo(r.x,r.y+r.h); ctx.lineTo(r.x,r.y+rad); ctx.arc(r.x+rad,r.y+rad,rad,Math.PI,0); ctx.lineTo(r.x+r.w,r.y+r.h); ctx.closePath(); }
  else if (shape==='circle'){ ctx.arc(r.x+r.w/2,r.y+r.h/2,Math.min(r.w,r.h)/2,0,Math.PI*2); }
  else ctx.rect(r.x,r.y,r.w,r.h);
}
/** Wiederholbarer Zufallsgenerator (gleicher seed → gleiche Werte) */
export function rng(seed){ let a=seed>>>0; return ()=>{ a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
/** Führt fn um (cx,cy) um deg Grad gedreht aus */
export function rot(ctx,cx,cy,deg,fn){ ctx.save(); ctx.translate(cx,cy); ctx.rotate(deg*Math.PI/180); ctx.translate(-cx,-cy); fn(); ctx.restore(); }
