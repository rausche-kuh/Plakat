/* Layout „Bogen“ – Foto im Rundbogen, umgeben von farbigen Bögen wie ein Regenbogen, Text mittig darunter.
   Leicht verspielt, aber ruhig genug für Taufe, Konfirmation oder Konzert. */
import { mix, rgba, shapePath, drawPhoto, blocks, fitDraw, footerH, drawFooter, drawFrame, arranged } from '../render/toolkit.js';

export default {
  id: 'bogen',
  name: 'Bogen',
  group: 'freundlich',
  about: 'Foto im Rundbogen mit farbigen Bögen drumherum, Text mittig darunter – leicht verspielt',
  photo: true,
  parts: ['photo','text'],
  draw(env){
    const {ctx,W,H,u,th,st}=env, p=arranged(env,'photo',{x:280*u,y:132*u,w:440*u,h:500*u}), b=26*u;
    p.h=Math.max(p.h,p.w*0.55);  // der Rundbogen braucht mindestens die halbe Breite als Höhe
    const {x:ax,y:ay,w:aw,h:ah}=p, base=ay+ah;
    const cols=[mix(th.accent,th.bg,0.62), th.second, th.accent];
    ctx.fillStyle=mix(th.second,th.bg,0.55); ctx.beginPath(); ctx.arc(ax+aw+64*u,ay+46*u,48*u,0,Math.PI*2); ctx.fill();
    cols.forEach((c,i)=>{ const o=(3-i)*b+8*u; ctx.fillStyle=c; shapePath(ctx,{x:ax-o,y:ay-o,w:aw+2*o,h:ah+o},'arch'); ctx.fill(); });
    ctx.fillStyle=th.bg; shapePath(ctx,{x:ax-8*u,y:ay-8*u,w:aw+16*u,h:ah+8*u},'arch'); ctx.fill();
    drawPhoto(env,{x:ax,y:ay,w:aw,h:ah},'arch');
    ctx.strokeStyle=th.ink; ctx.lineWidth=Math.max(1,1.6*u); ctx.beginPath(); ctx.moveTo(ax-3*b-60*u,base+0.8*u); ctx.lineTo(ax+aw+3*b+60*u,base+0.8*u); ctx.stroke();
    const top=688*u, fh=footerH(env), bottom=H-56*u, g=blocks(env,{orn:40,titleBoost:1.08});
    fitDraw(env,[...g.top,...g.verse],g.detail,arranged(env,'text',{x:110*u,y:top,w:W-220*u,h:bottom-fh-(fh?40*u:0)-top}),'center','center');
    drawFooter(env,110*u,W-220*u,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
