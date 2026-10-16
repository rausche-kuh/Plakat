/* ---------- Tabs der Seitenleiste ---------- */
import { $$ } from './dom.js';
import { renderLayoutThumbs } from './layout.js';
import { refreshList } from './ablage.js';

export let activeTab='anlass';

export function initTabs(){
  $$('.tab').forEach(t=>t.addEventListener('click',()=>{
    activeTab=t.dataset.tab;
    $$('.tab').forEach(x=>x.setAttribute('aria-selected',x===t));
    $$('.tabpanel').forEach(p=>p.hidden = p.id!=='tab-'+activeTab);
    if (activeTab==='layout') renderLayoutThumbs();
    if (activeTab==='ablage') refreshList();
  }));
}
