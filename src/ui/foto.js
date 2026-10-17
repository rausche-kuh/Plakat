/* ---------- Schritt 4 „Foto“: Hochladen, Ablegen auf der Vorschau, Beispielfoto oder „Ohne Foto“, Ausschnitt, Bildstimmung ---------- */
import { st } from '../core/state.js';
import { ensureImages, fileToDataURL } from '../core/images.js';
import { getLayout } from '../layouts/index.js';
import { exampleFor } from '../data/beispielfotos.js';
import { $, $$, toast, setStatus } from './dom.js';
import { syncUI, changed } from './sync.js';

function renderPhotoBox(){
  const box=$('#photoBox'), ex=exampleFor(st);
  if (st.photo.src){
    box.innerHTML=`<div class="photo-current"><img alt="Gewähltes Foto"><div class="row"><button class="btn small" data-act="change">Anderes Foto</button><button class="btn small danger" data-act="remove">Foto entfernen</button></div></div>`;
    box.querySelector('img').src=st.photo.src;
  } else {
    box.innerHTML=(ex?`<div class="note sample-note"><p>Sie sehen ein Beispielfoto („${ex.name}“). Laden Sie ein eigenes hoch, dann ersetzt es das Beispiel.</p></div>`:'')
      +`<div class="dropzone"><button class="btn primary" data-act="change">Foto hochladen</button><p>oder ein Bild auf die Vorschau ziehen. JPG, PNG oder HEIC vom Handy.</p></div>`
      +`<label class="check"><input type="checkbox" data-act="none"> Ohne Foto (Fläche mit Schmuck)</label>`;
    const none=box.querySelector('[data-act=none]'); none.checked=!st.photo.example;
    none.addEventListener('change',async()=>{ st.photo.example=!none.checked; await ensureImages(st); syncUI(); changed(); });
  }
  box.querySelectorAll('[data-act=change]').forEach(b=>b.addEventListener('click',()=>$('#photoFile').click()));
  const rm=box.querySelector('[data-act=remove]'); if (rm) rm.addEventListener('click',async()=>{ st.photo.src=null; await ensureImages(st); syncUI(); changed(); });
  // Beim Beispielfoto wirken nur Bildstimmung und Helligkeit, den Ausschnitt gibt sein Fokuspunkt vor
  $('#photoControls').hidden=!st.photo.src && !ex; $('#photoTag').hidden=!ex;
  $$('.own-photo').forEach(e=>e.hidden=!st.photo.src);
}
async function takePhoto(file){
  if (!file || !file.type.startsWith('image/')) { toast('Bitte eine Bilddatei wählen.'); return; }
  setStatus('Foto wird vorbereitet …');
  try{
    st.photo.src=await fileToDataURL(file,3000,false);
    Object.assign(st.photo,{zoom:1,x:0,y:0});
    await ensureImages(st); syncUI(); changed();
    if (!getLayout(st.layout).photo) toast('Foto übernommen. Wählen Sie ein Layout mit Foto, um es zu sehen.');
  }catch(err){ toast('Dieses Bild konnte nicht gelesen werden. Versuchen Sie ein JPG oder PNG.'); }
  setStatus();
}

export function syncPhotoUI(){
  $('#pZoom').value=Math.round(st.photo.zoom*100); $('#pZoomOut').textContent=Math.round(st.photo.zoom*100)+' %';
  $('#pX').value=Math.round(st.photo.x*100); $('#pY').value=Math.round(st.photo.y*100);
  $('#pBright').value=st.photo.brightness; $('#pBrightOut').textContent=(st.photo.brightness>0?'+':'')+st.photo.brightness;
  $$('#filterChips .chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.f===st.photo.filter));
}
export function syncFoto(){ renderPhotoBox(); syncPhotoUI(); }

export function initFoto(){
  $('#photoFile').addEventListener('change',e=>{ takePhoto(e.target.files[0]); e.target.value=''; });
  $('#noPhotoBtn').addEventListener('click',()=>$('#photoFile').click());
  const stage=$('#stage');
  stage.addEventListener('dragover',e=>{ if ([...(e.dataTransfer?.types||[])].includes('Files')){ e.preventDefault(); stage.classList.add('dragover'); } });
  stage.addEventListener('dragleave',e=>{ if (!stage.contains(e.relatedTarget)) stage.classList.remove('dragover'); });
  stage.addEventListener('drop',e=>{ e.preventDefault(); stage.classList.remove('dragover'); const f=e.dataTransfer.files[0]; if (f) takePhoto(f); });

  $('#pZoom').addEventListener('input',e=>{ st.photo.zoom=e.target.value/100; $('#pZoomOut').textContent=e.target.value+' %'; changed(); });
  $('#pX').addEventListener('input',e=>{ st.photo.x=e.target.value/100; changed(); });
  $('#pY').addEventListener('input',e=>{ st.photo.y=e.target.value/100; changed(); });
  $('#pCenter').addEventListener('click',()=>{ Object.assign(st.photo,{zoom:1,x:0,y:0}); syncPhotoUI(); changed(); });
  $$('#filterChips .chip').forEach(c=>c.addEventListener('click',()=>{ st.photo.filter=c.dataset.f; syncPhotoUI(); changed(); }));
  $('#pBright').addEventListener('input',e=>{ st.photo.brightness=+e.target.value; $('#pBrightOut').textContent=(e.target.value>0?'+':'')+e.target.value; changed(); });
}
