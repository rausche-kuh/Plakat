/* Layout „Vollbild“ – Foto über die ganze Fläche, dunkler Verlauf nach unten, helle Schrift unten. */
import { rgba, drawPhoto, lightCols, blocks, fitDraw, footerH, drawFooter, drawFrame, arranged } from '../render/toolkit.js';

export default {
  id: 'vollbild',
  name: 'Vollbild',
  group: 'freundlich',
  about: 'Foto über die ganze Fläche, helle Schrift auf dunklem Verlauf – stimmungsvoll, gut für Konzerte',
  photo: true,
  parts: ['text'],
  draw(env){
    const {ctx,W,H,u,th,st}=env, L=lightCols(env);
    drawPhoto(env,{x:0,y:0,w:W,h:H},'rect',{fill:th.deep,k:{a:L.accent,b:'rgba(255,255,255,0.5)',bg:th.deep,c:L.second}});
    const top=H*0.4, fh=footerH(env), bottom=H-56*u, tb=bottom-fh-(fh?40*u:0), g=blocks(env,{orn:50,col:L}), t=arranged(env,'text',{x:100*u,y:top,w:W-200*u,h:tb-top});
    // dunkler Verlauf hinter dem Text: reicht so weit unter ihn wie im Layout bis zum Plakatrand (e), danach blendet er aus
    const a=t.y-0.12*H, e=t.y+t.h+H-tb, n=e+0.12*H-a, gr=ctx.createLinearGradient(0,a,0,a+n);
    gr.addColorStop(0,rgba(th.deep,0)); gr.addColorStop(0.45*(e-a)/n,rgba(th.deep,0.62)); gr.addColorStop((e-a)/n,rgba(th.deep,0.92)); gr.addColorStop(1,rgba(th.deep,0));
    ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
    if (fh && e<H-1){ const y0=tb-60*u, gf=ctx.createLinearGradient(0,y0,0,H); gf.addColorStop(0,rgba(th.deep,0)); gf.addColorStop(1,rgba(th.deep,0.85)); ctx.fillStyle=gf; ctx.fillRect(0,y0,W,H-y0); }
    fitDraw(env,[...g.top,...g.verse],g.detail,t,'center','bottom');
    drawFooter(env,100*u,W-200*u,bottom,'center','rgba(255,255,255,0.8)');
    if (st.frame) drawFrame(env,28*u,'rgba(255,255,255,0.75)');
  }
};
