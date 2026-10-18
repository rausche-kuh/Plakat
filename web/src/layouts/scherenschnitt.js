/* Layout „Scherenschnitt“ – ENTWURF. */
import { blocks, fitDraw } from '../render/toolkit.js';

export default {
  id: 'scherenschnitt',
  name: 'Scherenschnitt',
  group: 'schwarzweiss',
  about: 'Spitzenrand aus Scherenschnitt, Foto im Oval, Text mittig',
  photo: true,
  draw(env){ const {W,H,u}=env, g=blocks(env); fitDraw(env,[...g.top,...g.verse],g.detail,{x:100*u,y:100*u,w:W-200*u,h:H-200*u},'center','center'); }
};
