/* ---------- Oberfläche ↔ Zustand ----------
   syncUI(): alle Bedienelemente aus dem Zustand neu setzen (nach Laden, Anlasswechsel …).
   changed(): nach jeder Änderung aufrufen – zeichnet neu und sichert den Entwurf. */
import { st } from '../core/state.js';
import { $ } from './dom.js';
import { requestRender } from './preview.js';
import { activeTab } from './tabs.js';
import { syncAnlass } from './anlass.js';
import { syncLayoutTab, renderLayoutThumbs } from './layout.js';
import { syncTexte } from './texte.js';
import { syncFoto } from './foto.js';
import { syncAblage, scheduleDraft } from './ablage.js';

export function syncUI(){
  syncAnlass(); syncLayoutTab(); syncTexte(); syncAblage(); syncFoto();
}

export function changed(){
  requestRender();
  if (activeTab==='layout') renderLayoutThumbs();
  $('#accentReset').hidden=!st.accent;
  scheduleDraft();
}
