/* ---------- Tab „Texte“: Textfelder (data-t), Datum aus dem Kalender, Logo ---------- */
import { st } from '../core/state.js';
import { ensureImages, fileToDataURL } from '../core/images.js';
import { $, $$, toast } from './dom.js';
import { changed } from './sync.js';

export function renderLogoBox(){
  const box=$('#logoBox');
  if (st.logo.src){
    box.innerHTML=`<div class="logo-current"><img alt="Logo"><button class="btn small" data-act="lchange">Ändern</button><button class="btn small danger" data-act="lremove">Entfernen</button></div>`;
    box.querySelector('img').src=st.logo.src;
    box.querySelector('[data-act=lremove]').addEventListener('click',async()=>{ st.logo.src=null; await ensureImages(st); renderLogoBox(); changed(); });
  } else box.innerHTML=`<button class="btn small" data-act="lchange">Logo hochladen</button>`;
  box.querySelector('[data-act=lchange]').addEventListener('click',()=>$('#logoFile').click());
}

export function initTexte(){
  $$('[data-t]').forEach(el=>el.addEventListener('input',()=>{ st.texts[el.dataset.t]=el.value; changed(); }));
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
  $$('[data-t]').forEach(el=>{ if (el.value!==st.texts[el.dataset.t]) el.value=st.texts[el.dataset.t]||''; });
  renderLogoBox();
}
