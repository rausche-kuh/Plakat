/* Layout „Kontur“ – ENTWURF. */
import { blocks, fitDraw } from '../render/toolkit.js';

export default {
  id: 'kontur',
  name: 'Kontur',
  group: 'schwarzweiss',
  about: 'Riesiger Titel in Umrissbuchstaben, feine Linien – fast ohne Tinte',
  photo: false,
  draw(env){ const {W,H,u}=env, g=blocks(env); fitDraw(env,[...g.top,...g.verse],g.detail,{x:100*u,y:100*u,w:W-200*u,h:H-200*u},'center','center'); }
};
