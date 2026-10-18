/* Layout „Kontur“ – ein riesiger Titel in Umrissbuchstaben über die ganze Breite, darunter der Tag als große
   Umrissziffern mit Monat daneben, unten auf einer kräftigen Linie zwei Spalten mit den Angaben in kleiner Schrift.
   Passermarken in den Ecken. Wirkt laut und braucht fast keine Tinte. */
import { sz, quote, fontStr, wrapLines, maxLineW, measureW, drawSpaced, dateParts, textEl, footerH, drawFooter, drawFrame, arranged } from '../render/toolkit.js';

/** Schriften, deren Striche für Umrisse zu dünn sind: dort steht der Titel voll */
const THIN=['Jost','Cormorant Garamond'];
const SP=0.025;  // Sperrung der Umrissschrift (Anteil der Schriftgröße), damit sich die Umrisse nicht berühren

/** Zeilen als Umriss (oder voll) zeichnen; y = Oberkante, lh = Zeilenhöhe in Pixeln.
    lwMax begrenzt die Strichstärke bei sehr großer Schrift. Umriss: doppelt so breit zeichnen und innen mit dem Grund füllen – so verschwinden überlappende Konturen variabler Schriften. */
function outlineLines(ctx,f,px,lines,x,y,lh,color,bg,solid,lwMax){
  ctx.font=fontStr(f,px); ctx.textAlign='left'; ctx.lineJoin='round'; ctx.strokeStyle=color; ctx.lineWidth=Math.max(2,Math.min(px*0.046,lwMax));
  const sp=solid?0:px*SP, each=(l,by,fn)=>{ let cx=x; for (const ch of l){ fn(ch,cx,by); cx+=ctx.measureText(ch).width+sp; } };
  lines.forEach((l,i)=>{ const by=y+i*lh+lh/2+px*0.33;
    if (solid){ ctx.fillStyle=color; ctx.fillText(l,x,by); return; }
    each(l,by,(c,cx,cy)=>ctx.strokeText(c,cx,cy)); ctx.fillStyle=bg; each(l,by,(c,cx,cy)=>ctx.fillText(c,cx,cy)); });
}
/** Größte Schrift ≤ px0, mit der text in w × h passt (Wörter nicht getrennt) → {px, lines, w} */
function fitBox(ctx,f,px0,text,w,h,lh,solid){
  let px=px0, lines, lw; for (let i=0;i<70;i++){ ctx.font=fontStr(f,px); const sp=solid?0:px*SP; lines=wrapLines(ctx,text,w,sp); lw=Math.max(...lines.map(l=>measureW(ctx,l,sp))); if (lw<=w && lines.length*px*lh<=h) break; px*=0.95; }
  return {px,lines,w:lw};
}
/** Feine Linie über die Breite w als Stapel-Element */
const ruleEl=(env,x,w,gap)=>({gap,rule:true,width:()=>w,measure:()=>Math.max(1,env.u),draw(y){ const {ctx,u,th}=env; ctx.fillStyle=th.line; ctx.fillRect(x,y,w,Math.max(1,u)); }});
/** Höhe eines Stapels bei Faktor k und Zeichnen ab y */
const stackH=(env,es,k)=>es.reduce((s,e,i)=>s+e.measure(k)+(i?e.gap*k*env.u:0),0);
function stackDraw(env,es,k,y){ es.forEach((e,i)=>{ if (i) y+=e.gap*k*env.u; const h=e.measure(k); e.draw(y); y+=h; }); }

