/* ---------- Dekor und Bausteine für Milchglas, Abriss, Aquarell, Bogen und Farbfeld ----------
   Elemente (textEl, infoEl, listEl, panelEl) haben dieselbe Form wie im Herzlich-Baukasten:
   {gap, measure(k) → Höhe, draw(y), width() → Breite des Inhalts nach measure}.
   Gestapelt werden sie mit warmStack (verteilt) oder stackAt (kompakt ab y). */
import { hex2rgb } from '../core/color.js';
import { rng, rot } from './shapes.js';
import { fontStr, maxLineW, fillLines, fitText } from './text.js';

/* ---- Texte zerlegen ---- */
const MONTHS=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const WEEKDAYS=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
/** „Sonntag, 4. Juli 2027“, „04.07.2026“, „Sa 4.7.“, „Ostersonntag, 28. März“ … → {wd, day, month, year}; null, wenn es nicht eindeutig ist
    (z. B. „3. bis 5. Juli“) – dann zeigen die Layouts das Datum als Text. */
export function dateParts(s){
  const m=(s||'').trim().match(/^(?:([A-Za-zÄÖÜäöüß]{2,})\.?\s*,?\s*(?:den\s+)?)?(\d{1,2})\.\s*(?:([A-Za-zÄÖÜäöüß]{3,})\.?|(\d{1,2})\.?)\s*(\d{4}|\d{2})?$/);
  if (!m) return null;
  const day=+m[2], name=(m[3]||'').toLowerCase(), mi=m[4]? +m[4]-1 : MONTHS.findIndex(x=>x.toLowerCase().startsWith(name.slice(0,3))||(name==='mrz'&&x==='März'));
  if (day<1||day>31||mi<0||mi>11) return null;
  const year=m[5]? (m[5].length===2?'20'+m[5]:m[5]) : '';
  // Wochentag (auch abgekürzt) oder ein eigener Name wie „Ostersonntag“; ohne Angabe aus dem Datum berechnet
  let wd=''; if (m[1]) wd=WEEKDAYS.find(w=>w.toLowerCase().startsWith(m[1].toLowerCase()))||(m[1].length>3?m[1]:'');
  else if (year) wd=WEEKDAYS[new Date(+year,mi,day).getDay()];
  return {wd,day:String(day),month:MONTHS[mi],year};
}
/** Mitwirkende/Programm → [{main, sub}]: eine Zeile pro Eintrag, Text nach „ – “ wird zur kleinen Erläuterung */
export function listItems(s){
  return (s||'').split('\n').map(l=>l.trim().replace(/^[•*·–-]\s+/,'')).filter(Boolean).map(l=>{
    const i=l.search(/\s[–—-]\s/); return i>0? {main:l.slice(0,i).trim(),sub:l.slice(i+3).trim()} : {main:l,sub:''}; });
}

/* ---- Farben ---- */
/** Helligkeit einer Hex-Farbe 0…1 */
export const luma = h => { const [r,g,b]=hex2rgb(h); return (0.299*r+0.587*g+0.114*b)/255; };
/** Lesbare Schriftfarbe auf einer Fläche */
export const inkOn = (bg,dark='#1F1D1A',light='#FFFDF8') => luma(bg)>0.6? dark : light;
/** Farben für Milchglas-Flächen: hell mit dunkler Schrift, bei „Dunkel“ dunkel mit heller Schrift */
export function glassCols(env){
  const {th,st}=env, dark=st.variant==='dunkel', [r,g,b]=hex2rgb(dark?th.bg:'#ffffff');
  return dark? {fill:`rgba(${r},${g},${b},0.6)`,edge:'rgba(255,255,255,0.22)',ink:th.ink,accent:th.accent,muted:th.muted}
             : {fill:'rgba(255,255,255,0.66)',edge:'rgba(255,255,255,0.85)',ink:th.ink,accent:th.accent,muted:th.muted};
}

