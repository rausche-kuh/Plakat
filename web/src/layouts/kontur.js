/* Layout „Kontur“ – ein riesiger Titel in Umrissbuchstaben über die ganze Breite, darunter ein Raster aus feinen Linien:
   links das Datum als große Umrissziffern, rechts die übrigen Angaben in kleiner, kräftiger Schrift.
   Passermarken in den Ecken. Wirkt laut und braucht fast keine Tinte. */
import { sz, quote, fontStr, wrapLines, maxLineW, drawSpaced, dateParts, textEl, footerH, drawFooter, drawFrame, arranged } from '../render/toolkit.js';

/** Schriften, deren Striche für Umrisse zu dünn sind: dort steht der Titel voll */
const THIN=['Jost','Cormorant Garamond'];

/** Zeilen als Umriss (oder voll) zeichnen; y = Oberkante, lh = Zeilenhöhe in Pixeln.
   Umriss: doppelt so breit zeichnen und innen mit dem Grund füllen – so verschwinden überlappende Konturen variabler Schriften. */
function outlineLines(ctx,f,px,lines,x,y,lh,color,bg,solid){
  ctx.font=fontStr(f,px); ctx.textAlign='left'; ctx.lineJoin='round'; ctx.strokeStyle=color; ctx.lineWidth=Math.max(2,px*0.048);
  lines.forEach((l,i)=>{ const by=y+i*lh+lh/2+px*0.33; if (!solid) ctx.strokeText(l,x,by); ctx.fillStyle=solid?color:bg; ctx.fillText(l,x,by); });
}
/** Größte Schrift ≤ px0, mit der text in w × h passt (Wörter nicht getrennt) → {px, lines} */
function fitBox(ctx,f,px0,text,w,h,lh){
  let px=px0, lines; for (let i=0;i<60;i++){ ctx.font=fontStr(f,px); lines=wrapLines(ctx,text,w,0); if (maxLineW(ctx,lines)<=w && lines.length*px*lh<=h) break; px*=0.95; }
  return {px,lines};
}
/** Feine Linie über die Breite w als Stapel-Element */
const ruleEl=(env,x,w,gap,lw=1)=>({gap,width:()=>w,measure:()=>Math.max(1,lw*env.u),draw(y){ const {ctx,u,th}=env; ctx.fillStyle=th.ink; ctx.fillRect(x,y,w,Math.max(1,lw*u)); }});

