/* Layout „Flugblatt“ – ENTWURF. */
import { blocks, fitDraw } from '../render/toolkit.js';

export default {
  id: 'flugblatt',
  name: 'Flugblatt',
  group: 'schwarzweiss',
  about: 'Wie eine Zeitungsseite: Kopfleiste, große Schlagzeile, Foto mit Bildunterschrift, Spalten',
  photo: true,
  draw(env){ const {W,H,u}=env, g=blocks(env); fitDraw(env,[...g.top,...g.verse],g.detail,{x:100*u,y:100*u,w:W-200*u,h:H-200*u},'center','center'); }
};