/* ---- Symbole: Kalender, Uhr, Ortsmarke (Strichzeichnung, mittig um x,y, Höhe s) ---- */
export function icon(c,kind,x,y,s,color){
  c.save(); c.strokeStyle=color; c.fillStyle=color; c.lineWidth=Math.max(1,s*0.085); c.lineCap='round'; c.lineJoin='round';
  if (kind==='date'){ const w=s*0.86, h=s*0.74, x0=x-w/2, y0=y-h/2+s*0.07;
    rrect(c,x0,y0,w,h,s*0.1); c.stroke(); c.beginPath(); c.moveTo(x0,y0+h*0.3); c.lineTo(x0+w,y0+h*0.3); c.stroke();
    c.beginPath(); c.moveTo(x-w*0.24,y0-s*0.12); c.lineTo(x-w*0.24,y0+s*0.08); c.moveTo(x+w*0.24,y0-s*0.12); c.lineTo(x+w*0.24,y0+s*0.08); c.stroke();
    for (let i=0;i<3;i++) for (let j=0;j<2;j++){ c.beginPath(); c.arc(x0+w*(0.25+i*0.25),y0+h*(0.52+j*0.24),s*0.045,0,Math.PI*2); c.fill(); } }
  else if (kind==='time'){ const r=s*0.44; c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.stroke();
    c.beginPath(); c.moveTo(x,y-r*0.6); c.lineTo(x,y); c.lineTo(x+r*0.42,y+r*0.22); c.stroke(); }
  else if (kind==='place'){ const r=s*0.3, cy=y-s*0.14;
    c.beginPath(); c.moveTo(x,y+s*0.48); c.bezierCurveTo(x-r*0.55,cy+r*1.3,x-r,cy+r*0.8,x-r,cy); c.arc(x,cy,r,Math.PI,0); c.bezierCurveTo(x+r,cy+r*0.8,x+r*0.55,cy+r*1.3,x,y+s*0.48); c.stroke();
    c.beginPath(); c.arc(x,cy,r*0.36,0,Math.PI*2); c.stroke(); }
  c.restore();
}

/* ---- Formen ---- */
/** Rechteck mit runden Ecken (im Uhrzeigersinn, damit sich mehrere zu einer Fläche vereinen) */
export function rrect(c,x,y,w,h,r,fresh=true){
  r=Math.max(0,Math.min(r,w/2,h/2)); if (fresh) c.beginPath();
  c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath();
}
/** Geschlossener Umriss durch Punkte [x, y, Radius] mit abgerundeten Ecken */
function roundPoly(c,P){
  const n=P.length, mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2], s=mid(P[n-1],P[0]);
  c.moveTo(s[0],s[1]); P.forEach((p,i)=>{ const q=P[(i+1)%n]; c.arcTo(p[0],p[1],q[0],q[1],p[2]); }); c.closePath();
}
/** Milchglas-Umriss: abgerundetes Rechteck mit einer Stufe an einer Ecke (wie ausgeschnitten).
    notch: 'tl'|'tr'|'bl'|'br'|'' – an dieser Ecke springt die Kante um d nach innen. */
export function glassPath(c,x,y,w,h,r,notch,d){
  c.beginPath(); if (!notch||w<4*r||h<3*r){ rrect(c,x,y,w,h,r,false); return; }
  const s=d*0.5, a=x+w*0.58, b=x+w*0.42, x1=x+w, y1=y+h;
  roundPoly(c,{tr:[[x,y,r],[a,y,s],[a,y+d,s],[x1,y+d,r],[x1,y1,r],[x,y1,r]],
    tl:[[x,y+d,r],[b,y+d,s],[b,y,s],[x1,y,r],[x1,y1,r],[x,y1,r]],
    br:[[x,y,r],[x1,y,r],[x1,y1-d,r],[a,y1-d,s],[a,y1,s],[x,y1,r]],
    bl:[[x,y,r],[x1,y,r],[x1,y1,r],[b,y1,s],[b,y1-d,s],[x,y1-d,r]]}[notch]);
}
/** Milchglas: Hintergrund unter der Fläche weichzeichnen und hell (bzw. dunkel) abdecken.
    path(c) legt den Umriss an; bbox {x,y,w,h} in Pixeln begrenzt das Weichzeichnen. */
