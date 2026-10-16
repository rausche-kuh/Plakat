/* Layout „Abriss“ – Foto oben, darunter ein Bogen Papier mit gerissener Kante. Das Datum klebt als
   runder Stempel auf der Kante, die Einladung steht auf einem Pinselstrich über dem Foto.
   Termin und Ort mit kleinen Symbolen. Die Fotohöhe richtet sich nach der Textmenge. Herzlich-Baukasten. */
import { mix, rgba, drawPhoto, sunGlow, drawBrush, warmCols, warmClosing, warmStack, warmFooterH, drawWarmFooter, paperGrain, canDoodle, sparkles, rot,
  tornPath, dateParts, listItems, quote, dateBadge, inkOn, textEl, infoEl, listEl, stackH, fitText, fillLines, fontStr, maxLineW } from '../render/toolkit.js';

export default {
  id: 'abriss',
  name: 'Abriss',
  group: 'herzlich',
  about: 'Foto oben, Papier mit gerissener Kante darunter, Datum als runder Stempel, Termin mit Symbolen',
  photo: true,
  warm: true,
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, tr=s=>(s||'').trim(), wc=warmCols(env), dark=st.variant==='dunkel';
    env.warmGrade=st.sunlight;
    const paper=dark? th.bg : mix(th.bg,'#ffffff',0.45), ink=th.ink, fh=warmFooterH(env), x=70*u, w=W-140*u;
    const dp=dateParts(T.date), badge=!!dp, R=122*u, headW=badge? w-R*2-30*u : w;

    /* Inhalt auf dem Papier */
    const els=[], head=[];
    if (tr(T.title)) head.push(textEl(env,{text:tr(T.title),font:fs.title,size:(fs.warmTitle||fs.title.size*1.15)*st.titleScale,lh:fs.title.lh,color:th.accent,x,w:headW}));
    if (tr(T.subtitle)) head.push(textEl(env,{text:tr(T.subtitle),font:fs.handB,size:38*ts,lh:1.2,color:ink,x,w:headW,gap:8}));
    els.push(...head);
    const rows=[]; if (tr(T.date)&&!badge) rows.push({icon:'date',text:tr(T.date)});
    if (tr(T.time)) rows.push({icon:'time',text:tr(T.time)});
    if (tr(T.place)||tr(T.address)) rows.push({icon:'place',text:tr(T.place)||tr(T.address),sub:tr(T.place)?tr(T.address):''});
    if (rows.length) els.push(infoEl(env,{rows,x,w,font:fs.strong,size:31*ts,subFont:fs.body,subSize:23*ts,color:ink,subColor:th.muted,iconColor:th.accent,gap:26}));
    const items=listItems(T.people);
    if (items.length) els.push(listEl(env,{items,x,w,font:fs.body,size:28*ts,subFont:fs.body,subSize:21*ts,color:ink,subColor:th.muted,bullet:th.accent,gap:22}));
    if (tr(T.verse)) els.push(textEl(env,{text:quote(tr(T.verse)),font:fs.verse,size:(fs.warmTitle?fs.verse.size:30)*ts,lh:1.32,color:ink,x,w,gap:24}));
    if (tr(T.ref)) els.push(textEl(env,{text:tr(T.ref),upper:true,font:fs.body,size:15*ts,lh:1.4,color:th.muted,x,w,sp:0.14,balance:false,gap:6}));
    if (tr(T.boxTitle)||tr(T.boxText)) els.push(boxEl(26));
    if (tr(T.note)) els.push(textEl(env,{text:tr(T.note),font:fs.handB,size:29*ts,lh:1.25,color:th.accent,x,w,gap:20}));
    const cl=warmClosing(env,wc,w); if (cl) els.push({gap:cl.gap,measure:k=>cl.measure(k),width:()=>0,draw:y=>cl.draw(y,W/2)});

    /* Fotohöhe nach Textmenge, dann Foto, Papier mit Risskante */
    const need=stackH(env,els)+(cl?0:20*u), ph=Math.max(H*0.36,Math.min(H*0.56,H-fh-need-120*u));
    drawPhoto(env,{x:0,y:0,w:W,h:ph+30*u},'rect');
    if (st.sunlight && env.photo){ ctx.save(); ctx.beginPath(); ctx.rect(0,0,W,ph); ctx.clip(); sunGlow(env); ctx.restore(); }
    ctx.save(); ctx.shadowColor='rgba(30,20,10,0.32)'; ctx.shadowBlur=16*u; ctx.shadowOffsetY=-3*u;
    ctx.fillStyle=dark? mix(paper,'#ffffff',0.18) : '#FFFFFF'; tornPath(ctx,-10*u,W+10*u,ph-5*u,H+10*u,8*u,57); ctx.fill(); ctx.restore();
    ctx.fillStyle=paper; tornPath(ctx,-10*u,W+10*u,ph+3*u,H+10*u,8*u,91); ctx.fill();
    ctx.save(); tornPath(ctx,-10*u,W+10*u,ph+3*u,H+10*u,8*u,91); ctx.clip(); paperGrain(env); ctx.restore();

    /* Einladung auf einem Pinselstrich über der Kante */
    const eb=tr(T.eyebrow);
    if (eb){ const f=fitText(ctx,fs.handB,40*ts*u,eb,w*0.8,true), lh=f.px*1.18; ctx.font=fontStr(fs.handB,f.px);
      const bw=maxLineW(ctx,f.lines)+64*u, bh=f.lines.length*lh+26*u, by=ph-bh-26*u;
      rot(ctx,x+bw/2,by+bh/2,-2.5,()=>{ drawBrush(env,x-6*u,by,bw,bh,wc.band2,505); fillLines(ctx,fs.handB,f.px,f.lines,x+26*u,by+13*u,lh,'left',wc.onBand); }); }

    const y0=ph+44*u, bottom=H-fh-(cl?28*u:40*u);
    warmStack(env,els,{x,y:y0,w,h:bottom-y0},'top');
    if (canDoodle(env) && head.length && tr(T.title)){ const t=head[0]; sparkles(ctx,x+Math.min(t.width(),headW)+30*u,y0+30*u,30*u,th.accent,1); }

    if (badge){ const fill=wc.band2; dateBadge(env,W-x-R+10*u,ph+8*u,R,dp,{fill,ink:inkOn(fill),deg:8,scallop:true,fonts:{small:fs.handB,big:fs.num}}); }
    drawWarmFooter(env,wc);
    if (st.frame){ ctx.strokeStyle=rgba(th.accent,0.85); ctx.lineWidth=Math.max(1,1.3*u); ctx.strokeRect(28*u,28*u,W-56*u,H-56*u); }

    /** Kasten: Überschrift auf einem Pinselstrich, Text darunter */
    function boxEl(gap){ let m; const bt=tr(T.boxTitle), bx=tr(T.boxText);
      return {gap,width:()=>w,
        measure(k){ m={k}; if (bt){ m.t=fitText(ctx,fs.handB,36*ts*k*u,bt,w-60*k*u,true); m.tlh=m.t.px*1.2; ctx.font=fontStr(fs.handB,m.t.px); m.bw=maxLineW(ctx,m.t.lines)+50*k*u; m.bh=m.t.lines.length*m.tlh+22*k*u; }
          if (bx){ m.b=fitText(ctx,fs.hand,27*ts*k*u,bx,w,true); m.blh=m.b.px*1.32; }
          return (bt?m.bh:0)+(bx?m.b.lines.length*m.blh+(bt?10*k*u:0):0); },
        draw(y){ if (bt){ rot(ctx,x+m.bw/2,y+m.bh/2,-1.2,()=>{ drawBrush(env,x-4*u,y,m.bw,m.bh,wc.band,606); fillLines(ctx,fs.handB,m.t.px,m.t.lines,x+21*m.k*u,y+11*m.k*u,m.tlh,'left',wc.onBand); }); y+=m.bh+10*m.k*u; }
          if (bx) fillLines(ctx,fs.hand,m.b.px,m.b.lines,x,y,m.blh,'left',ink); } };
    }
  }
};
