/* ---------- Tab „Meine Plakate“: Entwurf, Speichern, Liste, Datei sichern und öffnen ---------- */
import { st, setState, defaults, sanitize } from '../core/state.js';
import { clone, uid, firstLine, slug } from '../core/util.js';
import { ensureImages } from '../core/images.js';
import { store } from '../core/store.js';
import { packFile, posterList } from '../core/files.js';
import { OCC, occLabel } from '../occasions/index.js';
import { renderPoster } from '../render/poster.js';
import { $, toast, setStatus } from './dom.js';
import { syncUI, changed } from './sync.js';
import { requestRender } from './preview.js';
import { activeTab } from './tabs.js';
import { saveFile } from './download.js';
import { kiMsg } from './ki.js';

/* Entwurf: wird nach jeder Änderung kurz verzögert im Browser gesichert */
let draftTimer;
export function scheduleDraft(){ clearTimeout(draftTimer); draftTimer=setTimeout(saveDraft,700); }
export async function saveDraft(){
  try{ await store.put('meta',clone(st),'draft'); setStatus(store.ok?'Entwurf automatisch gesichert':'Speichern im Browser ist hier nicht möglich – bitte als Datei sichern'); }
  catch{ setStatus('Entwurf konnte nicht gesichert werden – bitte als Datei sichern'); }
}

function makeThumb(){ const c=document.createElement('canvas'); c.width=160; c.height=Math.round(160*Math.SQRT2); renderPoster(c.getContext('2d'),st,160,1600); return c.toDataURL('image/jpeg',0.8); }
async function savePoster(asCopy){
  st.name = $('#posterName').value.trim() || st.name || firstLine(st.texts.title) || 'Plakat';
  if (asCopy){ st.id=uid(); st.name=st.name.replace(/ \(Kopie\)$/,'')+' (Kopie)'; }
  if (!st.id) st.id=uid();
  try{
    await store.put('posters',{id:st.id,name:st.name,updated:Date.now(),state:clone(st),thumb:makeThumb()});
    $('#posterName').value=st.name; saveDraft();
    toast(store.ok?`„${st.name}“ gespeichert`:`„${st.name}“ nur vorübergehend gespeichert – bitte zusätzlich als Datei sichern`);
    refreshList();
  }catch(e){ toast('Speichern fehlgeschlagen: Der Speicher des Browsers ist voll. Sichern Sie Plakate als Datei und löschen Sie alte.'); }
}
export async function loadState(s){ setState(sanitize(s)); await ensureImages(st); syncUI(); requestRender(); }

export async function refreshList(){
  const ul=$('#plist'); let list=[];
  try{ list=(await store.all('posters'))||[]; }catch{}
  list.sort((a,b)=>b.updated-a.updated);
  ul.innerHTML='';
  if (!list.length){ ul.innerHTML='<li class="empty" style="display:block">Noch keine Plakate gespeichert. Mit „Speichern“ legen Sie das aktuelle Plakat hier ab.</li>'; return; }
  const fmt=new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  for (const p of list){
    const li=document.createElement('li'); if (p.id===st.id) li.className='current';
    const img=document.createElement('img'); img.className='th'; img.alt=''; if (p.thumb) img.src=p.thumb;
    const info=document.createElement('div'); const nm=document.createElement('div'); nm.className='nm'; nm.textContent=p.name||'Plakat';
    const dt=document.createElement('div'); dt.className='dt'; dt.textContent=occLabel(OCC[p.state?.occasion])+', '+fmt.format(new Date(p.updated));
    info.append(nm,dt);
    const acts=document.createElement('div'); acts.className='acts';
    const open=document.createElement('button'); open.className='btn small'; open.textContent='Öffnen';
    open.addEventListener('click',async()=>{ const rec=await store.get('posters',p.id); if (!rec) return; await loadState({...rec.state,id:rec.id,name:rec.name}); saveDraft(); refreshList(); toast(`„${rec.name}“ geöffnet`); });
    const del=document.createElement('button'); del.className='btn small ghost danger'; del.textContent='Löschen';
    let armed=false, t;
    del.addEventListener('click',async()=>{
      if (!armed){ armed=true; del.textContent='Wirklich löschen?'; t=setTimeout(()=>{ armed=false; del.textContent='Löschen'; },3500); return; }
      clearTimeout(t); await store.del('posters',p.id); if (st.id===p.id) st.id=null; refreshList(); toast(`„${p.name}“ gelöscht`);
    });
    acts.append(open,del); li.append(img,info,acts); ul.append(li);
  }
}

