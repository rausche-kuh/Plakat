/* ---------- Tabs der Seitenleiste: Schritte 1–4, dazu „Meine Plakate“ und „KI-Entwurf“ ---------- */
import { $, $$ } from './dom.js';
import { renderLayoutThumbs } from './layout.js';
import { refreshList } from './ablage.js';

export let activeTab='anlass';

export function showTab(id){
  activeTab=id;
  $$('.tab').forEach(x=>x.setAttribute('aria-selected',x.dataset.tab===id));
  $$('.tabpanel').forEach(p=>p.hidden = p.id!=='tab-'+id);
  if (id==='layout') renderLayoutThumbs();
  if (id==='ablage') refreshList();
}

export function initTabs(){
  $$('.tab').forEach(t=>t.addEventListener('click',()=>showTab(t.dataset.tab)));
  // „Weiter: …“ am Ende eines Schritts: nächsten Schritt von oben zeigen
  $$('[data-next]').forEach(b=>b.addEventListener('click',()=>{ showTab(b.dataset.next); if ($('.panel').getBoundingClientRect().top<0) $('.panel').scrollIntoView(); }));
}
