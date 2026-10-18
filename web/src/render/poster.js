/* ---------- Plakat zeichnen ----------
   Baut env (alles, was ein Layout braucht) und ruft das gewählte Layout auf. */
import { theme } from '../core/theme.js';
import { processed, logoImage } from '../core/images.js';
import { exampleFor } from '../data/beispielfotos.js';
import { FONTSETS } from '../data/fontsets.js';
import { getOccasion } from '../occasions/index.js';
import { getLayout } from '../layouts/index.js';

/** Zeichnet das Plakat für Zustand st in ctx, Breite W Pixel (Höhe = A4-Verhältnis).
    maxPhoto: größte Kantenlänge des verwendeten Fotos. Gibt env zurück (env.photoRect für das Verschieben, env.parts für „Anordnung ändern“). */
export function renderPoster(ctx,st,W,maxPhoto){
  const H=Math.round(W*Math.SQRT2), u=W/1000, th=theme(st), occ=getOccasion(st.occasion);
  const env={ctx,W,H,u,th,st,occ,orn:occ.ornament,fs:FONTSETS[st.fontStyle],photo:processed(maxPhoto||1600,st.photo),example:exampleFor(st),logo:logoImage(),photoRect:null,parts:[]};
  ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,W,H);
  ctx.fillStyle=th.bg; ctx.fillRect(0,0,W,H); ctx.textBaseline='alphabetic'; ctx.lineJoin='round';
  getLayout(st.layout).draw(env);
  if (st.variant==='schwarzweiss') grey(ctx,W,H);
  ctx.restore();
  return env;
}
/** Schwarz-Weiß: alles in Graustufen, auch Foto, Logo und feste Farben einzelner Layouts */
function grey(ctx,W,H){ const im=ctx.getImageData(0,0,W,H), d=im.data;
  for (let i=0;i<d.length;i+=4) d[i]=d[i+1]=d[i+2]=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
  ctx.putImageData(im,0,0); }
