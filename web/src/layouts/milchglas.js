/* Layout „Milchglas“ – Foto über die ganze Fläche, Titel in heller Handschrift direkt auf dem Foto,
   alles Weitere auf hellen Milchglas-Flächen: Termin oben rechts, Botschaft und Programm links,
   Ort unten rechts, Hinweis als Streifen am Rand. Vorbild: ein Picknick-Plakat aus der Gemeinde.
   Alle Bereiche werden gemeinsam verkleinert, bis sie sich nicht mehr berühren. */
import { rgba, drawPhoto, canDoodle, sparkles, glassCols, frost, rrect, dateParts, listItems, quote, textEl, listEl, panelEl, sz } from '../render/toolkit.js';

export default {
  id: 'milchglas',
  name: 'Milchglas',
  group: 'herzlich',
  about: 'Foto über die ganze Fläche, Texte auf hellen Milchglas-Flächen – luftig, gut für Feste im Freien',
  photo: true,
  warm: true,
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, f=k=>ts*sz(st,k), tr=s=>(s||'').trim(), gc=glassCols(env), dark=st.variant==='dunkel', hand=fs.handB;
    env.warmGrade=st.sunlight;
    drawPhoto(env,{x:0,y:0,w:W,h:H},'rect',{fill:dark?th.deep:th.soft});
    const onPhoto=!!env.photo||dark, light='#FFFDF8', head=onPhoto?light:th.accent, shadow=onPhoto?'rgba(0,0,0,0.5)':null;
    if (env.photo){ const g=ctx.createLinearGradient(0,0,0,H*0.34); g.addColorStop(0,'rgba(0,0,0,0.36)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H*0.34); }
    const m=46*u, P=28*u, glass=(els,o)=>panelEl(env,els,{gc,pad:28,...o}), inner=(x,w)=>({x:x+P,w:w-2*P});

    /* Fußleiste aus Milchglas: Logo und Gemeinde */
    const parish=tr(T.parish); let floor=H-34*u;
    if (parish||env.logo){ const h=64*u, y=H-h; floor=y-24*u;
      frost(env,c=>{ c.beginPath(); c.rect(0,y,W,h); },{x:0,y,w:W,h},gc);
      let x0=44*u; if (env.logo){ const L=env.logo; let lh=h*0.64, lw=lh*L.naturalWidth/L.naturalHeight; if (lw>220*u){ lw=220*u; lh=lw*L.naturalHeight/L.naturalWidth; } ctx.drawImage(L,40*u,y+(h-lh)/2,lw,lh); x0=lw+56*u; }
      if (parish){ const el=textEl(env,{text:parish,font:fs.strong,size:19*f('parish'),lh:1.2,color:gc.ink,x:x0,w:W-2*x0,align:'center',balance:false,sp:0.03}); const eh=el.measure(1); el.draw(y+(h-eh)/2); }
    }

    /* unten rechts: Hinweis als Streifen bis zum Rand, darüber der Ort */
    let note=null, place=null;
    if (tr(T.note)){ const nw=Math.min(W-2*m,640*u), x=W-nw;
      note=glass([textEl(env,{text:tr(T.note),font:fs.hand,size:27*f('note'),lh:1.2,color:gc.ink,...inner(x,nw),align:'center'})],{x,w:nw,anchor:'right',align:'center',pad:26,bleed:30*u,notch:'tl'}); }
    if (tr(T.place)||tr(T.address)){ const pw=Math.min(560*u,W-2*m), x=W-m-pw, I=inner(x,pw), els=[];
      if (tr(T.place)) els.push(textEl(env,{text:tr(T.place),font:hand,size:44*f('place'),lh:1.12,color:gc.ink,...I,align:'center'}));
      if (tr(T.address)) els.push(textEl(env,{text:tr(T.address),font:fs.hand,size:28*f('address'),lh:1.2,color:gc.muted,...I,align:'center',gap:4}));
      place=glass(els,{x,w:pw,anchor:'right',align:'center',notch:'bl'}); }

    /* oben rechts: Termin, leicht schräg geschrieben */
    const dw=360*u, dx=W-m-dw, D=inner(dx,dw), d=tr(T.date), dp=dateParts(d), dEls=[]; let date=null;
    if (d){ let wd='', main=d; const ci=d.indexOf(','); if (ci>0&&ci<16){ wd=d.slice(0,ci); main=d.slice(ci+1).trim(); }
      if (wd) dEls.push(textEl(env,{text:wd,font:hand,size:36*f('date'),lh:1.1,color:gc.ink,...D,align:'center'}));
      dEls.push(textEl(env,{text:main,font:dp?fs.title:hand,size:(dp?82:46)*f('date'),lh:dp?1.0:1.15,color:gc.ink,...D,align:'center',gap:2})); }
    if (tr(T.time)) dEls.push(textEl(env,{text:tr(T.time),font:hand,size:46*f('time'),lh:1.1,color:gc.accent,...D,align:'center',gap:4}));
    if (dEls.length) date=glass(dEls,{x:dx,w:dw,anchor:'right',align:'center',deg:-4,pad:30,notch:'br'});

    /* oben links: Einladung und Titel direkt auf dem Foto */
    const tw=W-2*m-(date?dw+24*u:0), top=[];
    if (tr(T.eyebrow)) top.push(textEl(env,{text:tr(T.eyebrow),font:hand,size:42*f('eyebrow'),lh:1.15,color:head,shadow,x:m,w:tw,deg:-2}));
    if (tr(T.title)) top.push(textEl(env,{text:tr(T.title),font:fs.title,size:(fs.warmTitle||fs.title.size*1.15)*sz(st,'title')*1.06,lh:fs.title.lh*0.98,color:head,shadow,x:m,w:tw,gap:6}));

    /* links: Botschaft, Programm, Kasten, Schluss */
    const cw=Math.min(570*u,W-2*m), C=inner(m,cw), col=[]; let listPanel=null;
    const msg=[]; if (tr(T.subtitle)) msg.push(textEl(env,{text:tr(T.subtitle),font:hand,size:46*f('subtitle'),lh:1.18,color:gc.ink,...C,align:'center'}));
    if (tr(T.verse)) msg.push(textEl(env,{text:quote(tr(T.verse)),font:fs.hand,size:32*f('verse'),lh:1.3,color:gc.ink,...C,align:'center',gap:12}));
    if (tr(T.ref)) msg.push(textEl(env,{text:tr(T.ref),upper:true,font:fs.body,size:15*f('ref'),lh:1.3,color:gc.muted,...C,align:'center',sp:0.14,gap:6,balance:false}));
    if (msg.length) col.push(glass(msg,{x:m,w:cw,align:'center',notch:'tr'}));
    const items=listItems(T.people);
    if (items.length){ listPanel=glass([listEl(env,{items,...C,font:hand,size:44*f('people'),subFont:fs.hand,subSize:27*f('people'),color:gc.ink,subColor:gc.muted,bullet:gc.accent})],{x:m,w:cw,align:'left',notch:'tl',gap:24}); col.push(listPanel); }
    const box=[]; if (tr(T.boxTitle)) box.push(textEl(env,{text:tr(T.boxTitle),font:fs.title,size:(fs.warmCard||44)*0.92*f('boxTitle'),lh:1.05,color:gc.accent,...C,align:'center'}));
    if (tr(T.boxText)) box.push(textEl(env,{text:tr(T.boxText),font:fs.hand,size:28*f('boxText'),lh:1.3,color:gc.ink,...C,align:'center',gap:8}));
    if (box.length) col.push(glass(box,{x:m,w:cw,align:'center',notch:'br',gap:24}));
    if (tr(T.closing)){ const cl=textEl(env,{text:tr(T.closing),font:hand,size:44*f('closing'),lh:1.15,color:head,shadow,x:m+10*u,w:cw-60*u,deg:-3,gap:22});
      col.push(!canDoodle(env)? cl : {...cl,draw(yy){ cl.draw(yy); sparkles(ctx,m+10*u+cl.width()+34*u,yy+18*u,28*u,onPhoto?light:th.accent,1); }}); }

    /* gemeinsam verkleinern, bis Titel, linke Spalte und die Flächen rechts übereinanderpassen */
    const stackH=(els,k)=>els.reduce((s,e,i)=>s+e.measure(k)+(i?e.gap*k*u:0),0);
    let k=1, L;
    for (; k>=0.25; k-=0.03){
      const tH=stackH(top,k), dH=date?date.measure(k):0, nH=note?note.measure(k):0, pH=place?place.measure(k):0;
      const yTop=50*u, colTop=(top.length? yTop+tH : date? 58*u+dH : 30*u)+30*u*k, br=(nH?nH+14*u:0)+(pH?pH+26*u:0), colBottom=floor-br, cH=stackH(col,k);
      L={tH,dH,nH,pH,colTop,colBottom,cH};
      if (colTop+cH<=colBottom && (!date||58*u+dH+20*u<=colBottom+(br?0:1e9))) break;
    }
    if (k<0.25) k+=0.03;   // kleinster Faktor erreicht: so zeichnen, wie zuletzt gemessen
    let yb=floor;
    if (note){ note.draw(yb-L.nH); yb-=L.nH+14*u; }
    if (place){ place.draw(yb-L.pH); }
    if (date) date.draw(58*u);
    let y=50*u; top.forEach((e,i)=>{ if (i) y+=e.gap*k*u; e.draw(y); y+=e.measure(k); });
    /* linke Spalte von oben, übriger Platz geht zum Teil in die Abstände */
    if (col.length){ const hs=col.map(e=>e.measure(k)), gaps=col.map((e,i)=>i?e.gap*k*u:0), gsum=gaps.reduce((a,b)=>a+b,0);
      const extra=Math.max(0,L.colBottom-L.colTop-L.cH), f=gsum? Math.min(extra,gsum*0.8)/gsum : 0; let yy=L.colTop;
      col.forEach((e,i)=>{ yy+=gaps[i]*(1+f); e.draw(yy); yy+=hs[i]; }); }

    /* Zierelement in einem runden Glas neben dem Programm (sonst neben der ersten Fläche) */
    const anchor=(listPanel&&listPanel.rect)||col.find(e=>e.rect)?.rect;
    if (st.ornament && anchor){ const O=env.orn, r=62*u*Math.max(k,0.7), cx=Math.min(anchor.x+anchor.w+r*0.75,W-m-r), cy=anchor.y+Math.min(anchor.h*0.35,r*1.2);
      frost(env,c=>{ c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); },{x:cx-r,y:cy-r,w:2*r,h:2*r},gc);
      ctx.save(); O.draw(ctx,cx,cy,Math.min(r*1.2,r*1.7/O.wf),{a:gc.accent,b:gc.ink,bg:dark?th.bg:'#F4F1EA',c:th.second}); ctx.restore(); }
    if (st.frame){ ctx.strokeStyle=rgba('#ffffff',0.8); ctx.lineWidth=Math.max(1,1.3*u); rrect(ctx,22*u,22*u,W-44*u,H-44*u,26*u); ctx.stroke(); }
  }
};
