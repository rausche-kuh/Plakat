/* Layout „Nur Schrift“ – ohne Foto: großes Zierelement oben, größerer Titel. */
import { rgba, blocks, fitDraw, footerH, drawFooter, drawFrame, arranged } from '../render/toolkit.js';

export default {
  id: 'typografie',
  name: 'Nur Schrift',
  group: 'ruhig',
  about: 'Ohne Foto: großes Zierelement und Titel – das Stillste, z. B. für Trauerfeiern',
  photo: false,
  parts: ['ornament','text'],
  draw(env){
    const {ctx,W,H,u,th,st}=env, o=env.orn;
    let top=150*u;
    if (st.ornament){
      const s=Math.min(220*u,560*u/o.wf), bw=Math.max(336*u,s*o.wf), p=arranged(env,'ornament',{x:W/2-bw/2,y:132*u,w:bw,h:336*u}), cx=p.x+p.w/2, cy=p.y+p.h/2;
      if (o.wf===1){ ctx.fillStyle=th.soft; ctx.beginPath(); ctx.arc(cx,cy,168*u*p.k,0,Math.PI*2); ctx.fill(); }
      ctx.save(); o.draw(ctx,cx,cy,s*p.k,{a:th.accent,b:th.line,bg:o.wf===1?th.soft:th.bg,c:th.second}); ctx.restore();
      top=520*u;
    }
    const fh=footerH(env), bottom=H-60*u, g=blocks(env,{titleBoost:1.18});
    fitDraw(env,[...g.top,...g.verse],g.detail,arranged(env,'text',{x:120*u,y:top,w:W-240*u,h:bottom-fh-(fh?44*u:0)-top}),'center',st.ornament?'top':'center');
    drawFooter(env,120*u,W-240*u,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