export default {
  id: 'kontur',
  name: 'Kontur',
  group: 'schwarzweiss',
  about: 'Riesiger Titel in Umrissbuchstaben, Datum als Umrissziffern, feine Linien – laut, aber fast ohne Tinte',
  photo: false,
  parts: ['title','text'],
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, bs=fs.bs, f=k=>ts*sz(st,k), tr=s=>(s||'').trim(), m=72*u, cw=W-2*m, o=env.orn;

    /* Passermarken in den Ecken */
    ctx.strokeStyle=th.line; ctx.lineWidth=Math.max(1,0.9*u);
    for (const [x,y] of [[36*u,36*u],[W-36*u,36*u],[36*u,H-36*u],[W-36*u,H-36*u]]){ ctx.beginPath(); ctx.arc(x,y,8*u,0,Math.PI*2); ctx.moveTo(x-15*u,y); ctx.lineTo(x+15*u,y); ctx.moveTo(x,y-15*u); ctx.lineTo(x,y+15*u); ctx.stroke(); }
    if (st.frame) drawFrame(env,28*u,th.line);

    /* Kopfzeile: kleines Zierelement und Einladung in gesperrten Versalien */
    let y=80*u;
    if (st.ornament||tr(T.eyebrow)){ const s=58*u, ow=st.ornament? s*o.wf+22*u : 0;
      if (st.ornament){ ctx.save(); o.draw(ctx,m+s*o.wf/2,y+s/2,s,{a:th.accent,b:th.ink,bg:th.bg,c:th.second}); ctx.restore(); }
      if (tr(T.eyebrow)){ const e=tr(T.eyebrow).toUpperCase(); let px=20*bs*f('eyebrow')*u; ctx.font=fontStr(fs.strong,px);
        while (maxLineW(ctx,[e],px*0.2)>cw-ow && px>6*u){ px*=0.94; ctx.font=fontStr(fs.strong,px); }
        ctx.fillStyle=th.ink; drawSpaced(ctx,e,m+ow,y+s/2+px*0.36,px*0.2,'left'); }
      y+=s+30*u; }

    /* unten: Datum und Angaben */
    const dp=dateParts(T.date), fh=footerH(env), bottom=H-62*u, low=bottom-fh-(fh?34*u:0);
    const lw=dp?300*u:0, gut=dp?44*u:0, has=k=>!!tr(T[k]), rest=['subtitle','verse','ref','time','place','address','people','boxTitle','boxText','note','closing'].some(has)||has('date');

    /* Titel in Umrissen: so groß, wie Breite und etwa die halbe Höhe erlauben */
    const tf=fs.title, solid=THIN.includes(tf.f), title=tr(T.title).toUpperCase(), tlh=0.9, moved=st.arrange?.[st.layout]||{};
    const hmax=rest? Math.max(260*u,(low-y)*0.5) : low-y, tFit=title? fitBox(ctx,tf,330*u*sz(st,'title'),title,cw,hmax,tlh) : {px:0,lines:[]};
    const tH=tFit.lines.length*tFit.px*tlh;
    if (title){ const p=arranged(env,'title',{x:m,y,w:cw,h:Math.max(tH,40*u)}), q=moved.title? fitBox(ctx,tf,330*u*sz(st,'title')*p.k,title,p.w,p.h,tlh) : tFit;
      outlineLines(ctx,tf,q.px,q.lines,p.x,p.y,q.px*tlh,th.ink,th.bg,solid); }
    if (!rest){ drawFooter(env,m,cw,bottom,'left',th.muted); return; }

    /* unten: Linie, links das Datum, rechts die Angaben – sitzt unten auf, der Weißraum bleibt unter dem Titel */
    const gy=y+(title?tH+40*u:0), t=arranged(env,'text',{x:m,y:gy,w:cw,h:low-gy}), bw=dp?Math.min(lw,t.w*0.36):0, x=t.x+(dp?bw+gut:0), w=t.x+t.w-x, R=30*u;

    /* links: Tag als Umrissziffern, darunter Monat, Wochentag und Jahr */
    const left=[];
    if (dp){ const fd=sz(st,'date'); let q;
      left.push({gap:0,width:()=>bw,measure(k){ q=fitBox(ctx,tf,240*u*fd*k,dp.day+'.',bw,1e9,0.9); return q.px*0.84; },
        draw(y){ outlineLines(ctx,tf,q.px,q.lines,t.x-q.px*0.03,y-q.px*0.07,q.px*0.9,th.accent,th.bg,solid); }});
      left.push(textEl(env,{text:dp.month,upper:true,font:fs.strong,size:30*bs*f('date'),lh:1.15,color:th.ink,x:t.x,w:bw,sp:0.06,balance:false,gap:14}));
      if (dp.wd||dp.year) left.push(textEl(env,{text:[dp.wd,dp.year].filter(Boolean).join(' · '),font:fs.body,size:21*bs*f('date'),lh:1.3,color:th.muted,x:t.x,w:bw,balance:false,gap:4})); }

    /* rechts: alles Weitere in einer Spalte mit feinen Linien zwischen den Gruppen */
    const els=[], tx=(k,font,size,lh,color,gap,more={})=>{ if (has(k)) els.push(textEl(env,{text:tr(T[k]),font,size,lh,color,x,w,balance:false,gap,...more})); };
    const group=()=>{ if (els.length) els.push(ruleEl(env,x,w,22)); return els.length?22:0; };
    tx('subtitle',fs.strong,28*bs*f('subtitle'),1.25,th.ink,0);
    if (has('verse')) els.push(textEl(env,{text:quote(tr(T.verse)),font:fs.verse,size:fs.verse.size*0.88*ts*sz(st,'verse'),lh:fs.verse.lh,color:th.ink,x,w,balance:false,gap:els.length?18:0}));
    tx('ref',fs.body,14*bs*f('ref'),1.3,th.muted,8,{upper:true,sp:0.16});
    if ((!dp&&has('date'))||has('time')||has('place')||has('address')){ let g=group();
      if (!dp&&has('date')){ tx('date',fs.strong,30*bs*f('date'),1.2,th.ink,g); g=4; }
      if (has('time')){ tx('time',fs.strong,30*bs*f('time'),1.2,th.accent,g); g=12; }
      tx('place',fs.strong,23*bs*f('place'),1.25,th.ink,g); tx('address',fs.body,20*bs*f('address'),1.3,th.muted,has('place')?2:g); }
    if (has('people')){ const g=group(); tx('people',fs.body,20*bs*f('people'),1.45,th.ink,g); }
    if (has('boxTitle')||has('boxText')){ const g=group(); tx('boxTitle',fs.strong,23*bs*f('boxTitle'),1.3,th.ink,g); tx('boxText',fs.body,20*bs*f('boxText'),1.42,th.muted,has('boxTitle')?4:g); }
    tx('note',fs.italic,21*bs*fs.italicBoost*f('note'),1.35,th.accent,18);
    tx('closing',fs.italic,24*bs*fs.italicBoost*f('closing'),1.3,th.ink,22);

    // gemeinsame Größe für beide Spalten; ist Platz übrig, dürfen sie etwas größer werden
    const sh=(es,k)=>es.reduce((s,e,i)=>s+e.measure(k)+(i?e.gap*k*u:0),0); let k=t.k*1.15, hc;
    for (;k>=0.25;k-=0.03){ hc=Math.max(sh(left,k),sh(els,k)); if (hc<=t.h-R) break; }
    if (!moved.text){ t.y=Math.max(t.y,low-hc-R); t.h=low-t.y; }
    ctx.fillStyle=th.ink; ctx.fillRect(t.x,t.y,t.w,Math.max(1,3*u));
    for (const es of [left,els]){ let yy=t.y+R; const hs=es.map(e=>e.measure(k)); es.forEach((e,i)=>{ if (i) yy+=e.gap*k*u; e.draw(yy); yy+=hs[i]; }); }

    drawFooter(env,m,cw,bottom,'left',th.muted);
  }
};
