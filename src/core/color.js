/* ---------- Farb-Hilfen ---------- */
export const hex2rgb = h => { h = h.replace('#',''); if (h.length===3) h = h.split('').map(c=>c+c).join(''); const n = parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255]; };
export const rgb2hex = (r,g,b) => '#' + [r,g,b].map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
/** Mischt zwei Hex-Farben, t=0 → a, t=1 → b */
export const mix = (a,b,t) => { const A=hex2rgb(a),B=hex2rgb(b); return rgb2hex(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t); };
export const rgba = (h,a) => { const [r,g,b]=hex2rgb(h); return `rgba(${r},${g},${b},${a})`; };
