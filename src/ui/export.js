/* ---------- Export: PDF zum Drucken, PNG zum Teilen ---------- */
import { st } from '../core/state.js';
import { firstLine, slug } from '../core/util.js';
import { renderPoster } from '../render/poster.js';
import { $, $$, toast, listDe, initDialog } from './dom.js';
import { openSamples, goToSamples } from './texte.js';
import { showTab } from './tabs.js';
import { getLayout } from '../layouts/index.js';
import { exampleFor } from '../data/beispielfotos.js';
import { saveFile } from './download.js';
import { jpegToPdf } from '../core/pdf.js';

function renderHi(W){ const c=document.createElement('canvas'); c.width=W; c.height=Math.round(W*Math.SQRT2); renderPoster(c.getContext('2d'),st,W,3200); return c; }
async function busy(btn,label,fn){ const old=btn.textContent; btn.disabled=true; btn.textContent=label; await new Promise(r=>setTimeout(r,30)); try{ await fn(); } finally { btn.disabled=false; btn.textContent=old; } }

export function initExport(){
  const dlg=$('#exportDlg'), show=initDialog('#exportDlg');
  // Stehen noch Beispieltexte oder das Beispielfoto darin, zeigt der Dialog zuerst eine Warnung
  const step=warn=>{ $('#expWarn').hidden=!warn; $$('#exportDlg .exp').forEach(e=>e.hidden=warn); };
  const open=()=>{
    const names=openSamples().map(f=>`„${f.name}“`), ex=getLayout(st.layout).photo && exampleFor(st);
    $('#expWarnText').textContent=[names.length && `Diese Beispieltexte des Anlasses haben Sie nicht bearbeitet: ${listDe(names)}. Sie stehen so auf dem Plakat.`,
      ex && `Das Foto ist ein Beispielfoto („${ex.name}“), nicht Ihr eigenes.`].filter(Boolean).join(' ');
    $('#expToTexts').textContent=names.length?'Zu den Texten':'Zum Foto';
    step(names.length>0||!!ex); show();
  };
  $('#openExport').addEventListener('click',open);
  $('#nextExport').addEventListener('click',open);
  $('#expToTexts').addEventListener('click',()=>{ dlg.close(); if (openSamples().length) goToSamples(); else { showTab('foto'); $('#photoBox [data-act=change]')?.focus(); } });
  $('#expAnyway').addEventListener('click',()=>step(false));
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
