/* ---------- Bilder: Foto und Logo laden, Bildstimmung anwenden ---------- */
let photoImg=null, photoSrc=null, logoImg=null, logoSrc=null;
const procCache = new Map();
export const loadImage = src => new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; });

/** Lädt Foto und Logo des Zustands, falls sie sich geändert haben. */
export async function ensureImages(st){
  if (st.photo.src!==photoSrc){ photoSrc=st.photo.src; procCache.clear(); photoImg = photoSrc ? await loadImage(photoSrc).catch(()=>null) : null; }
  if (st.logo.src!==logoSrc){ logoSrc=st.logo.src; logoImg = logoSrc ? await loadImage(logoSrc).catch(()=>null) : null; }
}
export const logoImage = () => logoImg;

/** Foto mit Filter und Helligkeit als Canvas (höchstens maxDim Pixel), zwischengespeichert. */
export function processed(maxDim, photo){
  if (!photoImg) return null;
  const key = maxDim+'|'+photo.filter+'|'+photo.brightness;
  if (procCache.has(key)) return procCache.get(key);
  const iw=photoImg.naturalWidth, ih=photoImg.naturalHeight, sc=Math.min(1,maxDim/Math.max(iw,ih));
  const c=document.createElement('canvas'); c.width=Math.round(iw*sc); c.height=Math.round(ih*sc);
  const x=c.getContext('2d'); x.drawImage(photoImg,0,0,c.width,c.height);
  const f=photo.filter, add=photo.brightness*1.8;
  if (f!=='original' || add){
    const im=x.getImageData(0,0,c.width,c.height), d=im.data;
    for (let i=0;i<d.length;i+=4){
      let r=d[i],g=d[i+1],b=d[i+2];
      if (f==='warm'){ r=r*1.05+9; g=g*1.01+3; b=b*0.9; }
      else if (f==='sonnig'){ r=r*1.06+14; g=g*1.02+8; b=b*0.9+2; const l=(r+g+b)/3; r=l+(r-l)*1.16; g=l+(g-l)*1.16; b=l+(b-l)*1.16; }
      else if (f==='sanft'){ r=r*0.84+38; g=g*0.84+36; b=b*0.84+34; }
      else if (f==='sw'){ const l=(0.299*r+0.587*g+0.114*b-128)*1.08+128; r=g=b=l; }
      else if (f==='sepia'){ const tr=0.393*r+0.769*g+0.189*b, tg=0.349*r+0.686*g+0.168*b, tb=0.272*r+0.534*g+0.131*b; r=r*0.2+tr*0.8; g=g*0.2+tg*0.8; b=b*0.2+tb*0.8; }
      d[i]=r+add; d[i+1]=g+add; d[i+2]=b+add;
    }
    x.putImageData(im,0,0);
  }
  procCache.set(key,c);
  if (procCache.size>4) procCache.delete(procCache.keys().next().value);
  return c;
}

/** Datei → verkleinerte Data-URL (JPEG mit weißem Grund oder PNG mit Transparenz) */
export async function fileToDataURL(file, maxDim, asPng){
  const url = URL.createObjectURL(file);
  try{
    const img = await loadImage(url);
    const iw=img.naturalWidth||1200, ih=img.naturalHeight||1200, sc=Math.min(1,maxDim/Math.max(iw,ih));
    const c=document.createElement('canvas'); c.width=Math.round(iw*sc); c.height=Math.round(ih*sc);
    const x=c.getContext('2d');
    if (!asPng){ x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); }
    x.drawImage(img,0,0,c.width,c.height);
    return asPng ? c.toDataURL('image/png') : c.toDataURL('image/jpeg',0.9);
  } finally { URL.revokeObjectURL(url); }
}