export default {
  id: 'kontur',
  name: 'Kontur',
  group: 'schwarzweiss',
  about: 'Riesiger Titel in Umrissbuchstaben, der Tag als große Umrissziffern, feine Linien – laut, aber fast ohne Tinte',
  photo: false,
  parts: ['title','date','text'],
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, bs=fs.bs, f=k=>ts*sz(st,k), tr=s=>(s||'').trim(), has=k=>!!tr(T[k]);
    const m=72*u, cw=W-2*m, o=env.orn, moved=st.arrange?.[st.layout]||{}, tf=fs.title, solid=THIN.includes(tf.f);

    /* Passermarken in den Ecken */
    ctx.strokeStyle=th.line; ctx.lineWidth=Math.max(1,0.9*u);
    for (const [x,y] of [[36*u,36*u],[W-36*u,36*u],[36*u,H-36*u],[W-36*u,H-36*u]]){ ctx.beginPath(); ctx.arc(x,y,8*u,0,Math.PI*2); ctx.moveTo(x-15*u,y); ctx.lineTo(x+15*u,y); ctx.moveTo(x,y-15*u); ctx.lineTo(x,y+15*u); ctx.stroke(); }
    if (st.frame) drawFrame(env,28*u,th.line);

    /* Kopfzeile: kleines Zierelement und Einladung in gesperrten Versalien */
    let y=80*u;
    if (st.ornament||has('eyebrow')){ const s=58*u, ow=st.ornament? s*o.wf+22*u : 0;
      if (st.ornament){ ctx.save(); o.draw(ctx,m+s*o.wf/2,y+s/2,s,{a:th.accent,b:th.ink,bg:th.bg,c:th.second}); ctx.restore(); }
      if (has('eyebrow')){ const e=tr(T.eyebrow).toUpperCase(); let px=20*bs*f('eyebrow')*u; ctx.font=fontStr(fs.strong,px);
        while (maxLineW(ctx,[e],px*0.2)>cw-ow && px>6*u){ px*=0.94; ctx.font=fontStr(fs.strong,px); }
        ctx.fillStyle=th.ink; drawSpaced(ctx,e,m+ow,y+s/2+px*0.36,px*0.2,'left'); }
      y+=s+30*u; }

    const dp=dateParts(T.date), fh=footerH(env), bottom=H-62*u, low=bottom-fh-(fh?34*u:0);
    const rest=['subtitle','verse','ref','date','time','place','address','people','boxTitle','boxText','note','closing'].some(has);

    /* unten zwei Spalten auf einer kräftigen Linie: links Termin und Ort, rechts alles Weitere (Elemente für Breite x…x+w) */
    const twoCol=[...(!dp?['date']:[]),'time','place','address'].some(has)&&['subtitle','verse','ref','people','boxTitle','boxText','note','closing'].some(has);
    function columns(x0,w0){
      const L=[], Rt=[], lw=twoCol? w0*0.36 : w0, rx=twoCol? x0+lw+44*u : x0, rw=x0+w0-rx, R0=twoCol?Rt:L;
      const add=(list,x,w)=>(k,font,size,lh,color,gap,more={})=>{ if (has(k)) list.push(textEl(env,{text:tr(T[k]),font,size,lh,color,x,w,balance:false,gap:list.length?gap:0,...more})); };
      const lt=add(L,x0,lw), rt=add(R0,rx,rw), rule=()=>{ if (R0.length) R0.push(ruleEl(env,rx,rw,20)); };
      if (!dp) lt('date',fs.strong,30*bs*f('date'),1.2,th.ink,0);
      lt('time',fs.strong,30*bs*f('time'),1.2,th.accent,4);
      lt('place',fs.strong,23*bs*f('place'),1.25,th.ink,14);
      lt('address',fs.body,20*bs*f('address'),1.3,th.muted,2);
      rule();
      rt('subtitle',fs.strong,28*bs*f('subtitle'),1.25,th.ink,0);
      if (has('verse')) R0.push(textEl(env,{text:quote(tr(T.verse)),font:fs.verse,size:fs.verse.size*0.88*ts*sz(st,'verse'),lh:fs.verse.lh,color:th.ink,x:rx,w:rw,balance:false,gap:R0.length&&!R0[R0.length-1].rule?16:20}));
      rt('ref',fs.body,14*bs*f('ref'),1.3,th.muted,8,{upper:true,sp:0.16});
      if (has('people')){ rule(); rt('people',fs.body,20*bs*f('people'),1.45,th.ink,20); }
      if (has('boxTitle')||has('boxText')){ rule(); rt('boxTitle',fs.strong,23*bs*f('boxTitle'),1.3,th.ink,20); rt('boxText',fs.body,20*bs*f('boxText'),1.42,th.muted,has('boxTitle')?4:20); }
      rt('note',fs.italic,21*bs*fs.italicBoost*f('note'),1.35,th.accent,18);
      rt('closing',fs.italic,24*bs*fs.italicBoost*f('closing'),1.3,th.ink,20);
      while (R0.length && R0[R0.length-1].rule) R0.pop();
      return [L,Rt];
    }
    const R=30*u, dMin=dp&&!moved.date? 170*u : 0, colH=(cs,k)=>Math.max(...cs.map(c=>stackH(env,c,k)));

    /* Titel in Umrissen: so groß, wie die Breite erlaubt – höchstens knapp die halbe Höhe und so, dass die Spalten in voller Größe Platz haben */
    const title=tr(T.title).toUpperCase(), tlh=1, tpx=330*u*sz(st,'title');
    const tMax=rest? Math.max(200*u,Math.min((low-y)*0.46,low-y-44*u-colH(columns(m,cw),1)-R-dMin-(dMin?40*u:0))) : low-y;
    const tFit=title? fitBox(ctx,tf,tpx,title,cw,tMax,tlh,solid) : {px:0,lines:[]}, tH=tFit.lines.length*tFit.px*tlh;
    if (title){ const ty=rest? y : y+(low-y-tH)/2, p=arranged(env,'title',{x:m,y:ty,w:cw,h:Math.max(tH,40*u)}), q=moved.title? fitBox(ctx,tf,tpx*p.k,title,p.w,p.h,tlh,solid) : tFit;
      outlineLines(ctx,tf,q.px,q.lines,p.x,p.y,q.px*tlh,th.ink,th.bg,solid,11*u); }
    if (!rest){ drawFooter(env,m,cw,bottom,'left',th.muted); return; }
    const gy=y+(title?tH+44*u:0), t=arranged(env,'text',{x:m,y:gy,w:cw,h:low-gy}), [L,Rt]=columns(t.x,t.w);

    // gemeinsame Größe für beide Spalten; über ihnen bleibt Platz für die Datumsziffern
    let k=t.k*(dp||moved.text?1:1.2), hc;   // ohne Datumsziffern dürfen die Spalten etwas größer werden
    for (;k>=0.25;k-=0.03){ hc=colH([L,Rt],k); if (hc+R<=t.h-dMin-(dMin?40*u:0)) break; }
    const defTop=low-hc-R; if (!moved.text){ t.y=Math.max(t.y,defTop); t.h=low-t.y; }
    ctx.fillStyle=th.ink; ctx.fillRect(t.x,t.y,t.w,Math.max(1,3*u));
    stackDraw(env,L,k,t.y+R); stackDraw(env,Rt,k,t.y+R);

    /* der Tag als große Umrissziffern, daneben Monat, Wochentag und Jahr – füllt den Raum zwischen Titel und Linie */
    if (dp){ const fd=sz(st,'date'), d=arranged(env,'date',{x:m,y:gy,w:cw,h:Math.max(120*u,Math.max(gy,defTop)-40*u-gy)});
      const q=fitBox(ctx,tf,Math.min(d.h/0.78,560*u*fd*d.k),dp.day+'.',d.w*0.62,d.h/0.78,0.84,solid), dh=q.px*0.78;
      const lx=d.x+q.w+34*u, lab=[textEl(env,{text:dp.month,upper:true,font:fs.strong,size:Math.min(46,q.px/u*0.2)*bs*f('date'),lh:1.1,color:th.ink,x:lx,w:d.x+d.w-lx,sp:0.06,balance:false})];
      if (dp.wd||dp.year) lab.push(textEl(env,{text:[dp.wd,dp.year].filter(Boolean).join(' · '),font:fs.body,size:Math.min(28,q.px/u*0.12)*bs*f('date'),lh:1.3,color:th.muted,x:lx,w:d.x+d.w-lx,balance:false,gap:6}));
      const y0=d.y+(moved.date?0:(d.h-dh)/2), lh=stackH(env,lab,1);
      outlineLines(ctx,tf,q.px,q.lines,d.x-q.px*0.02,y0-q.px*0.03,q.px*0.84,th.accent,th.bg,solid,11*u);
      stackDraw(env,lab,1,y0+dh-lh); }

    drawFooter(env,m,cw,bottom,'left',th.muted);
  }
};