export function frost(env,path,bbox,gc,blur=9){
  const {ctx,u}=env, cv=ctx.canvas;
  ctx.save(); path(ctx); ctx.clip();
  if (blur && 'filter' in ctx){
    const b=blur*u, x0=Math.max(0,Math.floor(bbox.x-3*b)), y0=Math.max(0,Math.floor(bbox.y-3*b));
    const x1=Math.min(cv.width,Math.ceil(bbox.x+bbox.w+3*b)), y1=Math.min(cv.height,Math.ceil(bbox.y+bbox.h+3*b));
    if (x1>x0 && y1>y0){ ctx.filter=`blur(${b.toFixed(1)}px)`; ctx.drawImage(cv,x0,y0,x1-x0,y1-y0,x0,y0,x1-x0,y1-y0); ctx.filter='none'; }
  }
  ctx.fillStyle=gc.fill; ctx.fillRect(bbox.x-2,bbox.y-2,bbox.w+4,bbox.h+4);
  ctx.restore();
  ctx.save(); path(ctx); ctx.strokeStyle=gc.edge; ctx.lineWidth=Math.max(1,1.4*u); ctx.stroke(); ctx.restore();
}
/** Gerissene Papierkante bei Höhe y von x0 bis x1, Fläche nach unten bis bottom. amp: Ausschlag */
export function tornPath(c,x0,x1,y,bottom,amp,seed){
  const r=rng(seed), n=Math.max(24,Math.round((x1-x0)/(amp*0.9))); let wv=0;
  c.beginPath(); c.moveTo(x0,bottom); c.lineTo(x0,y);
  for (let i=1;i<=n;i++){ wv+=(r()-0.5)*0.7; wv*=0.85; c.lineTo(x0+(x1-x0)*i/n, y+wv*amp*1.6+(r()-0.5)*amp*(r()<0.25?1.6:0.7)); }
  c.lineTo(x1,bottom); c.closePath();
}

/* ---- Aquarell ---- */
function deform(P,depth,v,r){
  for (let d=0;d<depth;d++){ const Q=[];
    for (let i=0;i<P.length;i++){ const a=P[i], b=P[(i+1)%P.length], L=Math.hypot(b[0]-a[0],b[1]-a[1]), ang=r()*Math.PI*2, g=(r()+r()+r()-1.5)/1.5;
      Q.push(a,[(a[0]+b[0])/2+Math.cos(ang)*L*v*a[2]*g,(a[1]+b[1])/2+Math.sin(ang)*L*v*a[2]*g,a[2]*(0.7+r()*0.5)]); }
    P=Q; }
  return P;
}
/** Aquarell-Fleck um (cx,cy), Radien rx/ry, Farbe als Hex. Viele dünne, verformte Schichten ergeben weiche Ränder.
    Am besten innerhalb von washLayer zeichnen – dann werden die Kanten zusätzlich weich. */
export function wash(env,cx,cy,rx,ry,color,seed,o={}){
  const {ctx}=env, r=rng(seed), [R,G,B]=hex2rgb(color), n=o.n||10, layers=o.layers||30;
  let base=[]; for (let i=0;i<n;i++){ const a=i/n*Math.PI*2, k=0.8+r()*0.3; base.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k,0.5+r()*1.0]); }
  base=deform(base,3,0.35,r);
  ctx.save(); ctx.fillStyle=`rgba(${R},${G},${B},${o.alpha||0.028})`;
  const path=P=>{ ctx.beginPath(); P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])); ctx.closePath(); };
  for (let l=0;l<layers;l++){ const s=0.9+r()*0.18; path(deform(base.map(p=>[cx+(p[0]-cx)*s,cy+(p[1]-cy)*s,p[2]]),3,0.5,r)); ctx.fill(); }
  // dunklere Ränder, wo sich beim Trocknen die Farbe sammelt
  ctx.strokeStyle=`rgba(${R},${G},${B},${(o.alpha||0.028)*2.2})`; ctx.lineWidth=Math.max(rx,ry)*0.012; ctx.lineJoin='round';
  for (let l=0;l<3;l++){ path(deform(base,2,0.3,r)); ctx.stroke(); }
  ctx.restore();
}
/** Zeichnet fn(env') in geringer Auflösung (≈ 5 Einheiten je Pixel) und legt das Ergebnis vergrößert auf:
    weiche, „verlaufene“ Kanten für Aquarell-Flecken. */
