/* Layout „Vollbild“ – Foto über die ganze Fläche, dunkler Verlauf nach unten, helle Schrift unten. */
import { rgba, drawPhoto, lightCols, blocks, fitDraw, footerH, drawFooter, drawFrame } from '../render/toolkit.js';

export default {
  id: 'vollbild',
  name: 'Vollbild',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th,st}=env, L=lightCols(env);
    drawPhoto(env,{x:0,y:0,w:W,h:H},'rect',{fill:th.deep,k:{a:L.accent,b:'rgba(255,255,255,0.5)',bg:th.deep,c:L.second}});
    const gr=ctx.createLinearGradient(0,H*0.28,0,H);
    gr.addColorStop(0,rgba(th.deep,0)); gr.addColorStop(0.45,rgba(th.deep,0.62)); gr.addColorStop(1,rgba(th.deep,0.92));
    ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
    const top=H*0.4, fh=footerH(env), bottom=H-56*u, g=blocks(env,{orn:50,col:L});
    fitDraw(env,[...g.top,...g.verse],g.detail,{x:100*u,y:top,w:W-200*u,h:bottom-fh-(fh?40*u:0)-top},'center','bottom');
    drawFooter(env,100*u,W-200*u,bottom,'center','rgba(255,255,255,0.8)');
    if (st.frame) drawFrame(env,28*u,'rgba(255,255,255,0.75)');
  }
};
