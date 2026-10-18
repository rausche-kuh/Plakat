/* Layout „Doppelbogen“ – Foto in einer Form aus zwei Bögen: rund oben, an der Taille eingezogen, unten breiter
   mit gerader Kante. Kräftige Versalien: Einladung oben links gestapelt, Datum groß und gestapelt rechts über dem Foto,
   Titel sehr groß unten links über der Fotokante. Wo Text auf dem Foto steht, geht das Foto weich in den Grund über.
   Vorbild: eine Plakatvorlage für einen Konzertabend. Mit „Dunkel“ und dem Filter „Schwarz-Weiß“ wie das Vorbild. */
import { rgba, drawPhoto, footerH, drawFooter, drawFrame, dateParts, quote, textEl, sz } from '../render/toolkit.js';

export default {
  id: 'doppelbogen',
  name: 'Doppelbogen',
  group: 'freundlich',
  about: 'Foto in doppelter Bogenform, großes gestapeltes Datum, sehr großer Titel unten – kräftig und modern, gut für Konzerte und Jugend',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, bs=fs.bs, f=k=>ts*sz(st,k), tr=s=>(s||'').trim();
    const m=70*u, fh=footerH(env), bottom=H-50*u, el=o=>textEl(env,{lh:1.3,color:th.ink,balance:false,...o});

    /* oben links: Einladung gestapelt, oben rechts: Untertitel und Vers klein */
    const ew=tr(T.eyebrow)? 270*u : 0, eye=[], para=[], px=ew? m+ew+36*u : m, pw=W-m-px;
    if (ew) eye.push(el({text:tr(T.eyebrow),upper:true,font:fs.title,size:fs.title.size*0.66*sz(st,'eyebrow'),lh:0.95,x:m,w:ew}));
    if (tr(T.subtitle)) para.push(el({text:tr(T.subtitle),upper:true,font:fs.strong,size:19*bs*f('subtitle'),lh:1.25,x:px,w:pw}));
    if (tr(T.verse)) para.push(el({text:quote(tr(T.verse)),font:fs.verse,size:fs.verse.size*0.7*f('verse'),lh:fs.verse.lh,x:px,w:pw,gap:12}));
    if (tr(T.ref)) para.push(el({text:tr(T.ref),upper:true,font:fs.body,size:14*bs*f('ref'),color:th.muted,x:px,w:pw,sp:0.14,gap:6}));

    /* rechts: Datum groß und gestapelt (oder als Text, wenn es sich nicht zerlegen lässt), darunter Uhrzeit und Ort */
    const dx=W*0.44, dw=W-m-dx, rt=o=>el({x:dx,w:dw,align:'right',...o}), big=fs.title.size*1.55*sz(st,'date'), d=tr(T.date), dp=dateParts(d), date=[];
    if (dp){ if (dp.wd) date.push(rt({text:dp.wd,upper:true,font:fs.strong,size:22*bs*f('date'),sp:0.2}));
      [dp.day+'.',dp.month,dp.year].filter(Boolean).forEach((t,i)=>date.push(rt({text:t,upper:true,font:fs.title,size:big,lh:0.98,gap:i?0:4}))); }
    else if (d) date.push(rt({text:d,upper:true,font:fs.title,size:big*0.5,lh:1.0,balance:true}));
    if (tr(T.time)) date.push(rt({text:tr(T.time),font:fs.strong,size:27*bs*f('time'),gap:18}));
    if (tr(T.place)) date.push(rt({text:tr(T.place),font:fs.body,size:23*bs*f('place'),gap:6}));
    if (tr(T.address)) date.push(rt({text:tr(T.address),font:fs.body,size:20*bs*f('address'),color:th.muted,gap:2}));

    /* unten: Titel sehr groß, daneben Kasten und Mitwirkende, darunter Hinweis und Schluss nebeneinander */
    const side=[], hasSide=tr(T.boxTitle)||tr(T.boxText)||tr(T.people), tw=hasSide? W*0.56 : W-2*m, sx=m+tw+30*u, sw=W-m-sx;
    if (tr(T.boxTitle)) side.push(el({text:tr(T.boxTitle),upper:true,font:fs.strong,size:21*bs*f('boxTitle'),lh:1.2,x:sx,w:sw}));
    if (tr(T.boxText)) side.push(el({text:tr(T.boxText),font:fs.body,size:18*bs*f('boxText'),lh:1.35,x:sx,w:sw,gap:4}));
    if (tr(T.people)) side.push(el({text:tr(T.people),font:fs.body,size:18*bs*f('people'),lh:1.35,color:th.muted,x:sx,w:sw,gap:side.length?14:0}));
    const tSize=fs.title.size*1.9*sz(st,'title'), title=tr(T.title)? el({text:tr(T.title),upper:true,font:fs.title,size:tSize,lh:0.92,balance:true,x:m,w:tw}) : null;
    const cx2=W*0.46, note=tr(T.note)? el({text:tr(T.note),font:fs.body,size:24*bs*f('note'),lh:1.2,x:m,w:cx2-m-30*u}) : null,
      clos=tr(T.closing)? el({text:tr(T.closing),font:fs.body,size:24*bs*f('closing'),lh:1.2,x:cx2,w:W-m-cx2}) : null;

    /* gemeinsam verkleinern, bis Kopf, Foto, Datum und Fuß übereinanderpassen */
    const stack=(els,k)=>els.reduce((s,e,i)=>s+e.measure(k)+(i?e.gap*k*u:0),0);
    let k=1, L;
    for (; k>=0.25; k-=0.03){
      const eyH=stack(eye,k), paH=stack(para,k), dH=stack(date,k), tH=title?title.measure(k):0, sH=stack(side,k), rowH=Math.max(note?note.measure(k):0,clos?clos.measure(k):0);
      const rowTop=bottom-fh-(fh?28*u:0)-rowH, lowB=rowTop-(rowH?30*u:0), lowT=lowB-Math.max(tH,sH);
      const yT=Math.max(210*u,(paH?80*u+paH+40*u:0)), yB=Math.min(lowT+Math.min(tH,tSize*k*u)*0.55, sH? lowB-sH-24*u : 1e9);   // Kasten und Mitwirkende nie aufs Foto
      L={eyH,paH,dH,tH,sH,rowTop,lowB,lowT,yT,yB};
      if (yB-yT>=500*u && yT+20*u+dH<=lowT-24*u && 80*u+eyH<=lowT-40*u) break;
    }
    if (k<0.25) k+=0.03;   // kleinster Faktor erreicht: so zeichnen, wie zuletzt gemessen

    /* Foto: Kreis oben und ein Rechteck mit runden Ecken unten ergeben zusammen die Form mit der eingezogenen Taille */
    const {yT,yB}=L, R=Math.max(20*u,Math.min(W*0.4,(yB-yT)/1.95)),   // nie negativ, sonst wirft arc()
      cx=W/2, cy=yT+R, yL=cy+0.62*R, rc=0.3*R;
    ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.moveTo(cx-R,yB); ctx.lineTo(cx-R,yL+rc); ctx.arcTo(cx-R,yL,cx-R+rc,yL,rc); ctx.lineTo(cx+R-rc,yL); ctx.arcTo(cx+R,yL,cx+R,yL+rc,rc); ctx.lineTo(cx+R,yB); ctx.closePath();
    ctx.clip(); drawPhoto(env,{x:cx-R,y:yT,w:2*R,h:yB-yT},'rect',{fill:th.soft}); ctx.restore();

    /* weicher Hof in der Grundfarbe hinter Text, der auf dem Foto steht */
    // nur der weichgezeichnete Schatten eines Rechtecks außerhalb der Fläche landet auf dem Plakat (shadowBlur kann auch Safari)
    const glow=(x,y,w,h)=>{ if (w<=0||h<=0) return; ctx.save(); ctx.shadowColor=rgba(th.bg,0.85); ctx.shadowBlur=56*u; ctx.shadowOffsetX=3*W;
      ctx.fillStyle='#000'; ctx.fillRect(x-3*W-16*u,y-12*u,w+32*u,h+24*u); ctx.restore(); };
    const wid=els=>Math.max(0,...els.map(e=>e.width()));
    const dY=yT+20*u; if (date.length) glow(W-m-wid(date),dY,wid(date),L.dH);
    if (title) glow(m,L.lowB-L.tH,title.width(),L.tH);
    if (eye.length) glow(m,80*u,wid(eye),L.eyH);

    const draw=(els,y)=>els.forEach((e,i)=>{ if (i) y+=e.gap*k*u; e.draw(y); y+=e.measure(k); });
    draw(eye,80*u); draw(para,80*u); draw(date,dY);
    if (title) title.draw(L.lowB-L.tH);
    draw(side,L.lowB-L.sH);
    if (note) note.draw(L.rowTop); if (clos) clos.draw(L.rowTop);
    drawFooter(env,m,W-2*m,bottom,'left',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