export function washLayer(env,fn){
  const {ctx,W,H}=env, c=document.createElement('canvas'); c.width=Math.min(W,240); c.height=Math.round(c.width*H/W);
  const x=c.getContext('2d'); x.scale(c.width/W,c.height/H); fn({...env,ctx:x});
  ctx.save(); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.drawImage(c,0,0,W,H); ctx.restore();
}
/** Weicher, unregelmäßiger Umriss mit leicht rauer Kante (für Fotos im Aquarell-Layout) */
export function blobPath(c,cx,cy,rx,ry,seed){
  const r=rng(seed), ph=[0,0,0,0].map(()=>r()*Math.PI*2), n=180; c.beginPath();
  for (let i=0;i<n;i++){ const a=i/n*Math.PI*2, k=1+0.05*Math.sin(2*a+ph[0])+0.035*Math.sin(3*a+ph[1])+0.02*Math.sin(5*a+ph[2])+0.008*Math.sin(17*a+ph[3])+(r()-0.5)*0.008;
    i? c.lineTo(cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k) : c.moveTo(cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k); }
  c.closePath();
}

/* ---- Datumsstempel ---- */
/** Runder Stempel mit Wochentag, Tag (groß), Monat und Jahr. o: {fill, ink, deg, scallop, fonts:{small, big}} */
export function dateBadge(env,cx,cy,R,d,o){
  const {ctx,u}=env;
  rot(ctx,cx,cy,o.deg||0,()=>{
    ctx.save(); ctx.shadowColor='rgba(40,25,10,0.28)'; ctx.shadowBlur=18*u; ctx.shadowOffsetY=6*u; ctx.fillStyle=o.fill; ctx.beginPath();
    if (o.scallop){ const n=22; for (let i=0;i<=n*2;i++){ const a=i/(n*2)*Math.PI*2, rr=i%2?R:R*0.94; i?ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):ctx.moveTo(cx+rr,cy); } }
    else ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle=o.ink; ctx.globalAlpha=0.45; ctx.lineWidth=Math.max(1,1.3*u); ctx.setLineDash([3*u,4*u]); ctx.beginPath(); ctx.arc(cx,cy,R*0.82,0,Math.PI*2); ctx.stroke(); ctx.restore();
    const w=R*1.3, top=d.wd? fitText(ctx,o.fonts.small,R*0.2,d.wd,w,false):null, mon=fitText(ctx,o.fonts.small,R*0.24,d.month,w,false), day=fitText(ctx,o.fonts.big,R*0.82,d.day,w,false);
    const yr=d.year? fitText(ctx,o.fonts.small,R*0.17,d.year,w*0.7,false):null;
    const dh=day.px*0.86, th=top?top.px*1.1:0, mh=mon.px*1.1, yh=yr?yr.px*1.1:0, y0=cy-(th+dh+mh+yh)/2;
    if (top) fillLines(ctx,o.fonts.small,top.px,top.lines,cx,y0,th,'center',o.ink);
    fillLines(ctx,o.fonts.big,day.px,day.lines,cx,y0+th,dh,'center',o.ink);
    fillLines(ctx,o.fonts.small,mon.px,mon.lines,cx,y0+th+dh,mh,'center',o.ink);
    if (yr) fillLines(ctx,o.fonts.small,yr.px,yr.lines,cx,y0+th+dh+mh,yh,'center',o.ink);
  });
}

