/* Layout „Holzschnitt“ – wie ein alter Andachtsholzschnitt: geschnitzter Rahmen aus kräftiger und feiner Linie mit
   Zickzack dazwischen, das Zierelement im Strahlenkranz, Einladung und Schluss auf Spruchbändern, Rauten als Trenner.
   Alles Strichwerk, kaum Flächen – druckt sparsam, auch in Schwarz-Weiß. */
import { rng, sz, quote, fontStr, maxLineW, fillLines, fitText, textEl, warmStack, footerH, drawFooter, arranged } from '../render/toolkit.js';

/** Rahmen: außen kräftig, innen fein, dazwischen ein leicht unregelmäßiges Zickzack und Rauten in den Ecken */
function carvedFrame(env,o,i){
  const {ctx,W,H,u,th}=env, R=rng(7), lw=Math.max(1,1.5*u);
  ctx.strokeStyle=th.ink; ctx.fillStyle=th.ink; ctx.lineJoin='miter';
  ctx.lineWidth=5*u; ctx.strokeRect(o,o,W-2*o,H-2*o); ctx.lineWidth=lw; ctx.strokeRect(i,i,W-2*i,H-2*i);
  const a=o+2.5*u, b=i, d=b-a;
  // Eckfelder: Linien zum Innenrahmen, darin eine Raute mit Punkt
  ctx.beginPath(); for (const [x,y] of [[a,a],[W-b,a],[a,H-b],[W-b,H-b]]){ ctx.rect(x,y,d,d); } ctx.stroke();
  for (const [x,y] of [[a,a],[W-b,a],[a,H-b],[W-b,H-b]]){ const cx=x+d/2, cy=y+d/2, s=d*0.36;
    ctx.beginPath(); ctx.moveTo(cx,cy-s); ctx.lineTo(cx+s,cy); ctx.lineTo(cx,cy+s); ctx.lineTo(cx-s,cy); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,d*0.07,0,Math.PI*2); ctx.fill(); }
  // Zickzack zwischen den Eckfeldern
  const zig=(x0,y0,x1,y1)=>{ const len=Math.hypot(x1-x0,y1-y0), n=Math.max(2,Math.round(len/(17*u))), dx=(x1-x0)/n, dy=(y1-y0)/n, nx=-dy/Math.hypot(dx,dy), ny=dx/Math.hypot(dx,dy);
    ctx.beginPath(); for (let k=0;k<=n;k++){ const s=(k%2? 0.32:-0.32)*d+(R()-0.5)*1.6*u; ctx.lineTo(x0+dx*k+nx*s,y0+dy*k+ny*s); } ctx.stroke(); };
  ctx.lineWidth=lw; const c=a+d/2;
  zig(b,c,W-b,c); zig(b,H-c,W-b,H-c); zig(c,b,c,H-b); zig(W-c,b,W-c,H-b);
}
/** Strahlenkranz um (cx,cy): lange Keile im Wechsel mit kurzen gewellten Strahlen, innen Doppelkreis mit Perlen */
function rays(env,cx,cy,r0,r1){
  const {ctx,u,th}=env, R=rng(11), n=44;
  ctx.fillStyle=th.ink; ctx.strokeStyle=th.ink; ctx.lineCap='round';
  for (let j=0;j<n;j++){ const a=j/n*Math.PI*2-Math.PI/2, c=Math.cos(a), s=Math.sin(a);
    if (j%2===0){ const re=r1*(0.96+R()*0.06), da=Math.PI/n*0.3;
      ctx.beginPath(); ctx.moveTo(cx+Math.cos(a-da)*r0,cy+Math.sin(a-da)*r0); ctx.lineTo(cx+c*re,cy+s*re); ctx.lineTo(cx+Math.cos(a+da)*r0,cy+Math.sin(a+da)*r0); ctx.closePath(); ctx.fill(); }
    else { const re=r0+(r1-r0)*(0.58+R()*0.08), amp=3.2*u; ctx.lineWidth=Math.max(1,1.3*u); ctx.beginPath();
      for (let t=0;t<=1.0001;t+=0.05){ const r=r0+6*u+(re-r0-6*u)*t, w=Math.sin(t*Math.PI*3)*amp*(1-t*0.5); ctx.lineTo(cx+c*r-s*w,cy+s*r+c*w); } ctx.stroke(); } }
  ctx.lineWidth=Math.max(1,2*u); ctx.beginPath(); ctx.arc(cx,cy,r0,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=Math.max(1,1*u); ctx.beginPath(); ctx.arc(cx,cy,r0-15*u,0,Math.PI*2); ctx.stroke();
  for (let j=0;j<40;j++){ const a=j/40*Math.PI*2; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*(r0-7.5*u),cy+Math.sin(a)*(r0-7.5*u),1.5*u,0,Math.PI*2); ctx.fill(); }
}
/** Spruchband: Band mit Text, dahinter tiefer liegende Enden mit Kerbe und dunkler Falte */
function ribbonEl(env,o){
  const {ctx,u,th}=env; let m;
  return {gap:o.gap||0, width:()=>m.bw+2*m.t,
    measure(k){ const t=fitText(ctx,o.font,o.size*k*u,o.text,o.w*0.62,true); m={...t,lh:t.px*1.18}; ctx.font=fontStr(o.font,m.px);
      m.pad=m.px*0.36; m.bh=m.lines.length*m.lh+2*m.pad; m.bw=maxLineW(ctx,m.lines)+m.px*1.6; m.t=Math.min(m.bh*1.1,70*k*u); m.d=m.bh*0.32; return m.bh+m.d; },
    draw(y){ const cx=o.x+o.w/2, x0=cx-m.bw/2, x1=cx+m.bw/2, h=m.bh, d=m.d, t=m.t, nv=h*0.32;
      ctx.save(); ctx.lineWidth=Math.max(1,1.8*u); ctx.strokeStyle=th.ink; ctx.fillStyle=th.bg; ctx.lineJoin='round';
      for (const s of [-1,1]){ const xe=s<0?x0:x1, xo=xe+s*t;
        ctx.beginPath(); ctx.moveTo(xe,y+d); ctx.lineTo(xo,y+d); ctx.lineTo(xo-s*nv,y+d+h/2); ctx.lineTo(xo,y+d+h); ctx.lineTo(xe,y+d+h); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Schraffur im Schatten neben dem Band, wie mit dem Messer gestochen
        ctx.beginPath(); for (let q=0;q<3;q++){ const xx=xe+s*(5+q*5)*u; ctx.moveTo(xx,y+h+3*u); ctx.lineTo(xx,y+d+h-4*u-q*0.12*h); } ctx.stroke();
        ctx.fillStyle=th.ink; ctx.beginPath(); ctx.moveTo(xe,y+h); ctx.lineTo(xe-s*d,y+h); ctx.lineTo(xe,y+h+d); ctx.closePath(); ctx.fill(); ctx.fillStyle=th.bg; }
      ctx.beginPath(); ctx.rect(x0,y,m.bw,h); ctx.fill(); ctx.stroke();
      ctx.lineWidth=Math.max(1,0.8*u); ctx.beginPath(); ctx.moveTo(x0+4*u,y+4*u); ctx.lineTo(x1-4*u,y+4*u); ctx.moveTo(x0+4*u,y+h-4*u); ctx.lineTo(x1-4*u,y+h-4*u); ctx.stroke();
      ctx.restore(); fillLines(ctx,o.font,m.px,m.lines,cx,y+m.pad,m.lh,'center',o.color); } };
}
/** Trenner: zwei Linien, in der Mitte eine Raute, außen Punkte */
function lozengeEl(env,x,w,gap){
  const {ctx,u,th}=env; let k1;
  return {gap, width:()=>w*0.4, measure(k){ k1=k; return 20*k*u; },
    draw(y){ const cx=x+w/2, cy=y+10*k1*u, L=Math.min(170*u,w*0.3), s=7.5*k1*u;
      ctx.strokeStyle=th.ink; ctx.fillStyle=th.accent; ctx.lineWidth=Math.max(1,1.4*u);
      ctx.beginPath(); ctx.moveTo(cx-L,cy); ctx.lineTo(cx-s*2.4,cy); ctx.moveTo(cx+s*2.4,cy); ctx.lineTo(cx+L,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy-s); ctx.lineTo(cx+s*1.5,cy); ctx.lineTo(cx,cy+s); ctx.lineTo(cx-s*1.5,cy); ctx.closePath(); ctx.fill();
      ctx.fillStyle=th.ink; for (const e of [-1,1]){ ctx.beginPath(); ctx.arc(cx+e*(L+7*u),cy,2.2*u,0,Math.PI*2); ctx.fill(); } } };
}

