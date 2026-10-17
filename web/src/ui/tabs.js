/* ---------- Tabs der Seitenleiste: Schritte 1–4 ---------- */
import { $, $$ } from './dom.js';
import { renderLayoutThumbs } from './layout.js';

export let activeTab='anlass';

export function showTab(id){
  activeTab=id;
  $$('.tab').forEach(x=>x.setAttribute('aria-selected',x.dataset.tab===id));
  $$('.tabpanel').forEach(p=>p.hidden = p.id!=='tab-'+id);
  if (id==='layout') renderLayoutThumbs();
}

export function initTabs(){
  $$('.tab').forEach(t=>t.addEventListener('click',()=>showTab(t.dataset.tab)));
  // „Weiter: …“ am Ende eines Schritts: nächsten Schritt von oben zeigen. Auf dem Handy liegt die Vorschau darüber,
  // dann auch nach unten scrollen, sonst landet man nach einem langen Schritt wieder bei der Vorschau.
  $$('[data-next]').forEach(b=>b.addEventListener('click',()=>{
    showTab(b.dataset.next); $('.tab[aria-selected="true"]').focus({preventScroll:true});
    const p=$('.panel'), top=p.getBoundingClientRect().top;
    if (top<0 || top>$('.top').offsetHeight+1) p.scrollIntoView();
  }));
}
