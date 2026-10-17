/* ---------- Herzlich-Baukasten: Papier, Pinsel, Handschrift ----------
   Für die Herzlich-Layouts (Einladung, Pinnwand; Teile auch in Abriss und Aquarell). Die Elemente aus warmEls/warmCard/warmClosing
   haben die Form {gap, measure(k) → Höhe, draw(y[,x])} und werden mit warmStack gestapelt. */
import { mix } from '../core/color.js';
import { rng, rot } from './shapes.js';
import { sz, fontStr, measureW, drawSpaced, quote, maxLineW, fillLines, fitText } from './text.js';
import { drawPhoto } from './parts.js';

/** Verzierungen nur, wenn eingeschaltet und der Anlass nicht still ist (z. B. Karfreitag) */
export const canDoodle = env => env.st.doodles && !env.occ.quiet;

function paperPath(c,x,y,w,h,seed,j){
  const r=rng(seed), nx=14, ny=5, P=[];
  for(let i=0;i<nx;i++) P.push([x+w*i/nx, y+(r()-0.5)*j]);
  for(let i=0;i<ny;i++) P.push([x+w+(r()-0.5)*j, y+h*i/ny]);
  for(let i=nx;i>0;i--) P.push([x+w*i/nx, y+h+(r()-0.5)*j]);
  for(let i=ny;i>0;i--) P.push([x+(r()-0.5)*j, y+h*i/ny]);
  c.beginPath(); P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath();
}
/** Papierzettel mit leicht unregelmäßigem Rand und Schatten */
export function drawPaper(env,x,y,w,h,seed,color){
  const {ctx,u}=env;
  ctx.save(); ctx.shadowColor='rgba(60,40,20,0.26)'; ctx.shadowBlur=22*u; ctx.shadowOffsetY=6*u;
  ctx.fillStyle=color; paperPath(ctx,x,y,w,h,seed,6*u); ctx.fill(); ctx.restore();
  ctx.save(); paperPath(ctx,x,y,w,h,seed,6*u); ctx.clip(); const r=rng(seed+3);
  ctx.fillStyle='rgba(120,90,50,0.045)'; for(let i=0;i<36;i++) ctx.fillRect(x+r()*w,y+r()*h,(8+r()*40)*u,1.2*u);
  ctx.restore();
}
function brushPath(c,x,y,w,h,seed){
  const r=rng(seed), n=Math.max(6,Math.round(w/(h*0.7)));
  c.beginPath(); c.moveTo(x+r()*h*0.2,y);
  for(let i=1;i<=n;i++) c.lineTo(x+w*i/n, y+(r()-0.5)*h*0.1);
  for(let i=1;i<6;i++) c.lineTo(x+w+(i%2?1:-0.5)*r()*h*0.22, y+h*i/6);
  for(let i=n;i>=1;i--) c.lineTo(x+w*i/n-w/n, y+h+(r()-0.5)*h*0.1);
  for(let i=5;i>=1;i--) c.lineTo(x-(i%2?1:-0.5)*r()*h*0.22, y+h*i/6);
  c.closePath();
}
/** Pinselstrich als Hintergrund für eine Textzeile */
export function drawBrush(env,x,y,w,h,color,seed){
  const {ctx}=env; ctx.save(); ctx.fillStyle=color; brushPath(ctx,x,y,w,h,seed); ctx.fill(); ctx.clip();
  const r=rng(seed+11); ctx.lineCap='round';
  for(let i=0;i<7;i++){ const yy=y+h*(0.12+r()*0.76);
    ctx.strokeStyle=i%2?'rgba(255,255,255,0.10)':'rgba(0,0,0,0.07)'; ctx.lineWidth=Math.max(1,h*(0.03+r()*0.05));
    ctx.beginPath(); ctx.moveTo(x+w*r()*0.25,yy); ctx.lineTo(x+w*(0.55+r()*0.45),yy+(r()-0.5)*h*0.08); ctx.stroke(); }
  ctx.restore();
}
/** Kleine Kirche als Strichzeichnung */
export function churchIcon(c,x,y,s,color){
  c.save(); c.strokeStyle=color; c.lineWidth=Math.max(1,s*0.075); c.lineCap='round'; c.lineJoin='round';
  const b=y+s*0.5, t0=x-s*0.5, t1=x-s*0.16, tt=y-s*0.04, sp=y-s*0.34, tc=(t0+t1)/2, nr=x+s*0.5, peak=(t1+nr)/2;
  c.beginPath(); c.moveTo(t0,b); c.lineTo(t0,tt); c.lineTo(tc,sp); c.lineTo(t1,tt); c.lineTo(t1,b);
  c.moveTo(t1,y+s*0.1); c.lineTo(peak,y-s*0.14); c.lineTo(nr,y+s*0.1); c.lineTo(nr,b); c.lineTo(t0-s*0.04,b); c.stroke();
  c.beginPath(); c.moveTo(tc,sp); c.lineTo(tc,y-s*0.5); c.moveTo(tc-s*0.06,y-s*0.44); c.lineTo(tc+s*0.06,y-s*0.44); c.stroke();
  c.beginPath(); c.moveTo(peak-s*0.07,b); c.lineTo(peak-s*0.07,y+s*0.3); c.arc(peak,y+s*0.3,s*0.07,Math.PI,0); c.lineTo(peak+s*0.07,b); c.stroke();
  c.restore();
}
/** Drei kurze Striche neben einem Wort; dir -1 = nach links, 1 = nach rechts */
export function sparkles(c,x,y,s,color,dir){
  c.save(); c.strokeStyle=color; c.lineWidth=Math.max(1,s*0.12); c.lineCap='round';
  [-0.8,0,0.8].forEach((a,i)=>{ const ang=a+(dir<0?Math.PI:0), r1=s*0.42, r2=s*(i===1?1:0.86);
    c.beginPath(); c.moveTo(x+Math.cos(ang)*r1,y+Math.sin(ang)*r1); c.lineTo(x+Math.cos(ang)*r2,y+Math.sin(ang)*r2); c.stroke(); });
  c.restore();
}
/** Farben für Papier, Pinselbänder und Text darauf */
export function warmCols(env){
  const {occ,st}=env, th=env.th, dark=st.variant==='dunkel';
  return {paper: dark? mix(occ.warm.paper,'#ffffff',0.3) : mix(th.bg,'#ffffff',0.55),
    pInk: dark? occ.warm.ink : th.ink, pAccent: dark? (st.accent||occ.warm.a) : th.accent,
    band: dark? occ.warm.b : th.second, band2: dark? (st.accent||occ.warm.a) : th.accent, onBand:'#FFFDF8'};
}
/** Hauptelemente in Lesereihenfolge.
    o: {x, w, align:'left'|'center', label: Titel auf Papierzettel, polaroid: Foto als Sofortbild, wc: warmCols(env)} */