/** Übernimmt Plakate aus einer Datei oder KI-Antwort in die Ablage und öffnet das erste.
    keepMedia: aktuelles Foto und Logo einsetzen, wo die Datei keins hat. Gibt die Anzahl zurück. */
export async function importData(data,keepMedia){
  const list=posterList(data); if (!list.length) return 0;
  setStatus('Plakate werden übernommen …');
  const saved=clone(st); let first=null, n=0;
  for (const p of list){
    try{
      setState(sanitize(p.state||{})); st.id=uid(); st.name=typeof p.name==='string'&&p.name?p.name:(firstLine(st.texts.title)||'Plakat');
      if (keepMedia){ if (!st.photo.src && saved.photo.src) st.photo.src=saved.photo.src; if (!st.logo.src && saved.logo.src) st.logo.src=saved.logo.src; }
      await ensureImages(st);
      await store.put('posters',{id:st.id,name:st.name,updated:Date.now()+n,state:clone(st),thumb:makeThumb()});
      if (!first) first=clone(st); n++;
    }catch{}
  }
  await loadState(first||saved); saveDraft(); refreshList(); setStatus();
  if (n) toast(n===1?'1 Plakat übernommen und geöffnet':`${n} Plakate übernommen – das erste ist geöffnet`);
  return n;
}

export function initAblage(){
  $('#saveBtn').addEventListener('click',()=>savePoster(false));
  $('#quickSave').addEventListener('click',()=>savePoster(false));
  $('#saveCopyBtn').addEventListener('click',()=>savePoster(true));
  $('#posterName').addEventListener('input',e=>{ st.name=e.target.value; scheduleDraft(); });
  $('#newBtn').addEventListener('click',async()=>{
    setState(defaults(st.occasion,{place:st.texts.place,address:st.texts.address,parish:st.texts.parish,logo:st.logo.src}));
    await ensureImages(st); syncUI(); changed(); refreshList(); toast('Neues Plakat begonnen – Ort, Gemeinde und Logo wurden übernommen.');
  });

  /* Als Datei sichern und übertragen */
  $('#expOne').addEventListener('click',()=>{ const name=st.name||firstLine(st.texts.title)||'Plakat'; const s=clone(st); delete s.id; saveFile(`plakat-${slug(name)}.json`,packFile([{name,state:s}])); });
  $('#expAll').addEventListener('click',async()=>{
    let list=[]; try{ list=(await store.all('posters'))||[]; }catch{}
    if (!list.length){ toast('Noch keine gespeicherten Plakate. Speichern Sie zuerst ein Plakat.'); return; }
    saveFile(`plakate-${new Date().toISOString().slice(0,10)}.json`,packFile(list.map(p=>{ const s=clone(p.state); delete s.id; return {name:p.name,state:s}; })));
  });
  $('#impBtn').addEventListener('click',()=>$('#impFile').click());
  $('#impFile').addEventListener('change',async e=>{
    const f=e.target.files[0]; e.target.value=''; if (!f) return;
    let data; try{ data=JSON.parse(await f.text()); }catch{ toast('Die Datei konnte nicht gelesen werden.'); return; }
    const n=await importData(data,activeTab==='ki'&&$('#kiKeepMedia').checked);
    if (!n) toast('Diese Datei ist keine Plakatwerkstatt-Datei.');
    else if (activeTab==='ki') kiMsg(n===1?'Entwurf übernommen und geöffnet. Er liegt auch unter „Meine Plakate“.':`${n} Entwürfe übernommen. Der erste ist geöffnet, alle liegen unter „Meine Plakate“.`);
  });
}

export function syncAblage(){ $('#posterName').value=st.name||''; }
