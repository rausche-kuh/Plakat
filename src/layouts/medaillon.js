/* Layout „Medaillon“ – rundes Foto mit Kreislinie oben, Text darunter. */
import { rgba, drawPhoto, blocks, fitDraw, footerH, drawFooter, drawFrame } from '../render/toolkit.js';

export default {
  id: 'medaillon',
  name: 'Medaillon',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th,st}=env, R=248*u, cx=W/2, cy=370*u;
    ctx.strokeStyle=th.accent; ctx.lineWidth=Math.max(1,1.2*u); ctx.beginPath(); ctx.arc(cx,cy,R+18*u,0,Math.PI*2); ctx.stroke();
    drawPhoto(env,{x:cx-R,y:cy-R,w:2*R,h:2*R},'circle');
    const top=cy+R+18*u+50*u, fh=footerH(env), bottom=H-56*u, g=blocks(env,{orn:40});
    fitDraw(env,[...g.top,...g.verse],g.detail,{x:110*u,y:top,w:W-220*u,h:bottom-fh-(fh?40*u:0)-top},'center','center');
    drawFooter(env,110*u,W-220*u,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
