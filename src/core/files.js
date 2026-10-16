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
