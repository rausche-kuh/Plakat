/* Layout „Pinnwand“ – Papiergrund, alles mittig gestapelt, Foto als Sofortbild mit Klebestreifen.
   Herzlich-Baukasten. */
import { paperGrain, warmCols, warmEls, warmCard, warmClosing, warmStack, warmFooterH, drawWarmFooter } from '../render/toolkit.js';

export default {
  id: 'pinnwand',
  name: 'Pinnwand',
  group: 'herzlich',
  about: 'Papiergrund, Foto als Sofortbild mit Klebestreifen, alles mittig gestapelt',
  photo: true,
  warm: true,
  draw(env){
    const {W,H,u,st}=env, wc=warmCols(env); env.warmGrade=st.sunlight;
    paperGrain(env);
    const fh=warmFooterH(env), x=70*u, w=W-140*u, cw=Math.min(640*u,w);
    const els=warmEls(env,{x,w,align:'center',label:false,polaroid:true,wc});
    const card=warmCard(env,wc,cw); if (card) els.push({gap:card.gap,measure:k=>card.measure(k),draw:y=>card.draw(y,W/2-cw/2)});
    const cl=warmClosing(env,wc,w); if (cl) els.push({gap:cl.gap,measure:k=>cl.measure(k),draw:y=>cl.draw(y,W/2)});
    warmStack(env,els,{x,y:50*u,w,h:H-fh-40*u-50*u},'center');
    drawWarmFooter(env,wc);
  }
};
