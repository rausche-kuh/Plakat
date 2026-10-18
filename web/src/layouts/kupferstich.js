/* Layout „Kupferstich“ – ENTWURF. */
import { blocks, fitDraw } from '../render/toolkit.js';

export default {
  id: 'kupferstich',
  name: 'Kupferstich',
  group: 'schwarzweiss',
  about: 'Foto als Linienstich wie in alten Bibeln, feiner Rahmen, Antiqua',
  photo: true,
  draw(env){ const {W,H,u}=env, g=blocks(env); fitDraw(env,[...g.top,...g.verse],g.detail,{x:100*u,y:100*u,w:W-200*u,h:H-200*u},'center','center'); }
};
