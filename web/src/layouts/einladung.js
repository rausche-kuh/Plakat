/* Layout „Einladung“ – Foto über die ganze Fläche, Texte links auf Papier und Pinselstrichen,
   Kasten rechts unten, Schlusszeile mittig darunter. Herzlich-Baukasten. */
import { rgba, drawPhoto, warmCols, warmEls, warmCard, warmClosing, warmStack, warmFooterH, drawWarmFooter, sunGlow, arranged } from '../render/toolkit.js';

export default {
  id: 'einladung',
  name: 'Einladung',
  group: 'herzlich',
  about: 'Foto über die ganze Fläche, Titel auf einem Papierzettel, Ort und Schlusszeile auf Pinselstrichen',
  photo: true,
  warm: true,
  parts: ['main','card','closing'],
  draw(env){
    const {ctx,W,H,u,th,st}=env, wc=warmCols(env); env.warmGrade=st.sunlight;
    drawPhoto(env,{x:0,y:0,w:W,h:H},'rect');
    const fh=warmFooterH(env); let y2=H-fh-34*u;
    const cl=warmClosing(env,wc,W-140*u); let clY=0, clH=0; if (cl){ clH=cl.measure(1); clY=y2-clH; y2=clY-24*u; }
    const cardW=440*u, card=warmCard(env,wc,cardW); let cardY=0, cardH=0; if (card){ cardH=card.measure(1); cardY=y2-cardH; y2=cardY-22*u; }
    const t=arranged(env,'main',{x:54*u,y:62*u,w:660*u,h:y2-62*u});
    // Aufhellung links folgt dem Haupttext; links davon blendet sie aus
    const gx=t.x-54*u, g=ctx.createLinearGradient(gx-0.25*W,0,gx+0.8*W,0);
    g.addColorStop(0,rgba(th.bg,0)); g.addColorStop(0.25/1.05,rgba(th.bg,0.86)); g.addColorStop(0.586/1.05,rgba(th.bg,0.58)); g.addColorStop(1,rgba(th.bg,0));
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    if (st.sunlight) sunGlow(env);
    warmStack(env,warmEls(env,{x:t.x,w:t.w,align:'left',label:true,wc}),t,'top');
    // Kasten und Schlusszeile füllen ihren Teil: Größe k, kleiner falls nötig, senkrecht mittig
    const fitIn=(el,r)=>{ let k=r.k, h; while ((h=el.measure(k))>r.h+0.5 && k>0.3) k*=0.96; return r.y+(r.h-h)/2; };
    if (card){ const r=arranged(env,'card',{x:W-50*u-cardW,y:cardY,w:cardW,h:cardH}), el=warmCard(env,wc,r.w); el.draw(fitIn(el,r),r.x); }
    if (cl){ const r=arranged(env,'closing',{x:70*u,y:clY,w:W-140*u,h:clH}), el=warmClosing(env,wc,r.w); el.draw(fitIn(el,r),r.x+r.w/2); }
    drawWarmFooter(env,wc);
  }
};
