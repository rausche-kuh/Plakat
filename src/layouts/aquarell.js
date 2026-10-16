/* Layout „Aquarell“ – Papier mit weichen Farbflecken in den Ecken, Foto in einer gemalten Form,
   Text mittig darunter, Termin und Ort mit kleinen Symbolen. Herzlich-Baukasten. */
import { mix, rgba, drawPhoto, paperGrain, canDoodle, heart, warmStack, drawFooter, footerH,
  wash, washLayer, blobPath, listItems, quote, textEl, infoEl, listEl, stackH, fitText, fillLines } from '../render/toolkit.js';

export default {
  id: 'aquarell',
  name: 'Aquarell',
  group: 'herzlich',
  about: 'Papier mit Aquarellflecken, Foto in gemalter Form, Termin mit Symbolen – sanft und fröhlich, gut für Taufe und Familien',
  photo: true,
  warm: true,
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, tr=s=>(s||'').trim(), dark=st.variant==='dunkel', doodle=canDoodle(env);
    env.warmGrade=st.sunlight;
    ctx.fillStyle=dark? th.bg : mix(th.bg,'#ffffff',0.5); ctx.fillRect(0,0,W,H);
    const a=th.accent, b=th.second, al=dark?0.024:0.018;
    washLayer(env,e=>{ wash(e,30*u,20*u,400*u,280*u,a,11,{alpha:al}); wash(e,W-10*u,250*u,230*u,220*u,b,12,{alpha:al});
      wash(e,W-40*u,H-70*u,400*u,240*u,a,13,{alpha:al*0.9}); wash(e,40*u,H-250*u,180*u,150*u,b,14,{alpha:al*0.8}); });
    paperGrain(env);

    /* Text mittig */
    const x=110*u, w=W-220*u, ink=th.ink, els=[];
    if (tr(T.eyebrow)) els.push(textEl(env,{text:tr(T.eyebrow),font:fs.handB,size:38*ts,lh:1.2,color:ink,x,w,align:'center',deg:-1.5}));
    if (tr(T.title)) els.push(textEl(env,{text:tr(T.title),font:fs.title,size:(fs.warmTitle||fs.title.size*1.15)*st.titleScale*0.94,lh:fs.title.lh,color:a,x,w,align:'center',gap:4}));
    if (tr(T.subtitle)) els.push(textEl(env,{text:tr(T.subtitle),font:fs.handB,size:34*ts,lh:1.22,color:ink,x,w,align:'center',gap:8}));
    const rows=[]; if (tr(T.date)) rows.push({icon:'date',text:tr(T.date)});
    if (tr(T.time)) rows.push({icon:'time',text:tr(T.time)});
    if (tr(T.place)||tr(T.address)) rows.push({icon:'place',text:[tr(T.place),tr(T.address)].filter(Boolean).join(', ')});
    if (rows.length) els.push(infoEl(env,{rows,x,w,align:'center',font:fs.strong,size:29*ts,color:ink,iconColor:a,gap:28}));
    if (tr(T.verse)) els.push(textEl(env,{text:quote(tr(T.verse)),font:fs.verse,size:(fs.warmTitle?fs.verse.size:30)*ts*0.95,lh:1.32,color:ink,x:x+30*u,w:w-60*u,align:'center',gap:26}));
    if (tr(T.ref)) els.push(textEl(env,{text:tr(T.ref),upper:true,font:fs.body,size:15*ts,lh:1.4,color:th.muted,x,w,align:'center',sp:0.14,balance:false,gap:6}));
    const items=listItems(T.people);
    if (items.length) els.push(listEl(env,{items,x,w,align:'center',font:fs.body,size:24*ts,subFont:fs.body,subSize:19*ts,color:ink,subColor:th.muted,gap:22}));
    if (tr(T.boxTitle)||tr(T.boxText)) els.push(boxEl(28));
    if (tr(T.note)) els.push(textEl(env,{text:tr(T.note),font:fs.handB,size:28*ts,lh:1.25,color:a,x,w,align:'center',gap:20}));
    if (tr(T.closing)){ const cl=textEl(env,{text:tr(T.closing),font:fs.handB,size:40*ts,lh:1.2,color:a,x,w,align:'center',gap:22,deg:-2});
      els.push(!doodle? cl : {...cl,draw(y){ cl.draw(y); const hw=cl.width()/2, s=22*u, c=mix(b,a,0.3); ctx.fillStyle=c;
        heart(ctx,W/2-hw-34*u,y+22*u,s); ctx.fill(); heart(ctx,W/2+hw+34*u,y+16*u,s*0.8); ctx.fill(); }}); }

    /* Foto in gemalter Form; Größe nach Textmenge */
    const fh=footerH(env), bottom=H-58*u-(fh?fh+30*u:0), need=stackH(env,els), ry=Math.max(150*u,Math.min(270*u,(bottom-need-150*u)/2)), rx=Math.min(350*u,ry*1.3), cy=60*u+ry;
    washLayer(env,e=>wash(e,W/2+24*u,cy+18*u,rx*1.14,ry*1.14,mix(a,b,0.4),15,{alpha:dark?0.04:0.034}));
    ctx.save(); blobPath(ctx,W/2,cy,rx,ry,21); ctx.clip(); drawPhoto(env,{x:W/2-rx*1.1,y:cy-ry*1.1,w:rx*2.2,h:ry*2.2},'rect'); ctx.restore();
    if (st.ornament){ const O=env.orn, r=58*u, ox=W/2+rx*0.78, oy=cy+ry*0.78;
      ctx.save(); ctx.shadowColor='rgba(50,35,20,0.22)'; ctx.shadowBlur=12*u; ctx.shadowOffsetY=4*u; ctx.fillStyle=dark?th.soft:mix(th.bg,'#ffffff',0.7); ctx.beginPath(); ctx.arc(ox,oy,r,0,Math.PI*2); ctx.fill(); ctx.restore();
      ctx.save(); O.draw(ctx,ox,oy,Math.min(r*1.25,r*1.7/O.wf),{a,b:th.line,bg:dark?th.soft:mix(th.bg,'#ffffff',0.7),c:b}); ctx.restore(); }

    const y0=cy+ry+44*u; warmStack(env,els,{x,y:y0,w,h:bottom-y0},'center');
    drawFooter(env,x,w,H-50*u,'center',th.muted);
    if (st.frame){ ctx.strokeStyle=rgba(a,0.8); ctx.lineWidth=Math.max(1,1.3*u); ctx.strokeRect(28*u,28*u,W-56*u,H-56*u); }

    /** Kasten: kleiner Farbfleck hinter Überschrift und Text */
    function boxEl(gap){ let m; const bt=tr(T.boxTitle), bx=tr(T.boxText), bw=Math.min(w,620*u);
      return {gap,width:()=>bw,
        measure(k){ m={k}; m.t=bt? fitText(ctx,fs.title,(fs.warmCard||44)*0.86*ts*k*u,bt,bw-80*k*u,true):null; m.b=bx? fitText(ctx,fs.hand,26*ts*k*u,bx,bw-80*k*u,true):null;
          m.tlh=m.t?m.t.px*1.06:0; m.blh=m.b?m.b.px*1.32:0; m.pad=30*k*u;
          m.h=2*m.pad+(m.t?m.t.lines.length*m.tlh:0)+(m.b?m.b.lines.length*m.blh+(m.t?6*k*u:0):0); return m.h; },
        draw(y){ washLayer(env,e=>wash(e,W/2,y+m.h/2,bw*0.56,m.h*0.6,b,31,{alpha:dark?0.034:0.028})); let yy=y+m.pad;
          if (m.t){ fillLines(ctx,fs.title,m.t.px,m.t.lines,W/2,yy,m.tlh,'center',dark?th.ink:mix(th.ink,b,0.25)); yy+=m.t.lines.length*m.tlh+6*m.k*u; }
          if (m.b) fillLines(ctx,fs.hand,m.b.px,m.b.lines,W/2,yy,m.blh,'center',ink); } };
    }
  }
};
