/* ---------- Plakatwerkstatt: Start ----------
   Verdrahtet die Oberfläche, lädt den letzten Entwurf und die Schriften. */
import { st, setState, sanitize } from './core/state.js';
import { ensureImages } from './core/images.js';
import { store } from './core/store.js';
import { FONTSETS, FONT_ROLES } from './data/fontsets.js';
import { fontStr } from './render/text.js';
import { syncUI } from './ui/sync.js';
import { initPreview, requestRender } from './ui/preview.js';
import { initTabs } from './ui/tabs.js';
import { initAnlass } from './ui/anlass.js';
import { initLayoutTab } from './ui/layout.js';
import { initTexte } from './ui/texte.js';
import { initFoto } from './ui/foto.js';
import { initAblage, refreshList } from './ui/ablage.js';
import { getDownloads } from './ui/download.js';
import { initKI } from './ui/ki.js';
import { initExport } from './ui/export.js';

async function loadFonts(){
  if (!document.fonts || !document.fonts.load) return;
  const specs=new Set();
  Object.values(FONTSETS).forEach(f=>FONT_ROLES.forEach(k=>specs.add(fontStr(f[k],20))));
  await Promise.race([Promise.all([...specs].map(s=>document.fonts.load(s,'Aa ÄÖÜäöüß „“').catch(()=>{}))),new Promise(r=>setTimeout(r,3500))]);
}

initPreview(); initTabs(); initAnlass(); initLayoutTab(); initTexte(); initFoto(); initAblage(); getDownloads(); initKI(); initExport();

(async()=>{
  syncUI(); requestRender();
  try{ const d=await store.get('meta','draft'); if (d) setState(sanitize(d)); }catch{}
  await ensureImages(st); syncUI();
  await loadFonts(); requestRender();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(()=>requestRender());
  refreshList();
})();