/* ---- Elemente ---- */
const ax = o => o.align==='center'? o.x+o.w/2 : o.align==='right'? o.x+o.w : o.x;
/** Ein Textblock. o: {text, font, size (Einheiten), lh, color, x, w, align, gap, sp, upper, balance, shadow, deg} */
export function textEl(env,o){
  const {ctx,u}=env, t=o.upper? o.text.toUpperCase() : o.text; let m;
  return {gap:o.gap||0,
    measure(k){ m=fitText(ctx,o.font,o.size*k*u,t,o.w,o.balance!==false); m.lh=m.px*(o.lh||1.25); ctx.font=fontStr(o.font,m.px); m.w=maxLineW(ctx,m.lines,(o.sp||0)*m.px); return m.lines.length*m.lh; },
    width:()=>m.w,
    draw(y){ const x=ax(o), h=m.lines.length*m.lh, go=()=>{
        if (o.shadow){ ctx.save(); ctx.shadowColor=o.shadow; ctx.shadowBlur=m.px*0.28; ctx.shadowOffsetY=m.px*0.04; }
        fillLines(ctx,o.font,m.px,m.lines,x,y,m.lh,o.align||'left',o.color,(o.sp||0)*m.px);
        if (o.shadow) ctx.restore(); };
      if (o.deg) rot(ctx,x,y+h/2,o.deg,go); else go(); } };
}
/** Termin-Zeilen mit Symbol. o: {rows:[{icon:'date'|'time'|'place', text, sub, f, sf}] (f/sf: Größenfaktor von text/sub), x, w, align, font, size, subFont, subSize, color, subColor, iconColor, gap} */
export function infoEl(env,o){
  const {ctx,u}=env; let m;
  return {gap:o.gap||0,
    measure(k){ const px=o.size*k*u, is=px*Math.max(...o.rows.map(r=>r.f||1)), ig=px*0.5, tw=o.w-is-ig; let h=0;
      m={is,ig,rows:o.rows.map((r,i)=>{ const a=fitText(ctx,o.font,px*(r.f||1),r.text,tw,false), b=r.sub? fitText(ctx,o.subFont,o.subSize*(r.sf||1)*k*u,r.sub,tw,false):null;
        const lh=a.px*1.2, slh=b?b.px*1.3:0; ctx.font=fontStr(o.font,a.px); let w=maxLineW(ctx,a.lines); if (b){ ctx.font=fontStr(o.subFont,b.px); w=Math.max(w,maxLineW(ctx,b.lines)); }
        const row={...r,a,b,lh,slh,rh:a.lines.length*lh+(b?b.lines.length*slh:0),w,gb:i?px*0.42:0,is:px*(r.f||1)}; h+=row.gb+row.rh; return row; })};
      m.w=Math.max(...m.rows.map(r=>r.w))+is+ig; return h; },
    width:()=>m.w,
    draw(y){ for (const r of m.rows){ y+=r.gb; const bw=m.is+m.ig+r.w, x0=o.align==='center'? o.x+(o.w-bw)/2 : o.x, tx=x0+m.is+m.ig;
      icon(ctx,r.icon,x0+m.is/2,y+r.lh*0.5,r.is*0.92,o.iconColor);
      fillLines(ctx,o.font,r.a.px,r.a.lines,tx,y,r.lh,'left',o.color);
      if (r.b) fillLines(ctx,o.subFont,r.b.px,r.b.lines,tx,y+r.a.lines.length*r.lh,r.slh,'left',o.subColor);
      y+=r.rh; } } };
}
/** Programm als Liste mit Punkten. o: {items:[{main,sub}], x, w, font, size, subFont, subSize, color, subColor, bullet, gap, align} */
export function listEl(env,o){
  const {ctx,u}=env; let m;
  return {gap:o.gap||0,
    measure(k){ const px=o.size*k*u, bi=o.align==='center'?0:px*0.8; let h=0, w=0;
      m={bi,px,rows:o.items.map((it,i)=>{ const a=fitText(ctx,o.font,px,it.main,o.w-bi,o.align==='center'), b=it.sub? fitText(ctx,o.subFont,o.subSize*k*u,it.sub,o.w-bi,true):null;
        const lh=a.px*1.18, slh=b?b.px*1.25:0; ctx.font=fontStr(o.font,a.px); w=Math.max(w,maxLineW(ctx,a.lines)); if (b){ ctx.font=fontStr(o.subFont,b.px); w=Math.max(w,maxLineW(ctx,b.lines)); }
        const row={a,b,lh,slh,rh:a.lines.length*lh+(b?b.lines.length*slh+px*0.06:0),gb:i?px*(b?0.34:0.16):0}; h+=row.gb+row.rh; return row; })};
      m.w=w+bi; return h; },
    width:()=>m.w,
    draw(y){ const C=o.align==='center', x=C?o.x+o.w/2:o.x+m.bi;
      for (const r of m.rows){ y+=r.gb;
        if (!C){ ctx.fillStyle=o.bullet; ctx.beginPath(); ctx.arc(o.x+m.bi*0.32,y+r.lh*0.55,m.px*0.12,0,Math.PI*2); ctx.fill(); }
        fillLines(ctx,o.font,r.a.px,r.a.lines,x,y,r.lh,C?'center':'left',o.color);
        if (r.b) fillLines(ctx,o.subFont,r.b.px,r.b.lines,x,y+r.a.lines.length*r.lh+m.px*0.06,r.slh,C?'center':'left',o.subColor);
        y+=r.rh; } } };
}
/** Milchglas-Fläche um Elemente. Die Elemente liegen in (o.x+pad, o.w-2·pad); die Fläche schmiegt sich an den Inhalt.
    o: {x, w, pad, gc: glassCols, notch, anchor:'left'|'center'|'right', deg (Drehung des Inhalts), gap, bleed (rechts über den Rand)} */
