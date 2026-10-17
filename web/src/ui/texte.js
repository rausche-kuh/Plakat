/* ---------- Schritt 3 „Texte“: Textfelder (data-t), Schriftgröße je Feld, Beispieltexte markieren, Datum aus dem Kalender, Logo ---------- */
import { st, sampleKeys, SIZE_MIN, SIZE_MAX } from '../core/state.js';
import { clamp } from '../core/util.js';
import { ensureImages, fileToDataURL } from '../core/images.js';
import { $, $$, toast } from './dom.js';
import { changed } from './sync.js';
import { showTab } from './tabs.js';

let fields=[];   // {el,k,name,tag,tools,size} in der Reihenfolge des Formulars

export function renderLogoBox(){
  const box=$('#logoBox');
  if (st.logo.src){
    box.innerHTML=`<div class="logo-current"><img alt="Logo"><button class="btn small" data-act="lchange">Ändern</button><button class="btn small danger" data-act="lremove">Entfernen</button></div>`;
    box.querySelector('img').src=st.logo.src;
    box.querySelector('[data-act=lremove]').addEventListener('click',async()=>{ st.logo.src=null; await ensureImages(st); renderLogoBox(); changed(); });
  } else box.innerHTML=`<button class="btn small" data-act="lchange">Logo hochladen</button>`;
  box.querySelector('[data-act=lchange]').addEventListener('click',()=>$('#logoFile').click());
}

/** Schriftgröße im Feld: kleines und großes A in 10-%-Schritten, dazwischen der Wert, solange er nicht 100 % ist (Klick setzt zurück).
    Gibt eine Funktion zurück, die die Anzeige aus st.sizes aktualisiert. */
function sizeTool(el,k,name){
  const wrap=document.createElement('div'); wrap.className='sized'; el.before(wrap);
  const box=document.createElement('div'); box.className='fsize'; box.setAttribute('role','group'); box.setAttribute('aria-label',`Schriftgröße ${name}`);
  box.innerHTML=`<button type="button" class="dn" title="Schrift kleiner" aria-label="Schrift kleiner">A</button><button type="button" class="val" title="Zurück auf 100 %"></button><button type="button" class="up" title="Schrift größer" aria-label="Schrift größer">A</button>`;
  wrap.append(el,box);
  const [dn,val,up]=box.children, cur=()=>st.sizes[k]||1;
  const set=v=>{ v=clamp(v,SIZE_MIN,SIZE_MAX); if (v===cur()) return; if (v===1) delete st.sizes[k]; else st.sizes[k]=v; sync(); changed(); };
  const step=d=>set((Math.round(cur()*10)+d)/10);
  dn.addEventListener('click',()=>step(-1)); up.addEventListener('click',()=>step(1));
  val.addEventListener('click',()=>{ const kb=document.activeElement===val; set(1); if (kb) up.focus(); });
  // aria-disabled statt disabled: der Fokus bleibt auf dem Knopf, wenn die Grenze erreicht ist
  function sync(){ const v=cur(); val.hidden=v===1; val.textContent=Math.round(v*100)+' %'; val.setAttribute('aria-label',`Schriftgröße ${val.textContent}, zurück auf 100 %`);
    dn.setAttribute('aria-disabled',v<=SIZE_MIN); up.setAttribute('aria-disabled',v>=SIZE_MAX); }
  sync(); return sync;
}

/** Felder, die noch Beispieltexte zeigen (Formular-Reihenfolge) */
export const openSamples = () => { const s=sampleKeys(st); return fields.filter(f=>s.includes(f.k)); };
/** Springt zum ersten Beispieltext im Schritt „Texte“ */
export function goToSamples(){ showTab('texte'); openSamples()[0]?.el.focus(); }

/** Markierung der Beispieltexte im Formular und Zähler über dem Formular und unter der Vorschau */
export function syncSamples(){
  const open=openSamples(), n=open.length, one=n===1;
  fields.forEach(f=>{ const on=open.includes(f); f.el.classList.toggle('is-sample',on); f.tag.hidden=f.tools.hidden=!on; });
  $('#sampleNote').hidden=$('#sampleBtn').hidden=!n;
  $('#sampleNoteCount').textContent=`Noch ${n} ${one?'Beispieltext':'Beispieltexte'} – bitte prüfen`;
  $('#sampleBtn').textContent=`${n} ${one?'Beispieltext':'Beispieltexte'} ungeprüft`;
}

export function initTexte(){
  fields=[...$$('[data-t]')].map(el=>{
    const k=el.dataset.t, lab=$(`label[for="${el.id}"]`), name=lab.textContent.trim();
    const tag=document.createElement('span'); tag.className='tag'; tag.textContent='Beispiel'; lab.append(tag);
    const tools=document.createElement('div'); tools.className='sample-tools';
    tools.innerHTML=`<button class="btn small" data-act="ok">Passt so</button><button class="btn small ghost" data-act="clear">Leeren</button>`;
    tools.querySelector('[data-act=ok]').addEventListener('click',()=>{ st.confirmed.push(k); changed(); });
    tools.querySelector('[data-act=clear]').addEventListener('click',()=>{ st.texts[k]=el.value=''; el.focus(); changed(); });
    const head=document.createElement('div'); head.className='fhead'; lab.before(head); head.append(lab,tools);
    el.addEventListener('input',()=>{ st.texts[k]=el.value; changed(); });
    return {el,k,name,tag,tools,size:sizeTool(el,k,name)};
  });
  $('#sampleBtn').addEventListener('click',goToSamples);
  $('#datePick').addEventListener('change',e=>{
    if (!e.target.value) return;
    const [y,m,d]=e.target.value.split('-').map(Number);
    const s=new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(y,m-1,d));
    st.texts.date=s; $('#t-date').value=s; changed();
  });
  $('#logoFile').addEventListener('change',async e=>{
    const f=e.target.files[0]; e.target.value=''; if (!f) return;
    try{ st.logo.src=await fileToDataURL(f,700,true); await ensureImages(st); renderLogoBox(); changed(); }
    catch{ toast('Das Logo konnte nicht gelesen werden. Versuchen Sie eine PNG-Datei.'); }
  });
}

export function syncTexte(){
  fields.forEach(({el,k,size})=>{ if (el.value!==st.texts[k]) el.value=st.texts[k]||''; size(); });
  renderLogoBox(); syncSamples();
}