export function warmEls(env,o){
  const {ctx,u,fs,th,st}=env, T=st.texts, ts=st.textScale, wc=o.wc, tr=s=>(s||'').trim(), C=o.align==='center', ax=C?o.x+o.w/2:o.x, f=k=>ts*sz(st,k);
  const doodle=canDoodle(env), ink=th.ink, els=[];
  // Ort und Adresse in einer Zeile: Größe von „Ort“ (ohne Ort die der Adresse)
  const placeTxt=[tr(T.place),tr(T.address)].filter(Boolean).join(', '), pf=f(tr(T.place)?'place':'address');
  if (tr(T.eyebrow)){ let m; els.push({gap:0,
    measure(k){ m=fitText(ctx,fs.handB,40*f('eyebrow')*k*u,tr(T.eyebrow),o.w*0.88,true); m.lh=m.px*1.22; return m.lines.length*m.lh; },
    draw(y){ rot(ctx,ax,y,-2,()=>{ fillLines(ctx,fs.handB,m.px,m.lines,ax,y,m.lh,o.align,ink);
      if (doodle){ ctx.font=fontStr(fs.handB,m.px); const w=measureW(ctx,m.lines[0]), cy=y+m.lh*0.5;
        if (C){ sparkles(ctx,ax-w/2-m.px*0.25,cy,m.px*0.6,th.accent,-1); sparkles(ctx,ax+w/2+m.px*0.25,cy,m.px*0.6,th.accent,1); }
        else sparkles(ctx,ax+w+m.px*0.25,cy-m.px*0.1,m.px*0.6,th.accent,1); } }); } }); }
  if (tr(T.title)||tr(T.subtitle)){ let m; els.push({gap:16,
    measure(k){
      const pad=o.label?34*k*u:0, orn=o.label&&st.ornament?54*k*u:0, innerW=o.w-2*pad-orn;
      const t=tr(T.title)? fitText(ctx,fs.title,(fs.warmTitle||fs.title.size*1.15)*sz(st,'title')*k*u,tr(T.title),innerW,true):null;
      const s=tr(T.subtitle)? fitText(ctx,fs.handB,40*f('subtitle')*k*u,tr(T.subtitle),innerW,true):null;
      const tlh=t?t.px*fs.title.lh:0, slh=s?s.px*1.2:0;
      let tw=0, sw=0; if(t){ ctx.font=fontStr(fs.title,t.px); tw=maxLineW(ctx,t.lines); } if(s){ ctx.font=fontStr(fs.handB,s.px); sw=maxLineW(ctx,s.lines); }
      const textH=(t?t.lines.length*tlh:0)+(s?s.lines.length*slh+(t?4*k*u:0):0);
      m={pad,t,s,tlh,slh,textH,k,boxW:Math.min(o.w,Math.max(tw,sw)+2*pad+orn)};
      return textH+2*pad; },
    draw(y){
      const bx=C?ax-m.boxW/2:o.x, h=m.textH+2*m.pad, tx=C?bx+m.boxW/2:bx+m.pad;
      const inner=()=>{ let yy=y+m.pad;
        if (m.t){ fillLines(ctx,fs.title,m.t.px,m.t.lines,tx,yy,m.tlh,o.align,o.label?wc.pAccent:th.accent); yy+=m.t.lines.length*m.tlh+4*m.k*u; }
        if (m.s) fillLines(ctx,fs.handB,m.s.px,m.s.lines,tx,yy,m.slh,o.align,o.label?wc.pInk:ink); };
      if (o.label) rot(ctx,bx+m.boxW/2,y+h/2,-1.5,()=>{ drawPaper(env,bx,y,m.boxW,h,101,wc.paper); inner();
        if (st.ornament){ const O=env.orn, s=Math.min(84*m.k*u,130*m.k*u/O.wf); ctx.save();
          O.draw(ctx,bx+m.boxW-s*O.wf*0.42,y+h-s*0.38,s,{a:wc.pAccent,b:mix(wc.pInk,wc.paper,0.25),bg:wc.paper,c:th.second}); ctx.restore(); } });
      else inner(); } }); }
  if (placeTxt && !o.polaroid){ let m; els.push({gap:8,
    measure(k){ const padX=30*k*u, padY=13*k*u, t=fitText(ctx,fs.handB,34*pf*k*u,placeTxt,o.w-2*padX-30*k*u,true); ctx.font=fontStr(fs.handB,t.px);
      m={...t,padX,padY,lh:t.px*1.2}; m.bw=maxLineW(ctx,t.lines)+2*padX; m.bh=t.lines.length*m.lh+2*padY; return m.bh; },
    draw(y){ const bx=C?ax-m.bw/2:o.x+(o.label?24*u:0); rot(ctx,bx+m.bw/2,y+m.bh/2,-1,()=>{ drawBrush(env,bx,y,m.bw,m.bh,wc.band,202);
      fillLines(ctx,fs.handB,m.px,m.lines,bx+m.bw/2,y+m.padY,m.lh,'center',wc.onBand); }); } }); }
  if (o.polaroid){ let m; els.push({gap:26,
    measure(k){ const pw=Math.min(o.w,620*k*u), f=22*k*u, phw=pw-2*f, phh=phw*0.7;
      const cf=placeTxt? fitText(ctx,fs.handB,32*pf*k*u,placeTxt,phw*0.92,true):null, cap=cf?Math.max(90*k*u,cf.lines.length*cf.px*1.15+16*k*u):f*2.6;
      m={pw,f,phw,phh,cap,cf,k,ph:f+phh+cap}; return m.ph+12*k*u; },
    draw(y){ const bx=ax-m.pw/2;
      rot(ctx,ax,y+m.ph/2,-2,()=>{
        ctx.save(); ctx.shadowColor='rgba(50,35,20,0.3)'; ctx.shadowBlur=24*u; ctx.shadowOffsetY=8*u; ctx.fillStyle='#FFFEFB'; ctx.fillRect(bx,y,m.pw,m.ph); ctx.restore();
        drawPhoto(env,{x:bx+m.f,y:y+m.f,w:m.phw,h:m.phh},'rect');
        if (m.cf){ const lh=m.cf.px*1.15, n=m.cf.lines.length; fillLines(ctx,fs.handB,m.cf.px,m.cf.lines,ax,y+m.f+m.phh+(m.cap-n*lh)/2,lh,'center',mix(wc.pInk,'#000000',0.1)); }
        ctx.fillStyle='rgba(232,219,186,0.85)';
        rot(ctx,bx+m.pw*0.12,y,-14,()=>ctx.fillRect(bx+m.pw*0.12-56*m.k*u,y-17*m.k*u,112*m.k*u,34*m.k*u));
        if (st.ornament){ const O=env.orn, r=66*m.k*u, cx=bx+m.pw-r*0.25, cy=y+m.f+m.phh-r*0.55;
          ctx.save(); ctx.shadowColor='rgba(50,35,20,0.28)'; ctx.shadowBlur=14*u; ctx.shadowOffsetY=4*u; ctx.fillStyle=wc.paper; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill(); ctx.restore();
          ctx.save(); O.draw(ctx,cx,cy,Math.min(r*1.25,r*1.7/O.wf),{a:wc.pAccent,b:mix(wc.pInk,wc.paper,0.25),bg:wc.paper,c:th.second}); ctx.restore(); }
      }); } }); }
  if (tr(T.date)||tr(T.time)){ let m; els.push({gap:30,
    measure(k){ const d=tr(T.date); let wd='',main=d; const ci=d.indexOf(','); if (ci>0&&ci<22){ wd=d.slice(0,ci+1); main=d.slice(ci+1).trim(); }
      const sw=doodle?(C?120:70)*k*u:0;
      const a=wd? fitText(ctx,fs.handB,44*f('date')*k*u,wd,o.w,false):null;
      const b=main? fitText(ctx,fs.num,(fs.warmDate||90)*f('date')*k*u,main,o.w-sw,true):null;
      const c=tr(T.time)? fitText(ctx,fs.strong,42*f('time')*k*u,tr(T.time),o.w,false):null;
      m={a,b,c,k}; let h=0; if(a) h+=a.lines.length*a.px*1.15; if(b) h+=b.lines.length*b.px*1.04+(a?2*k*u:0); if(c) h+=c.lines.length*c.px*1.25+(h?6*k*u:0); return h; },
    draw(y){ let yy=y;
      if (m.a){ fillLines(ctx,fs.handB,m.a.px,m.a.lines,ax,yy,m.a.px*1.15,o.align,ink); yy+=m.a.lines.length*m.a.px*1.15+2*m.k*u; }
      if (m.b){ const lh=m.b.px*1.04; fillLines(ctx,fs.num,m.b.px,m.b.lines,ax,yy,lh,o.align,ink);
        if (doodle){ ctx.font=fontStr(fs.num,m.b.px); const w=measureW(ctx,m.b.lines[0]), cy=yy+lh*0.45, s=m.b.px*0.45;
          if (C){ sparkles(ctx,ax-w/2-m.b.px*0.15,cy,s,th.accent,-1); sparkles(ctx,ax+w/2+m.b.px*0.15,cy,s,th.accent,1); }
          else sparkles(ctx,ax+w+m.b.px*0.15,cy,s,th.accent,1); }
        yy+=m.b.lines.length*lh; }
      if (m.c){ yy+=(m.a||m.b)?6*m.k*u:0; fillLines(ctx,fs.strong,m.c.px,m.c.lines,ax,yy,m.c.px*1.25,o.align,th.accent); } } }); }
  if (tr(T.verse)){ let m; els.push({gap:28,
    measure(k){ m=fitText(ctx,fs.verse,(fs.warmTitle?fs.verse.size:30)*f('verse')*k*u,quote(tr(T.verse)),o.w*0.94,true); m.lh=m.px*1.32;
      m.r=tr(T.ref)? fitText(ctx,fs.body,15*f('ref')*k*u,tr(T.ref).toUpperCase(),o.w*0.85,false):null; m.k=k;
      return m.lines.length*m.lh+(m.r?m.r.px*1.6+6*k*u:0); },
    draw(y){ fillLines(ctx,fs.verse,m.px,m.lines,ax,y,m.lh,o.align,ink);
      if (m.r) fillLines(ctx,fs.body,m.r.px,m.r.lines,ax,y+m.lines.length*m.lh+6*m.k*u,m.r.px*1.6,o.align,th.muted,m.r.px*0.14); } }); }
  if (tr(T.people)){ let m; els.push({gap:22,
    measure(k){ m=fitText(ctx,fs.body,23*f('people')*k*u,tr(T.people),o.w,false); m.lh=m.px*1.42; return m.lines.length*m.lh; },
    draw(y){ fillLines(ctx,fs.body,m.px,m.lines,ax,y,m.lh,o.align,ink); } }); }
  if (tr(T.note)){ let m; els.push({gap:20,
    measure(k){ m=fitText(ctx,fs.handB,30*f('note')*k*u,tr(T.note),o.w,true); m.lh=m.px*1.25; return m.lines.length*m.lh; },
    draw(y){ fillLines(ctx,fs.handB,m.px,m.lines,ax,y,m.lh,o.align,th.accent); } }); }
  return els;
}
/** Hervorgehobener Kasten (boxTitle/boxText) als schräger Papierzettel; draw(y, x) */
export function warmCard(env,wc,cardW){
  const {ctx,u,fs,st}=env, T=st.texts, ts=st.textScale, bt=(T.boxTitle||'').trim(), bx=(T.boxText||'').trim();
  if (!bt && !bx) return null; let m;
  return {gap:30,
    measure(k){ const pad=30*k*u, hs=0; m={pad,k};
      m.t=bt? fitText(ctx,fs.title,(fs.warmCard||44)*ts*sz(st,'boxTitle')*k*u,bt,cardW-2*pad-hs,true):null;
      m.b=bx? fitText(ctx,fs.hand,27*ts*sz(st,'boxText')*k*u,bx,cardW-2*pad,true):null;
      m.tlh=m.t?m.t.px*1.05:0; m.blh=m.b?m.b.px*1.34:0;
      m.h=2*pad+(m.t?m.t.lines.length*m.tlh:0)+(m.b?m.b.lines.length*m.blh+(m.t?8*k*u:0):0); return m.h; },
    draw(y,x){ const cx=x+cardW/2;
      rot(ctx,cx,y+m.h/2,1.5,()=>{ drawPaper(env,x,y,cardW,m.h,303,wc.paper); let yy=y+m.pad;
        if (m.t){ fillLines(ctx,fs.title,m.t.px,m.t.lines,cx,yy,m.tlh,'center',wc.pInk);
          yy+=m.t.lines.length*m.tlh+8*m.k*u; }
        if (m.b) fillLines(ctx,fs.hand,m.b.px,m.b.lines,cx,yy,m.blh,'center',wc.pInk); }); } };
}
/** Schlusszeile auf Pinselband, mit Kirchen-Symbol; draw(y, Mitte x) */
export function warmClosing(env,wc,maxW){
  const {ctx,u,fs,st}=env, t=(st.texts.closing||'').trim(), doodle=canDoodle(env); if (!t) return null; let m;
  return {gap:30,
    measure(k){ const padX=40*k*u, padY=15*k*u, hs=doodle?60*k*u:0; m={padX,padY,hs,k};
      m.f=fitText(ctx,fs.handB,40*st.textScale*sz(st,'closing')*k*u,t,maxW-2*padX-hs,true); ctx.font=fontStr(fs.handB,m.f.px);
      m.lh=m.f.px*1.2; m.bw=maxLineW(ctx,m.f.lines)+2*padX+hs; m.bh=m.f.lines.length*m.lh+2*padY; return m.bh; },
    draw(y,cx){ const bx=cx-m.bw/2;
      rot(ctx,cx,y+m.bh/2,-1,()=>{ drawBrush(env,bx,y,m.bw,m.bh,wc.band2,404);
        fillLines(ctx,fs.handB,m.f.px,m.f.lines,cx+m.hs/2,y+m.padY,m.lh,'center',wc.onBand);
        if (doodle) churchIcon(ctx,bx+m.padX+m.hs*0.3,y+m.bh/2-m.f.px*0.05,m.f.px*1.0,wc.onBand); }); } };
}
/** Stapelt Elemente in Rechteck r; verkleinert bis es passt und verteilt übrigen Platz auf die Abstände.
    mode: 'top' (oben beginnen) oder 'center'. Gibt die Unterkante zurück. */
