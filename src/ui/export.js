/* ---------- Export: PDF zum Drucken, PNG zum Teilen ---------- */
import { st } from '../core/state.js';
import { firstLine, slug } from '../core/util.js';
import { renderPoster } from '../render/poster.js';
import { $, $$, toast, listDe } from './dom.js';
import { openSamples, goToSamples } from './texte.js';
import { saveFile } from './download.js';
import { jpegToPdf } from '../core/pdf.js';

function renderHi(W){ const c=document.createElement('canvas'); c.width=W; c.height=Math.round(W*Math.SQRT2); renderPoster(c.getContext('2d'),st,W,3200); return c; }
async function busy(btn,label,fn){ const old=btn.textContent; btn.disabled=true; btn.textContent=label; await new Promise(r=>setTimeout(r,30)); try{ await fn(); } finally { btn.disabled=false; btn.textContent=old; } }

export function initExport(){
  const dlg=$('#exportDlg');
  // Stehen noch Beispieltexte darin, zeigt der Dialog zuerst eine Warnung
  const step=warn=>{ $('#expWarn').hidden=!warn; $$('#exportDlg .exp').forEach(e=>e.hidden=warn); };
  const open=()=>{
    const names=openSamples().map(f=>`„${f.name}“`);
    $('#expWarnText').textContent=`Diese Beispieltexte des Anlasses haben Sie nicht bearbeitet: ${listDe(names)}. Sie stehen so auf dem Plakat.`;
    step(names.length>0);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open','');
  };
  $('#openExport').addEventListener('click',open);
  $('#nextExport').addEventListener('click',open);
  $('#expToTexts').addEventListener('click',()=>{ dlg.close(); goToSamples(); });
  $('#expAnyway').addEventListener('click',()=>step(false));
  $('#expClose').addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{ if (e.target===dlg) dlg.close(); });
  $('#doPdf').addEventListener('click',e=>busy(e.currentTarget,'Wird erstellt …',async()=>{
    const W=+$('#pdfQ').value, c=renderHi(W);
    const jpg=await new Promise(r=>c.toBlob(r,'image/jpeg',0.93));
    if (!jpg){ toast('Das PDF konnte nicht erstellt werden.'); return; }
    const pdf=jpegToPdf(new Uint8Array(await jpg.arrayBuffer()),c.width,c.height,firstLine(st.texts.title)||'Plakat');
    await saveFile(`plakat-${slug(st.texts.title)}.pdf`,pdf);
  }));
  $('#doPng').addEventListener('click',e=>busy(e.currentTarget,'Wird erstellt …',async()=>{
    const c=renderHi(+$('#pngQ').value);
    const blob=await new Promise(r=>c.toBlob(r,'image/png'));
    if (!blob){ toast('Das Bild konnte nicht erstellt werden.'); return; }
    await saveFile(`plakat-${slug(st.texts.title)}.png`,blob);
  }));
}
