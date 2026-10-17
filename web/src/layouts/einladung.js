/* Layout „Einladung“ – Foto über die ganze Fläche, Texte links auf Papier und Pinselstrichen,
   Kasten rechts unten, Schlusszeile mittig darunter. Herzlich-Baukasten. */
import { rgba, drawPhoto, warmCols, warmEls, warmCard, warmClosing, warmStack, warmFooterH, drawWarmFooter, sunGlow } from '../render/toolkit.js';

export default {
  id: 'einladung',
  name: 'Einladung',
  group: 'herzlich',
  about: 'Foto über die ganze Fläche, Titel auf einem Papierzettel, Ort und Schlusszeile auf Pinselstrichen',
  photo: true,
  warm: true,
  draw(env){
    const {ctx,W,H,u,th,st}=env, wc=warmCols(env); env.warmGrade=st.sunlight;
    drawPhoto(env,{x:0,y:0,w:W,h:H},'rect');
    const g=ctx.createLinearGradient(0,0,W*0.8,0); g.addColorStop(0,rgba(th.bg,0.86)); g.addColorStop(0.42,rgba(th.bg,0.58)); g.addColorStop(1,rgba(th.bg,0));
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    if (st.sunlight) sunGlow(env);
    const fh=warmFooterH(env); let y2=H-fh-34*u;
    const cl=warmClosing(env,wc,W-140*u); let clY=0; if (cl){ clY=y2-cl.measure(1); y2=clY-24*u; }
    const cardW=440*u, card=warmCard(env,wc,cardW); let cardY=0; if (card){ cardY=y2-card.measure(1); y2=cardY-22*u; }
    warmStack(env,warmEls(env,{x:54*u,w:660*u,align:'left',label:true,wc}),{x:54*u,y:62*u,w:660*u,h:y2-62*u},'top');
    if (card) card.draw(cardY,W-50*u-cardW);
    if (cl) cl.draw(clY,W/2);
    drawWarmFooter(env,wc);
  }
};
