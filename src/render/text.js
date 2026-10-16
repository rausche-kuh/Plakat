/* ---------- Textsatz: Messen, Umbrechen, Zeichnen ----------
   f ist immer eine Schrift-Rolle aus FONTSETS ({f,w,s}), px die Größe in Canvas-Pixeln,
   sp die Sperrung in Pixeln. */

export const fontStr = (f,px) => `${f.s||'normal'} ${f.w||400} ${px.toFixed(2)}px "${f.f}", Georgia, serif`;

export function measureW(ctx,text,sp){ if(!sp) return ctx.measureText(text).width; let w=0,n=0; for(const ch of text){ w+=ctx.measureText(ch).width; n++; } return w+sp*Math.max(0,n-1); }
export function drawSpaced(ctx,text,x,y,sp,align){
  if (!sp){ ctx.textAlign=align; ctx.fillText(text,x,y); return; }
  const chars=[...text], ws=chars.map(ch=>ctx.measureText(ch).width), tot=ws.reduce((a,b)=>a+b,0)+sp*(chars.length-1);
  let cx = align==='center'? x-tot/2 : align==='right'? x-tot : x;
  ctx.textAlign='left'; chars.forEach((ch,i)=>{ ctx.fillText(ch,cx,y); cx+=ws[i]+sp; });
}
export function wrapLines(ctx,text,maxW,sp){
  const out=[];
  for (const para of text.split('\n')){
    const words=para.split(/\s+/).filter(Boolean);
    if (!words.length){ out.push(''); continue; }
    let line=words[0];
    for (let i=1;i<words.length;i++){ const t=line+' '+words[i]; if (measureW(ctx,t,sp)<=maxW) line=t; else { out.push(line); line=words[i]; } }
    out.push(line);
  }
  return out;
}
/** Umbruch mit möglichst gleich langen Zeilen bei gleicher Zeilenzahl */
export function wrapBalanced(ctx,text,maxW,sp){
  const first=wrapLines(ctx,text,maxW,sp), n=first.length;
  if (n<2) return first;
  let lo=maxW*0.4, hi=maxW;
  for (let i=0;i<10;i++){ const mid=(lo+hi)/2; if (wrapLines(ctx,text,mid,sp).length<=n) hi=mid; else lo=mid; }
  return wrapLines(ctx,text,hi,sp);
}
/** Setzt deutsche Anführungszeichen, falls der Text noch keine hat */
export const quote = v => /^[„"«»‚']/.test(v) ? v : `„${v}“`;

export function tLines(ctx,f,px,text,maxW,balance){ ctx.font=fontStr(f,px); return balance?wrapBalanced(ctx,text,maxW,0):wrapLines(ctx,text,maxW,0); }
export function maxLineW(ctx,lines,sp=0){ let m=0; for(const l of lines) m=Math.max(m,measureW(ctx,l,sp)); return m; }
/** Zeichnet umbrochene Zeilen; y ist die Oberkante der ersten Zeile, lh die Zeilenhöhe in Pixeln */
export function fillLines(ctx,f,px,lines,x,y,lh,align,color,sp=0){ ctx.font=fontStr(f,px); ctx.fillStyle=color; lines.forEach((l,i)=>drawSpaced(ctx,l,x,y+i*lh+lh/2+px*0.33,sp,align)); }
/** Verkleinert die Schrift, bis kein Wort breiter als maxW ist → {px, lines} */
export function fitText(ctx,f,px,text,maxW,balance){ let lines; for(let i=0;i<24;i++){ lines=tLines(ctx,f,px,text,maxW,balance); if (maxLineW(ctx,lines)<=maxW) break; px*=0.93; } return {px,lines}; }
