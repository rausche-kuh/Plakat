/* ---------- Dateien an den Nutzer geben ----------
   Im Claude-Artefakt über die Fähigkeit „downloads“, sonst als normaler Browser-Download. */
import { toast } from './dom.js';

let dlPromise=null;
export function getDownloads(){ if (!dlPromise) dlPromise = (window.claude && typeof window.claude.use==='function') ? window.claude.use('downloads').catch(()=>null) : Promise.resolve(null); return dlPromise; }
function anchorDownload(filename,blob){ const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),4000); }
export async function saveFile(filename,blob){
  const d=await getDownloads();
  if (!d){ anchorDownload(filename,blob); toast(`${filename} wird heruntergeladen`); return true; }
  try{ const r=await d.save({filename,data:blob}); toast(r&&r.status==='delivered'?`${filename} übergeben`:`${filename} gespeichert`); return true; }
  catch(e){
    const code=e&&e.code;
    if (code==='declined') toast('Speichern abgebrochen');
    else if (code==='rate_limited') toast('Bitte einen Moment warten und erneut versuchen.');
    else if (code==='too_large') toast('Die Datei ist zu groß. Wählen Sie die kleinere Variante.');
    else { anchorDownload(filename,blob); toast(`${filename} wird heruntergeladen`); }
    return false;
  }
}
