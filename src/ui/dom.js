/* ---------- DOM-Hilfen und Hinweise ---------- */
export const $ = s => document.querySelector(s);
export const $$ = s => document.querySelectorAll(s);

let toastTimer;
export function toast(t){ const el=$('#toast'); el.textContent=t; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),3200); }
export function setStatus(t){ $('#status').textContent = t || 'A4 Hochformat'; }

/** Deutsche Aufzählung: „A“, „A und B“, „A, B und C“ */
export const listDe = items => items.length<2 ? (items[0]||'') : items.slice(0,-1).join(', ')+' und '+items[items.length-1];