export function panelEl(env,els,o){
  const {u}=env; let m; const el={gap:o.gap||0, rect:null,
    measure(k){ const pad=(o.pad||26)*k*u, padY=pad*0.8; let h=0, w=0;
      const hs=els.map((e,i)=>{ const eh=e.measure(k); h+=eh+(i?e.gap*k*u:0); w=Math.max(w,e.width()); return eh; });
      m={pad,padY,hs,k,h:h+2*padY,pw:Math.min(o.w,w+2*pad)}; return m.h; },
    width:()=>m.pw,
    draw(y){ const {ctx}=env, pw=m.pw+(o.bleed||0), px= o.anchor==='right'? o.x+o.w-m.pw : o.anchor==='center'? o.x+(o.w-m.pw)/2 : o.x;
      const r={x:px,y,w:pw,h:m.h}; el.rect=r;
      frost(env,c=>glassPath(c,r.x,r.y,r.w,r.h,Math.min(30*u,r.h*0.3),o.notch,12*u),r,o.gc);
      // Inhalt liegt in (o.x+pad, o.w-2·pad): so verschieben, dass seine Mitte bzw. Kante zur Fläche passt
      const free=o.w-m.pw, C=o.align==='center', dx= o.anchor==='center'? (C?0:free/2) : o.anchor==='right'? (C?free/2:free) : (C?-free/2:0);
      let yy=y+m.padY; const go=()=>els.forEach((e,i)=>{ if (i) yy+=e.gap*m.k*u; e.draw(yy); yy+=m.hs[i]; });
      ctx.save(); ctx.translate(dx,0); if (o.deg) rot(ctx,o.x+o.w/2,y+m.h/2,o.deg,go); else go(); ctx.restore(); } };
  return el;
}
/** Stapelt Elemente kompakt ab y; verkleinert nur, wenn maxH nicht reicht. Gibt die Unterkante zurück. */
export function stackAt(env,els,y,maxH){
  const {u}=env; if (!els.length) return y; let hs,gaps;
  for (let k=1;k>=0.25;k-=0.03){ hs=els.map(e=>e.measure(k)); gaps=els.map((e,i)=>i?e.gap*k*u:0); if (hs.reduce((a,b)=>a+b,0)+gaps.reduce((a,b)=>a+b,0)<=maxH) break; }
  els.forEach((e,i)=>{ y+=gaps[i]; e.draw(y); y+=hs[i]; }); return y;
}
/** Höhe eines Stapels bei Faktor 1 (zum Planen der Flächen) */
export const stackH = (env,els) => els.reduce((s,e,i)=>s+e.measure(1)+(i?e.gap*env.u:0),0);
