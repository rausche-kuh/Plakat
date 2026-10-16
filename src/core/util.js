/* ---------- Allgemeine Hilfen ---------- */
export const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
export const clone = o => JSON.parse(JSON.stringify(o));
export const uid = () => 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
export const firstLine = s => (s||'').split('\n').map(x=>x.trim()).filter(Boolean).join(' ');
export const slug = s => (firstLine(s)||'plakat').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'plakat';
