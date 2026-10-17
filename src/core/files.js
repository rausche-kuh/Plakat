/* ---------- Dateiformat „plakatwerkstatt“ (Sichern, Übertragen, KI-Entwürfe) ---------- */
export const packFile = posters => new Blob([JSON.stringify({format:'plakatwerkstatt',version:1,exportedAt:new Date().toISOString(),posters},null,1)],{type:'application/json'});

/** Liest Plakate aus einer Datei: {posters:[…]}, ein einzelnes {state} oder ein nackter Zustand. */
export function posterList(data){
  if (!data || typeof data!=='object') return [];
  if (Array.isArray(data.posters)) return data.posters.filter(p=>p&&typeof p==='object');
  if (data.state) return [data];
  if (data.texts) return [{state:data}];
  return [];
}

/* ---------- Link „#plakat=…“: Texte und Gestaltung ohne Foto und Logo, komprimiert im Link selbst ----------
   Der Teil nach # geht nie an den Server. Hatte das Plakat ein Foto, zeigt der Empfänger das Beispielfoto. */
const pipe = (bytes,t) => new Response(new Blob([bytes]).stream().pipeThrough(t));
export async function posterLink(s){
  const state={...s,id:undefined,photo:{...s.photo,src:null,example:!!(s.photo.src||s.photo.example)},logo:{src:null}};
  const z=new Uint8Array(await pipe(JSON.stringify({name:s.name,state}),new CompressionStream('deflate-raw')).arrayBuffer());
  let bin=''; for (const b of z) bin+=String.fromCharCode(b);
  return location.origin+location.pathname+'#plakat='+btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
/** Liest {name,state} aus location.hash; null, wenn es kein Plakat-Link ist. Wirft bei beschädigtem Link. */
export async function readLink(hash){
  const m=/^#plakat=([\w-]+)$/.exec(hash); if (!m) return null;
  const bin=atob(m[1].replace(/-/g,'+').replace(/_/g,'/'));
  return JSON.parse(await pipe(Uint8Array.from(bin,c=>c.charCodeAt(0)),new DecompressionStream('deflate-raw')).text());
}
