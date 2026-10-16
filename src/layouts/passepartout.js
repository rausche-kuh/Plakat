/* Layout „Passepartout“ – doppelte Rahmenlinie, Titel oben, Foto in der Mitte, Vers und Termin unten.
   Die Rahmenlinie gehört fest zum Layout, die Option „Feine Rahmenlinie“ wirkt hier nicht. */
import { drawPhoto, blocks, fitDraw, footerH, drawFooter } from '../render/toolkit.js';

export default {
  id: 'passepartout',
  name: 'Passepartout',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th}=env;
    ctx.strokeStyle=th.accent; ctx.lineWidth=Math.max(1,1.1*u);
    ctx.strokeRect(40*u,40*u,W-80*u,H-80*u); ctx.lineWidth=Math.max(0.7,0.6*u); ctx.strokeRect(50*u,50*u,W-100*u,H-100*u);
    const g=blocks(env,{orn:40});
    fitDraw(env,g.top,[],{x:130*u,y:105*u,w:W-260*u,h:300*u},'center','center');
    drawPhoto(env,{x:130*u,y:420*u,w:W-260*u,h:410*u},'rect');
    const top=862*u, fh=footerH(env), bottom=H-86*u;
    fitDraw(env,g.verse,g.detail,{x:130*u,y:top,w:W-260*u,h:bottom-fh-(fh?34*u:0)-top},'center','center');
    drawFooter(env,130*u,W-260*u,bottom,'center',th.muted);
  }
};
