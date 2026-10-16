/* ---------- Dialog „KI-Entwurf“ (geöffnet aus Schritt 1): Auftrag kopieren, Antwort der KI übernehmen ---------- */
import { kiPrompt } from '../data/ki-prompt.js';
import { $, toast, initDialog } from './dom.js';
import { importData } from './ablage.js';

let kiInfo;
function kiMsg(t){ $('#kiMsg').textContent=t; }
/** Nach dem Übernehmen: Dialog zu, damit man den Entwurf in der Vorschau sieht */
export function kiDone(n){
  kiMsg(''); $('#kiDlg').close();
  toast(n===1?'Entwurf übernommen. Er liegt auch unter „Meine Plakate“.':`${n} Entwürfe übernommen. Der erste ist geöffnet, alle liegen unter „Meine Plakate“.`);
}
function kiFull(){ return kiPrompt()+(kiInfo.value.trim()||'[hier die Infos zur Veranstaltung einfügen]'); }
function kiSync(){ $('#kiPrompt').value=kiFull(); }

export function initKI(){
  kiInfo=$('#kiInfo');
  const show=initDialog('#kiDlg');
  $('#openKI').addEventListener('click',show);
  try{ kiInfo.value=localStorage.getItem('pw-ki-infos')||''; }catch{}
  kiSync();
  kiInfo.addEventListener('input',()=>{ kiSync(); try{ localStorage.setItem('pw-ki-infos',kiInfo.value); }catch{} });
  $('#kiCopy').addEventListener('click',async()=>{
    if (!kiInfo.value.trim()){ kiMsg('Tragen Sie zuerst unter 1. die Infos zur Veranstaltung ein.'); kiInfo.focus(); return; }
    const text=kiFull(); let ok=false;
    try{ await navigator.clipboard.writeText(text); ok=true; }catch{}
    if (!ok){ const ta=$('#kiPrompt'); $('.ki-prompt').open=true; ta.value=text; ta.focus(); ta.select(); try{ ok=document.execCommand('copy'); }catch{} }
    if (ok){ kiMsg(''); toast('Auftrag kopiert – jetzt in die KI einfügen'); }
    else kiMsg('Automatisches Kopieren ist hier nicht möglich. Der Auftrag ist unten markiert – bitte mit „Kopieren“ übernehmen.');
  });
  $('#kiApply').addEventListener('click',async()=>{
    const raw=$('#kiAnswer').value.trim();
    if (!raw){ kiMsg('Fügen Sie zuerst die Antwort der KI ein.'); $('#kiAnswer').focus(); return; }
    let data=null;
    try{ const t=raw.replace(/```(?:json)?/gi,''), a=t.indexOf('{'), b=t.lastIndexOf('}'); if (a>=0&&b>a) data=JSON.parse(t.slice(a,b+1)); }catch{}
    if (!data){ kiMsg('In der Antwort wurde kein gültiger Entwurf gefunden. Kopieren Sie die komplette Antwort der KI, einschließlich aller geschweiften Klammern { }.'); return; }
    const n=await importData(data,$('#kiKeepMedia').checked,true);
    if (!n){ kiMsg('Die Antwort hat nicht das erwartete Format. Bitten Sie die KI, sich genau an das Format im Auftrag zu halten.'); return; }
    $('#kiAnswer').value=''; kiDone(n);
  });
  $('#kiFile').addEventListener('click',()=>$('#impFile').click());
}