export function warmStack(env,els,r,mode){
  const {u}=env; if (!els.length) return; let hs,total,gaps;
  for (let k=1;k>=0.25;k-=0.03){ hs=els.map(e=>e.measure(k)); gaps=els.map((e,i)=>i?e.gap*k*u:0); total=hs.reduce((a,b)=>a+b,0)+gaps.reduce((a,b)=>a+b,0); if (total<=r.h) break; }
  const gsum=gaps.reduce((a,b)=>a+b,0), extra=Math.max(0,r.h-total), add=Math.min(extra,gsum*(mode==='top'?0.7:1.5)), f=gsum?add/gsum:0;
  let y=mode==='top'?r.y:r.y+(r.h-total-add)/2;
  els.forEach((e,i)=>{ y+=gaps[i]*(1+f); e.draw(y); y+=hs[i]; });
  return y;
}
/** Fußleiste über die ganze Breite (Papier mit Logo und Gemeindename) */
export function warmFooterH(env){ return ((env.st.texts.parish||'').trim()||env.logo)?66*env.u:0; }
export function drawWarmFooter(env,wc){
  const {ctx,W,H,u,fs,st}=env, h=warmFooterH(env); if (!h) return; const y=H-h;
  ctx.save(); ctx.shadowColor='rgba(40,30,20,0.18)'; ctx.shadowBlur=14*u; ctx.fillStyle=wc.paper; ctx.fillRect(0,y,W,h); ctx.restore();
  let x0=0;
  if (env.logo){ const L=env.logo; let lh=h*0.64, lw=lh*L.naturalWidth/L.naturalHeight; if (lw>220*u){ lw=220*u; lh=lw*L.naturalHeight/L.naturalWidth; } ctx.drawImage(L,40*u,y+(h-lh)/2,lw,lh); x0=lw+56*u; }
  const name=(st.texts.parish||'').trim();
  if (name){ let px=19*u*st.textScale*sz(st,'parish'); ctx.font=fontStr(fs.strong,px); const maxW=W-2*Math.max(x0,44*u);
    while (measureW(ctx,name,px*0.03)>maxW && px>5){ px*=0.94; ctx.font=fontStr(fs.strong,px); }
    ctx.fillStyle=wc.pInk; drawSpaced(ctx,name,W/2,y+h/2+px*0.35,px*0.03,'center'); }
}
/** Warmer Lichtschein von links oben */
export function sunGlow(env){
  const {ctx,W,H}=env; ctx.save(); ctx.globalCompositeOperation='screen';
  const g=ctx.createRadialGradient(W*0.12,H*0.03,0,W*0.12,H*0.03,W*0.95);
  g.addColorStop(0,'rgba(255,236,190,0.55)'); g.addColorStop(0.45,'rgba(255,214,150,0.16)'); g.addColorStop(1,'rgba(255,214,150,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.restore();
}
/** Feine Papierstruktur über die ganze Fläche */
export function paperGrain(env){ const {ctx,W,H,u}=env, r=rng(77); ctx.save(); for(let i=0;i<900;i++){ ctx.fillStyle=i%2?'rgba(120,90,50,0.05)':'rgba(255,255,255,0.22)'; const s=(1+r()*2.2)*u; ctx.fillRect(r()*W,r()*H,s,s); } ctx.restore(); }
