/* ---------- Export: PDF zum Drucken, PNG zum Teilen ---------- */
import { st } from '../core/state.js';
import { firstLine, slug } from '../core/util.js';
import { renderPoster } from '../render/poster.js';
import { $, toast } from './dom.js';
import { saveFile } from './download.js';

function renderHi(W){ const c=document.createElement('canvas'); c.width=W; c.height=Math.round(W*Math.SQRT2); renderPoster(c.getContext('2d'),st,W,3200); return c; }
async function busy(btn,label,fn){ const old=btn.textContent; btn.disabled=true; btn.textContent=label; await new Promise(r=>setTimeout(r,30)); try{ await fn(); } finally { btn.disabled=false; btn.textContent=old; } }

export function initExport(){
  const dlg=$('#exportDlg');
  $('#openExport').addEventListener('click',()=>{ if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open',''); });
  $('#expClose').addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{ if (e.target===dlg) dlg.close(); });
  $('#doPdf').addEventListener('click',e=>busy(e.currentTarget,'Wird erstellt …',async()=>{
    if (!window.jspdf || !window.jspdf.jsPDF){ toast('Das PDF-Modul ist nicht geladen. Bitte die Seite neu laden.'); return; }
    const W=+$('#pdfQ').value, c=renderHi(W);
    const doc=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    doc.setProperties({title:firstLine(st.texts.title)||'Plakat',creator:'Plakatwerkstatt'});
    doc.addImage(c.toDataURL('image/jpeg',0.93),'JPEG',0,0,210,297,undefined,'FAST');
    await saveFile(`plakat-${slug(st.texts.title)}.pdf`,doc.output('blob'));
  }));
  $('#doPng').addEventListener('click',e=>busy(e.currentTarget,'Wird erstellt …',async()=>{
    const c=renderHi(+$('#pngQ').value);
    const blob=await new Promise(r=>c.toBlob(r,'image/png'));
    if (!blob){ toast('Das Bild konnte nicht erstellt werden.'); return; }
    await saveFile(`plakat-${slug(st.texts.title)}.png`,blob);
  }));
}
