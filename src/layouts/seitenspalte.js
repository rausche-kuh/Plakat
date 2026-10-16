/* Layout „Seitenspalte“ – Foto als Spalte links, Text linksbündig rechts (Titel oben, Termin unten). */
import { rgba, drawPhoto, blocks, fitDraw, footerH, drawFooter, drawFrame } from '../render/toolkit.js';

export default {
  id: 'seitenspalte',
  name: 'Seitenspalte',
  photo: true,
  draw(env){
    const {W,H,u,th,st}=env, pw=430*u;
    drawPhoto(env,{x:0,y:0,w:pw,h:H},'rect');
    const x=pw+64*u, w=W-x-72*u, top=118*u, fh=footerH(env), bottom=H-64*u, g=blocks(env,{orn:50});
    fitDraw(env,[...g.top,...g.verse],g.detail,{x,y:top,w,h:bottom-fh-(fh?54*u:0)-top},'left','spread');
    drawFooter(env,x,w,bottom,'left',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
