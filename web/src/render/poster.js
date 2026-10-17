/* ---------- Plakat zeichnen ----------
   Baut env (alles, was ein Layout braucht) und ruft das gewählte Layout auf. */
import { theme } from '../core/theme.js';
import { processed, logoImage } from '../core/images.js';
import { exampleFor } from '../data/beispielfotos.js';
import { FONTSETS } from '../data/fontsets.js';
import { getOccasion } from '../occasions/index.js';
import { getLayout } from '../layouts/index.js';

/** Zeichnet das Plakat für Zustand st in ctx, Breite W Pixel (Höhe = A4-Verhältnis).
    maxPhoto: größte Kantenlänge des verwendeten Fotos. Gibt env zurück (env.photoRect für das Verschieben). */
export function renderPoster(ctx,st,W,maxPhoto){
  const H=Math.round(W*Math.SQRT2), u=W/1000, th=theme(st), occ=getOccasion(st.occasion);
  const env={ctx,W,H,u,th,st,occ,orn:occ.ornament,fs:FONTSETS[st.fontStyle],photo:processed(maxPhoto||1600,st.photo),example:exampleFor(st),logo:logoImage(),photoRect:null};
  ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,W,H);
  ctx.fillStyle=th.bg; ctx.fillRect(0,0,W,H); ctx.textBaseline='alphabetic'; ctx.lineJoin='round';
  getLayout(st.layout).draw(env);
  ctx.restore();
  return env;
}
