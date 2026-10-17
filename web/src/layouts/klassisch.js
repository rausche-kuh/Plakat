/* Layout „Klassisch“ – Foto in der oberen Hälfte, Zierelement im Kreis auf der Kante, Text mittig darunter. */
import { rgba, drawPhoto, ornCols, blocks, fitDraw, footerH, drawFooter, drawFrame } from '../render/toolkit.js';

export default {
  id: 'klassisch',
  name: 'Klassisch',
  group: 'ruhig',
  about: 'Foto in der oberen Hälfte, Zierelement auf der Kante, Text mittig darunter',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th,st}=env, ph=H*0.5;
    drawPhoto(env,{x:0,y:0,w:W,h:ph},'rect');
    let top=ph+64*u;
    if (st.ornament){
      const r=54*u, o=env.orn; ctx.fillStyle=th.bg; ctx.beginPath(); ctx.arc(W/2,ph,r,0,Math.PI*2); ctx.fill();
      ctx.save(); o.draw(ctx,W/2,ph,Math.min(62*u,92*u/o.wf),ornCols(env,{accent:th.accent,line:th.line})); ctx.restore();
      top=ph+54*u+40*u;
    }
    const fh=footerH(env), bottom=H-56*u, g=blocks(env);
    fitDraw(env,[...g.top,...g.verse],g.detail,{x:110*u,y:top,w:W-220*u,h:bottom-fh-(fh?40*u:0)-top},'center','center');
    drawFooter(env,110*u,W-220*u,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