export default {
  id: 'holzschnitt',
  name: 'Holzschnitt',
  group: 'schwarzweiss',
  about: 'Wie ein alter Holzschnitt: geschnitzter Rahmen, Zierelement im Strahlenkranz, Spruchbänder – nur Strichwerk, sparsam im Druck',
  photo: false,
  parts: ['ornament','text'],
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, bs=fs.bs, f=k=>ts*sz(st,k), tr=s=>(s||'').trim(), o=env.orn;
    const fo=34*u, fi=60*u; carvedFrame(env,fo,fi);
    if (st.frame){ ctx.strokeStyle=th.ink; ctx.lineWidth=Math.max(1,1.2*u); ctx.strokeRect(18*u,18*u,W-36*u,H-36*u); }

    /* Zierelement im Strahlenkranz */
    let top=fi+60*u;
    if (st.ornament){
      const r1=150*u, p=arranged(env,'ornament',{x:W/2-r1,y:fi+36*u,w:2*r1,h:2*r1}), R1=Math.min(p.w,p.h)/2, r0=R1*0.57, cx=p.x+p.w/2, cy=p.y+p.h/2;
      rays(env,cx,cy,r0,R1);
      const s=(r0-18*u)*1.95/Math.hypot(o.wf,1); ctx.save(); o.draw(ctx,cx,cy,s,{a:th.accent,b:th.ink,bg:th.bg,c:th.second}); ctx.restore();
      top=fi+36*u+2*r1+22*u;
    }

    /* Text: Spruchband, Titel, Vers – Raute – Termin, Mitwirkende, Kasten, Hinweis, Spruchband */
    const fh=footerH(env), bottom=H-fi-34*u, t=arranged(env,'text',{x:fi+50*u,y:top,w:W-2*fi-100*u,h:bottom-fh-(fh?34*u:0)-top}), x=t.x, w=t.w, els=[];
    const tx=(k,font,size,lh,color,gap,more={})=>{ if (tr(T[k])) els.push(textEl(env,{text:tr(T[k]),font,size,lh,color,x,w,align:'center',gap,...more})); };
    if (tr(T.eyebrow)) els.push(ribbonEl(env,{text:tr(T.eyebrow),font:fs.title,size:30*bs*f('eyebrow'),x,w,color:th.ink}));
    if (tr(T.title)){ const ts0=fs.title.size*1.22*sz(st,'title'), e=textEl(env,{text:tr(T.title),font:fs.title,size:ts0,lh:fs.title.lh,sp:fs.title.sp||0,color:th.ink,x,w,align:'center'});
      // lange Titel werden allein kleiner, bis sie höchstens etwa drei Zeilen brauchen – sonst bliebe für den Rest nur Kleingedrucktes
      els.push({gap:els.length?26:0,width:()=>e.width(),measure(k){ let q=k, h=e.measure(q); while (h>3.3*ts0*q*u*fs.title.lh && q>0.45*k){ q*=0.93; h=e.measure(q); } return h; },draw:y=>e.draw(y)}); }
    tx('subtitle',fs.body,26*bs*f('subtitle'),1.35,th.muted,14);
    if (tr(T.verse)) els.push(textEl(env,{text:quote(tr(T.verse)),font:fs.verse,size:fs.verse.size*ts*sz(st,'verse'),lh:fs.verse.lh,color:th.ink,x:x+w*0.06,w:w*0.88,align:'center',gap:30}));
    tx('ref',fs.body,15*bs*f('ref'),1.3,th.muted,10,{upper:true,sp:0.16,balance:false});
    const head=els.length;
    tx('date',fs.strong,34*bs*f('date'),1.2,th.ink,0);
    tx('time',fs.body,30*bs*f('time'),1.2,th.accent,4);
    tx('place',fs.body,24*bs*f('place'),1.3,th.ink,16);
    tx('address',fs.body,20*bs*f('address'),1.3,th.muted,2);
    tx('people',fs.body,21*bs*f('people'),1.45,th.muted,20);
    tx('boxTitle',fs.strong,25*bs*f('boxTitle'),1.3,th.ink,24);
    tx('boxText',fs.body,21*bs*f('boxText'),1.45,th.muted,tr(T.boxTitle)?4:24);
    tx('note',fs.italic,22*bs*fs.italicBoost*f('note'),1.35,th.accent,18);
    if (els.length>head){ if (head) els.splice(head,0,lozengeEl(env,x,w,32)); els[head+(head?1:0)].gap=head?28:0; }
    if (tr(T.closing)) els.push(ribbonEl(env,{text:tr(T.closing),font:fs.title,size:26*bs*f('closing'),x,w,color:th.ink,gap:els.length?34:0}));
    warmStack(env,els,t,'center');

    drawFooter(env,fi+50*u,W-2*fi-100*u,bottom,'center',th.muted);
  }
};
