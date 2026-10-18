/* Layout „Flugblatt“ – wie eine Zeitungsseite: Kopfleiste mit dem Gemeindenamen zwischen Linien, Spitzmarke,
   große Schlagzeile, Foto mit Haarlinie und Bildunterschrift (Bibelvers), darunter zwei Spalten mit Linie dazwischen.
   Ohne Foto steht der Bibelvers groß als Zitat an seiner Stelle. Alles wird gemeinsam eingepasst. */
import { textEl, listEl, listItems, quote, fontStr, measureW, drawSpaced, footerH, drawFooter, drawPhoto, sz } from '../render/toolkit.js';

export default {
  id: 'flugblatt',
  name: 'Flugblatt',
  group: 'schwarzweiss',
  about: 'Wie eine Zeitungsseite: Kopfleiste, große Schlagzeile, Foto mit Bildunterschrift, Spalten – wenig Tinte, gut zum Kopieren',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, f=k=>ts*sz(st,k), tr=s=>(s||'').trim(), ink=th.ink, hair=Math.max(1,1.2*u);
    const x=70*u, w=W-140*u, cx=W/2, hasPh=!!env.photo;
    const mastKey=tr(T.parish)?'parish':tr(T.eyebrow)?'eyebrow':'', mast=mastKey?tr(T[mastKey]):'', line=tr(mastKey==='parish'?T.eyebrow:'');
    // Gemeindename steht schon im Kopf: Fußzeile nur mit Logo
    const fenv=mastKey==='parish'? {...env,st:{...st,texts:{...T,parish:''}}} : env, fh=footerH(fenv);
    const rule=(y,h,x0=x,x1=x+w)=>{ ctx.fillStyle=ink; ctx.fillRect(x0,y,x1-x0,h); };

    /* Kopf: Name (links und rechts das Zierelement wie Zeitungsohren), Haarlinie, Spitzmarke, dicke und dünne Linie */
    const head={measure(k){ const o=env.orn, os=st.ornament?54*k*u:0, ow=os*o.wf, gap=ow?24*k*u:0;
        let px=56*k*u*(mastKey?sz(st,mastKey):1); ctx.font=fontStr(fs.title,px); const mw=w-2*(ow+gap); if (mast){ const mw0=measureW(ctx,mast,0); if (mw0>mw) px*=mw/mw0; }
        const lpx=17*k*u*f('eyebrow'); this.m={k,os,ow,px,lpx,nh:mast? Math.max(px*1.05,os):os, lh:line? lpx*2.2:10*k*u};
        return this.m.nh+12*k*u+hair+this.m.lh+5*k*u+4*k*u+hair; },
      draw(y){ const m=this.m, o=env.orn;
        if (m.os){ const oy=y+m.nh/2, oc={a:ink,b:ink,bg:th.bg,c:th.muted};
          if (mast){ o.draw(ctx,x+m.ow/2,oy,m.os,oc); o.draw(ctx,x+w-m.ow/2,oy,m.os,oc); } else o.draw(ctx,cx,oy,m.os,oc); }
        if (mast){ ctx.font=fontStr(fs.title,m.px); ctx.fillStyle=ink; ctx.textAlign='center'; ctx.fillText(mast,cx,y+m.nh/2+m.px*0.34); }
        y+=m.nh+12*m.k*u; rule(y,hair); y+=hair;
        if (line){ const t=line.toUpperCase(); let px=m.lpx; ctx.font=fontStr(fs.body,px); while (measureW(ctx,t,px*0.22)>w*0.8 && px>4){ px*=0.94; ctx.font=fontStr(fs.body,px); }
          ctx.fillStyle=ink; drawSpaced(ctx,t,cx,y+m.lh/2+px*0.34,px*0.22,'center');
          const tw=measureW(ctx,t,px*0.22)/2+18*m.k*u; ctx.beginPath(); [cx-tw,cx+tw].forEach(d=>{ ctx.moveTo(d,y+m.lh/2-4*m.k*u); ctx.lineTo(d+4*m.k*u,y+m.lh/2); ctx.lineTo(d,y+m.lh/2+4*m.k*u); ctx.lineTo(d-4*m.k*u,y+m.lh/2); ctx.closePath(); }); ctx.fill(); }
        y+=m.lh; rule(y,5*m.k*u); rule(y+5*m.k*u+4*m.k*u,hair); } };

    /* Schlagzeile und Unterzeile */
    const els=[];
    if (tr(T.title)) els.push(textEl(env,{text:tr(T.title),font:fs.title,size:fs.title.size*1.45*sz(st,'title'),lh:fs.title.lh*0.98,sp:fs.title.sp||0,color:ink,x,w,align:'center',gap:0}));
    if (tr(T.subtitle)) els.push(textEl(env,{text:tr(T.subtitle),font:fs.italic,size:30*f('subtitle')*fs.bs,lh:1.3,color:th.muted,x:x+40*u,w:w-80*u,align:'center',gap:14}));

    /* Mit Foto: Foto links, daneben Termin und Ort; darunter Mitwirkende | Kasten. Ohne Foto: Bibelvers als Zitat, darunter Termin | Rest */
    const items=listItems(T.people), hasB=tr(T.boxTitle)||tr(T.boxText), gut=56*u, hasI=tr(T.date)||tr(T.time)||tr(T.place)||tr(T.address), pw=hasPh&&hasI?Math.round(w*0.6):w, sx=x+pw+gut, sw=w-pw-gut;
    const info=(x0,w0,al)=>{ const a=[];
      if (tr(T.date)) a.push(textEl(env,{text:tr(T.date),font:fs.strong,size:34*f('date')*fs.bs,lh:1.16,color:ink,x:x0,w:w0,align:al}));
      if (tr(T.time)) a.push(textEl(env,{text:tr(T.time),font:fs.strong,size:34*f('time')*fs.bs,lh:1.16,color:th.accent,x:x0,w:w0,align:al,gap:6}));
      if (tr(T.place)) a.push(textEl(env,{text:tr(T.place),font:fs.body,size:25*f('place')*fs.bs,lh:1.26,color:ink,x:x0,w:w0,align:al,gap:18}));
      if (tr(T.address)) a.push(textEl(env,{text:tr(T.address),font:fs.body,size:21*f('address')*fs.bs,lh:1.26,color:th.muted,x:x0,w:w0,align:al,gap:3}));
      return a; };
    const people=(x0,w0,al)=>items.length? [listEl(env,{items,x:x0,w:w0,align:al,font:fs.body,size:21*f('people')*fs.bs,subFont:fs.body,subSize:17*f('people')*fs.bs,color:ink,subColor:th.muted,bullet:ink})] : [];
    const box=(x0,w0,al,g)=>{ const a=[];
      if (tr(T.boxTitle)) a.push(textEl(env,{text:tr(T.boxTitle),font:fs.strong,size:23*f('boxTitle')*fs.bs,lh:1.25,color:ink,x:x0,w:w0,align:al,balance:al==='center',gap:g}));
      if (tr(T.boxText)) a.push(textEl(env,{text:tr(T.boxText),font:fs.body,size:19*f('boxText')*fs.bs,lh:1.4,color:th.muted,x:x0,w:w0,align:al,balance:al==='center',gap:tr(T.boxTitle)?4:g}));
      return a; };
    /** Zwei Spalten mit Haarlinie dazwischen; ist eine leer, steht die andere mittig über die ganze Breite */
    const cols=(mkL,mkR)=>{ const cw=(w-gut)/2, l0=mkL(x,cw,'left'), r0=mkR(x+cw+gut,cw,'left');
      if (!l0.length||!r0.length){ const one=l0.length? mkL(x,w,'center') : mkR(x,w,'center'); return {measure:k=>stack(one,k),draw:(y,k)=>drawStack(one,y,k)}; }
      return {measure:k=>Math.max(stack(l0,k),stack(r0,k)),draw(y,k){ const h=this.measure(k); ctx.fillStyle=th.line; ctx.fillRect(x+cw+gut/2-hair/2,y,hair,h); drawStack(l0,y,k); drawStack(r0,y,k); }}; };
    const stack=(a,k)=>a.reduce((s,e,i)=>s+e.measure(k)+(i?e.gap*k*u:0),0), drawStack=(a,y,k)=>{ stack(a,k); a.forEach((e,i)=>{ if (i) y+=e.gap*k*u; e.draw(y); y+=e.measure(k); }); return y; };
    const cap=[tr(T.verse)&&quote(tr(T.verse)),tr(T.ref)].filter(Boolean), capEl=hasPh&&cap.length? textEl(env,{text:cap.join(' – '),font:fs.italic,size:19*f('verse')*fs.bs,lh:1.35,color:ink,x,w:pw,align:'left',balance:false}) : null;
    const side=hasPh? info(sx,sw,'left') : [];
    const quoteEls=[]; if (!hasPh){ if (tr(T.verse)) quoteEls.push(textEl(env,{text:quote(tr(T.verse)),font:fs.verse,size:fs.verse.size*1.45*f('verse'),lh:1.28,color:ink,x:x+50*u,w:w-100*u,align:'center'}));
      if (tr(T.ref)) quoteEls.push(textEl(env,{text:tr(T.ref),upper:true,font:fs.body,size:15*f('ref')*fs.bs,lh:1.3,sp:0.18,color:th.muted,x,w,align:'center',balance:false,gap:14})); }
    const rowB=hasPh? cols(people,(a,b,c)=>box(a,b,c,0)) : cols(info,(a,b,c)=>[...people(a,b,c),...box(a,b,c,items.length?22:0)]);
    const ends=[]; if (tr(T.note)) ends.push(textEl(env,{text:tr(T.note),font:fs.italic,size:22*f('note')*fs.bs*fs.italicBoost,lh:1.3,color:th.accent,x,w,align:'center'}));
    if (tr(T.closing)) ends.push(textEl(env,{text:tr(T.closing),font:fs.italic,size:26*f('closing')*fs.bs*fs.italicBoost,lh:1.25,color:ink,x,w,align:'center',gap:10}));

    /* Teile von oben nach unten; das Foto bekommt den Rest (mindestens 250, höchstens 390 Einheiten, über die ganze Breite flacher – wegen der Tinte); Text darf bis 115 % wachsen */
    let ph=0; const maxPh=390*u*Math.min(1,0.6*w/pw), capH=k=>capEl? capEl.measure(k)+12*k*u : 0;
    const R=[head,
      els.length&&{measure:k=>stack(els,k),draw:(y,k)=>drawStack(els,y,k)},
      hasPh&&{flex:true,measure:k=>Math.max(ph+capH(k),stack(side,k)),draw(y,k){ const r={x,y,w:pw,h:ph}; drawPhoto(env,r,'rect'); ctx.strokeStyle=ink; ctx.lineWidth=hair; ctx.strokeRect(x+hair/2,y+hair/2,pw-hair,ph-hair);
        if (capEl){ capEl.measure(k); capEl.draw(y+ph+12*k*u); } if (side.length){ ctx.fillStyle=th.line; ctx.fillRect(x+pw+gut/2-hair/2,y,hair,this.measure(k)); drawStack(side,y,k); } }},
      quoteEls.length&&{measure:k=>stack(quoteEls,k)+36*k*u,draw(y,k){ const qh=stack(quoteEls,k); rule(y,hair,x+w*0.3,x+w*0.7); drawStack(quoteEls,y+18*k*u,k); rule(y+qh+36*k*u-hair,hair,x+w*0.3,x+w*0.7); }},
      {measure:k=>rowB.measure(k),draw:(y,k)=>rowB.draw(y,k)},
      ends.length&&{measure:k=>stack(ends,k),draw:(y,k)=>drawStack(ends,y,k)}].filter(r=>r&&r.measure(1)!==undefined);
    const top=56*u, bottom=H-50*u-(fh?fh+26*u:0), sum=k=>R.reduce((s,r)=>s+r.measure(k),0)+34*k*u*(R.length-1);
    let k=1.15; for (;k>0.3;k-=0.03){ ph=0; const rest=bottom-top-sum(k); if (!hasPh){ if (rest>=0) break; continue; }
      const sh=stack(side,k), A=rest+Math.max(capH(k),sh); ph=Math.min(maxPh,A-capH(k)); if (sh<=A && ph>=Math.min(250*k*u,maxPh)) break; }
    if (hasPh) ph=Math.max(ph,120*u);
    const g=34*k*u+Math.max(0,bottom-top-sum(k))/Math.max(1,R.length-1);
    let y=top; for (const r of R){ const h=r.measure(k); if (h>0){ r.draw(y,k); y+=h+g; } }
    if (fh){ rule(H-50*u-fh-14*u,hair,x+w*0.38,x+w*0.62); drawFooter(fenv,x,w,H-50*u,'center',th.muted); }
    if (st.frame){ ctx.strokeStyle=ink; ctx.lineWidth=hair; ctx.strokeRect(30*u,30*u,W-60*u,H-60*u); }
  }
};
