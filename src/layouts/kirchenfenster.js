/* Layout „Kirchenfenster“ – Foto im Rundbogen mit feiner Kontur, Text darunter. */
import { rgba, shapePath, drawPhoto, blocks, fitDraw, footerH, drawFooter, drawFrame } from '../render/toolkit.js';

export default {
  id: 'kirchenfenster',
  name: 'Kirchenfenster',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th,st}=env, aw=480*u, ah=620*u, ax=(W-aw)/2, ay=96*u;
    ctx.strokeStyle=th.accent; ctx.lineWidth=Math.max(1,1.3*u);
    shapePath(ctx,{x:ax-16*u,y:ay-16*u,w:aw+32*u,h:ah+32*u},'arch'); ctx.stroke();
    drawPhoto(env,{x:ax,y:ay,w:aw,h:ah},'arch');
    const top=ay+ah+16*u+46*u, fh=footerH(env), bottom=H-56*u, g=blocks(env,{orn:44});
    fitDraw(env,[...g.top,...g.verse],g.detail,{x:110*u,y:top,w:W-220*u,h:bottom-fh-(fh?40*u:0)-top},'center','center');
    drawFooter(env,110*u,W-220*u,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
