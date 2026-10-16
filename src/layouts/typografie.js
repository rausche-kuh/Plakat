/* Layout „Nur Schrift“ – ohne Foto: großes Zierelement oben, größerer Titel. */
import { rgba, blocks, fitDraw, footerH, drawFooter, drawFrame } from '../render/toolkit.js';

export default {
  id: 'typografie',
  name: 'Nur Schrift',
  photo: false,
  draw(env){
    const {ctx,W,H,u,th,st}=env, o=env.orn;
    let top=150*u;
    if (st.ornament){
      if (o.wf===1){ ctx.fillStyle=th.soft; ctx.beginPath(); ctx.arc(W/2,300*u,168*u,0,Math.PI*2); ctx.fill(); }
      ctx.save(); o.draw(ctx,W/2,300*u,Math.min(220*u,560*u/o.wf),{a:th.accent,b:th.line,bg:o.wf===1?th.soft:th.bg,c:th.second}); ctx.restore();
      top=520*u;
    }
    const fh=footerH(env), bottom=H-60*u, g=blocks(env,{titleBoost:1.18});
    fitDraw(env,[...g.top,...g.verse],g.detail,{x:120*u,y:top,w:W-240*u,h:bottom-fh-(fh?44*u:0)-top},'center',st.ornament?'top':'center');
    drawFooter(env,120*u,W-240*u,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
