/* ---------- DOM-Hilfen und Hinweise ---------- */
export const $ = s => document.querySelector(s);
export const $$ = s => document.querySelectorAll(s);

let toastTimer;
// Steht ein Dialog offen, kommt der Hinweis hinein, sonst läge er unter dessen abgedunkeltem Hintergrund
export function toast(t){ const el=$('#toast'); (document.querySelector('dialog[open]')||document.body).append(el); el.textContent=t; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),3200); }
/** Dialog: „Schließen“ und ein Klick daneben schließen ihn. Gibt die Funktion zum Öffnen zurück. */
export function initDialog(sel){
  const dlg=$(sel);
  dlg.querySelector('.dlg-close').addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{ if (e.target===dlg) dlg.close(); });
  return ()=>{ if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open',''); };
}
export function setStatus(t){ $('#status').textContent = t || 'A4 Hochformat'; }

/** Deutsche Aufzählung: „A“, „A und B“, „A, B und C“ */
export const listDe = items => items.length<2 ? (items[0]||'') : items.slice(0,-1).join(', ')+' und '+items[items.length-1];
