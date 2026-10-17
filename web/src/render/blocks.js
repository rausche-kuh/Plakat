/* ---------- Klassischer Textsatz ----------
   blocks() macht aus den Texten drei Gruppen (top: Zierelement, Einladung, Titel, Untertitel;
   verse: Bibelvers und Stelle; detail: Linie, Termin, Ort, Mitwirkende, Kasten, Hinweis, Schluss).
   fitDraw() setzt zwei Gruppen in ein Rechteck und verkleinert alles, bis es passt.
   Größen und Abstände sind in Plakat-Einheiten (1000 = Breite). */
import { ornCols } from './parts.js';
import { sz, fontStr, measureW, drawSpaced, wrapLines, wrapBalanced, quote } from './text.js';

/** opt.orn: Größe des Zierelements über dem Text (0/weglassen = keins)
    opt.col: Farbsatz {ink,muted,accent,line} statt der Theme-Farben (z. B. lightCols(env))
    opt.titleBoost: Faktor für die Titelgröße */
export function blocks(env,opt={}){
  const {fs,st}=env, T=st.texts, ts=st.textScale, bs=fs.bs*ts, f=k=>sz(st,k);
  const col = opt.col || {ink:env.th.ink,muted:env.th.muted,accent:env.th.accent,line:env.th.line};
  const top=[],verse=[],detail=[],tr=s=>(s||'').trim();
  if (opt.orn && st.ornament) top.push({type:'orn',size:opt.orn,gap:0,col});
  if (tr(T.eyebrow)) top.push({type:'text',text:tr(T.eyebrow),font:fs.hand,size:26*bs*fs.italicBoost*f('eyebrow'),lh:1.3,color:col.accent,gap:24,balance:true});
  if (tr(T.title)) top.push({type:'text',text:tr(T.title),font:fs.title,size:fs.title.size*f('title')*(opt.titleBoost||1),lh:fs.title.lh,sp:fs.title.sp||0,color:col.ink,gap:tr(T.eyebrow)?10:30,balance:true});
  if (tr(T.subtitle)) top.push({type:'text',text:tr(T.subtitle),font:fs.body,size:25*bs*f('subtitle'),lh:1.35,sp:0.01,color:col.muted,gap:16,balance:true});
  if (tr(T.verse)) verse.push({type:'text',text:quote(tr(T.verse)),font:fs.verse,size:fs.verse.size*ts*f('verse'),lh:fs.verse.lh,color:col.ink,gap:38,balance:true,widthF:0.9});
  if (tr(T.ref)) verse.push({type:'text',text:tr(T.ref).toUpperCase(),font:fs.body,size:14.5*bs*f('ref'),lh:1.3,sp:0.16,color:col.muted,gap:tr(T.verse)?12:38});
  const d=[];
  if (tr(T.date)) d.push({type:'text',text:tr(T.date),font:fs.strong,size:30*bs*f('date'),lh:1.25,color:col.ink,gap:0,balance:true});
  if (tr(T.time)) d.push({type:'text',text:tr(T.time),font:fs.body,size:30*bs*f('time'),lh:1.25,color:col.accent,gap:4});
  if (tr(T.place)) d.push({type:'text',text:tr(T.place),font:fs.body,size:23*bs*f('place'),lh:1.3,color:col.ink,gap:20});
  if (tr(T.address)) d.push({type:'text',text:tr(T.address),font:fs.body,size:19*bs*f('address'),lh:1.3,color:col.muted,gap:3});
  if (tr(T.people)) d.push({type:'text',text:tr(T.people),font:fs.body,size:20*bs*f('people'),lh:1.5,color:col.muted,gap:22});
  if (tr(T.boxTitle)) d.push({type:'text',text:tr(T.boxTitle),font:fs.strong,size:24*bs*f('boxTitle'),lh:1.3,color:col.ink,gap:26,balance:true});
  if (tr(T.boxText)) d.push({type:'text',text:tr(T.boxText),font:fs.body,size:20*bs*f('boxText'),lh:1.45,color:col.muted,gap:tr(T.boxTitle)?4:24,balance:true});
  if (tr(T.note)) d.push({type:'text',text:tr(T.note),font:fs.italic,size:22*bs*fs.italicBoost*f('note'),lh:1.35,color:col.accent,gap:20,balance:true});
  if (tr(T.closing)) d.push({type:'text',text:tr(T.closing),font:fs.italic,size:24*bs*fs.italicBoost*f('closing'),lh:1.3,color:col.accent,gap:22,balance:true});
  if (d.length){ detail.push({type:'rule',width:54,gap:0,color:col.accent}); d[0].gap=26; detail.push(...d); }
  return {top,verse,detail};
}
/** Misst eine Gruppe bei Verkleinerungsfaktor k und Breite maxW → {items,h,overflow} */
export function measureGroup(env,items,k,maxW){
  const {ctx,u}=env; let h=0, overflow=false; const out=[];
  items.forEach((it,i)=>{
    const m={...it,gapPx:i===0?0:it.gap*k*u};
    if (it.type==='text'){
      const px=it.size*k*u; ctx.font=fontStr(it.font,px); const sp=(it.sp||0)*px, w=maxW*(it.widthF||1);
      const lines = it.balance ? wrapBalanced(ctx,it.text,w,sp) : wrapLines(ctx,it.text,w,sp);
      for (const l of lines) if (measureW(ctx,l,sp)>maxW+0.5) overflow=true;
      Object.assign(m,{px,sp,lines,lineH:px*it.lh}); m.h=lines.length*m.lineH;
    } else if (it.type==='orn'){ const wf=env.orn.wf; let s=it.size*k*u; if (s*wf>maxW) s=maxW/wf; m.h=s; }
    else if (it.type==='rule'){ m.h=Math.max(1,1.4*u*k); m.w=it.width*k*u; }
    h+=m.gapPx+m.h; out.push(m);
  });
  return {items:out,h,overflow};
}
/** Zeichnet eine gemessene Gruppe ab Oberkante y, gibt die Unterkante zurück */
export function drawGroup(env,g,x,y,w,align){
  const {ctx}=env;
  for (const m of g.items){
    y+=m.gapPx;
    if (m.type==='text'){
      ctx.font=fontStr(m.font,m.px); ctx.fillStyle=m.color;
      const ax = align==='center'? x+w/2 : x;
      for (const l of m.lines){ drawSpaced(ctx,l,ax,y+m.lineH/2+m.px*0.33,m.sp,align); y+=m.lineH; }
    } else if (m.type==='orn'){
      const wf=env.orn.wf, cx = align==='center'? x+w/2 : x+m.h*wf/2;
      ctx.save(); env.orn.draw(ctx,cx,y+m.h/2,m.h,ornCols(env,m.col)); ctx.restore(); y+=m.h;
    } else if (m.type==='rule'){
      ctx.strokeStyle=m.color; ctx.lineWidth=m.h; const x0 = align==='center'? x+w/2-m.w/2 : x;
      ctx.beginPath(); ctx.moveTo(x0,y+m.h/2); ctx.lineTo(x0+m.w,y+m.h/2); ctx.stroke(); y+=m.h;
    }
  }
  return y;
}
/** Setzt head und detail in Rechteck r={x,y,w,h}.
    align: 'center'|'left'; mode: 'center'|'top'|'bottom' (beide Gruppen zusammen) oder 'spread' (head oben, detail unten) */
export function fitDraw(env,head,detail,r,align,mode){
  const {u}=env; let mh,md,sp;
  for (let k=1;k>=0.25;k-=0.03){
    mh=measureGroup(env,head,k,r.w); md=measureGroup(env,detail,k,r.w);
    sp=(head.length&&detail.length)?48*k*u:0;
    if (!mh.overflow && !md.overflow && mh.h+md.h+sp<=r.h) break;
  }
  const total=mh.h+md.h+sp;
  if (mode==='spread'){ drawGroup(env,mh,r.x,r.y,r.w,align); drawGroup(env,md,r.x,r.y+r.h-md.h,r.w,align); return; }
  let y = mode==='top'? r.y : mode==='bottom'? r.y+r.h-total : r.y+(r.h-total)/2;
  y=drawGroup(env,mh,r.x,y,r.w,align); drawGroup(env,md,r.x,y+sp,r.w,align);
}
