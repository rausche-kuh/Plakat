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
import { posterLink } from '../core/files.js';

function renderHi(W){ const c=document.createElement('canvas'); c.width=W; c.height=Math.round(W*Math.SQRT2); renderPoster(c.getContext('2d'),st,W,3200); return c; }
async function busy(btn,label,fn){ const old=btn.textContent; btn.disabled=true; btn.textContent=label; await new Promise(r=>setTimeout(r,30)); try{ await fn(); } finally { btn.disabled=false; btn.textContent=old; } }

export function initExport(){
  const dlg=$('#exportDlg'), show=initDialog('#exportDlg');
  // Im Claude-Artefakt kommt der Teil nach # nicht an, eine Datei von der Festplatte hat keine Adresse zum Weitergeben
  const linkOk=!window.claude && location.protocol!=='file:';
  let link='', pngFile=null;
  if (!linkOk) $('#expLink').remove();
  // Stehen noch Beispieltexte oder das Beispielfoto darin, zeigt der Dialog zuerst eine Warnung
  const step=warn=>{ $('#expWarn').hidden=!warn; $$('#exportDlg .exp').forEach(e=>e.hidden=warn); };
  const open=()=>{
    const names=openSamples().map(f=>`„${f.name}“`), ex=getLayout(st.layout).photo && exampleFor(st);
    $('#expWarnText').textContent=[names.length && `Diese Beispieltexte des Anlasses haben Sie nicht bearbeitet: ${listDe(names)}. Sie stehen so auf dem Plakat.`,
      ex && `Das Foto ist ein Beispielfoto („${ex.name}“), nicht Ihr eigenes.`].filter(Boolean).join(' ');
    $('#expToTexts').textContent=names.length?'Zu den Texten':'Zum Foto';
    step(names.length>0||!!ex); show();
    // Link und Bild vorab bzw. nur einmal erstellen: Safari öffnet das Teilen-Menü nur direkt nach dem Tippen
    pngFile=null;
    if (linkOk){ link=''; $('#linkOut').hidden=true; posterLink(st).then(l=>link=l,()=>{}); }
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
  // Bild teilen: über das Teilen-Menü des Geräts (vor allem Handys). Dauert das Erstellen zu lange, teilt der zweite Tipp das fertige Bild.
  const share=()=>navigator.share({files:[pngFile]}).catch(e=>{ if (e.name==='NotAllowedError') toast('Das Bild ist fertig – bitte noch einmal auf „Bild teilen“ tippen.'); });
  $('#sharePng').hidden=!!window.claude || !navigator.canShare?.({files:[new File([''],'plakat.png',{type:'image/png'})]});
  $('#pngQ').addEventListener('change',()=>pngFile=null);
  $('#sharePng').addEventListener('click',e=>pngFile ? share() : busy(e.currentTarget,'Wird erstellt …',async()=>{
    const blob=await new Promise(r=>renderHi(+$('#pngQ').value).toBlob(r,'image/png'));
    if (!blob){ toast('Das Bild konnte nicht erstellt werden.'); return; }
    pngFile=new File([blob],`plakat-${slug(st.texts.title)}.png`,{type:'image/png'}); await share();
  }));
  // Link teilen: am Handy über das Teilen-Menü, sonst in die Zwischenablage; geht beides nicht, steht er zum Kopieren da
  if (linkOk) $('#doLink').addEventListener('click',()=>{
    if (!link){ toast(window.CompressionStream?'Der Link konnte nicht erstellt werden.':'Dieser Browser ist zu alt, um Links zu erstellen. Bitte aktualisieren Sie ihn.',6000); return; }
    const out=$('#linkOut'), showLink=()=>{ out.value=link; out.hidden=false; out.select(); };
    if (navigator.share && matchMedia('(pointer:coarse)').matches) navigator.share({url:link}).catch(e=>{ if (e.name!=='AbortError') showLink(); });
    else if (navigator.clipboard) navigator.clipboard.writeText(link).then(()=>toast('Link kopiert'),showLink);
    else showLink();
  });
}
