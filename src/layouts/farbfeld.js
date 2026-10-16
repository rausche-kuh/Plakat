/* Layout „Farbfeld“ – kräftige Farbfläche oben mit großem Titel, Foto als schräg aufgelegter Abzug,
   Datum als runder Stempel, Uhrzeit und Ort mit Symbolen daneben, der Rest linksbündig darunter. */
import { mix, rgba, rot, drawPhoto, blocks, fitDraw, footerH, drawFooter, rrect, dateParts, dateBadge, inkOn, infoEl, stackAt } from '../render/toolkit.js';

export default {
  id: 'farbfeld',
  name: 'Farbfeld',
  group: 'freundlich',
  about: 'Farbfläche mit großem Titel, schräg aufgelegtes Foto, Datum als runder Stempel – modern und fröhlich',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, tr=s=>(s||'').trim(), ts=st.textScale;
    const dp=dateParts(T.date), fb=th.accent, onB=inkOn(fb,mix(th.deep,'#000000',0.25)), hb=H*0.42, x=70*u, w=W-140*u;
    ctx.fillStyle=fb; ctx.fillRect(0,0,W,hb);
    ctx.fillStyle=mix(fb,onB,0.08); ctx.beginPath(); ctx.arc(W-40*u,60*u,210*u,0,Math.PI*2); ctx.fill();

    /* Foto als Abzug mit weißem Rand, leicht gedreht */
    const pw=560*u, ph=440*u, px=W-x-pw+10*u, py=hb-180*u;
    rot(ctx,px+pw/2,py+ph/2,2.5,()=>{
      ctx.save(); ctx.shadowColor='rgba(20,20,30,0.3)'; ctx.shadowBlur=26*u; ctx.shadowOffsetY=10*u; ctx.fillStyle='#FFFFFF'; rrect(ctx,px-14*u,py-14*u,pw+28*u,ph+28*u,30*u); ctx.fill(); ctx.restore();
      ctx.save(); rrect(ctx,px,py,pw,ph,20*u); ctx.clip(); drawPhoto(env,{x:px,y:py,w:pw,h:ph},'rect'); ctx.restore(); });
    if (dp) dateBadge(env,px+12*u,py+34*u,104*u,dp,{fill:th.second,ink:inkOn(th.second),deg:-9,fonts:{small:fs.strong,big:fs.num}});

    /* Kopf auf der Farbfläche */
    const L={ink:onB,muted:rgba(onB,0.85),accent:onB,line:onB,second:th.second,ornBg:fb};
    fitDraw(env,blocks(env,{col:L,titleBoost:1.12,orn:44}).top,[],{x,y:76*u,w,h:py-(dp?100:50)*u-76*u},'left','bottom');
    const g=blocks(env);

    /* links neben dem Foto: Termin mit Symbolen */
    const rows=[]; if (tr(T.date)&&!dp) rows.push({icon:'date',text:tr(T.date)});
    if (tr(T.time)) rows.push({icon:'time',text:tr(T.time)});
    if (tr(T.place)||tr(T.address)) rows.push({icon:'place',text:tr(T.place)||tr(T.address),sub:tr(T.place)?tr(T.address):''});
    const sx=x, sw=px-x-60*u, sy=hb+46*u, pBottom=py+ph+40*u;
    if (rows.length) stackAt(env,[infoEl(env,{rows,x:sx,w:sw,font:fs.strong,size:28*ts*fs.bs,subFont:fs.body,subSize:21*ts*fs.bs,color:th.ink,subColor:th.muted,iconColor:th.accent})],sy,pBottom-sy-20*u);

    /* darunter: Vers, Mitwirkende, Kasten, Hinweis, Schluss */
    // ohne Termin und Ort (stehen schon oben), dafür etwas größer – fitDraw verkleinert bei Bedarf
    const skip=[T.date,T.time,T.place,T.address].map(tr).filter(Boolean), big=it=>({...it,size:it.size*1.22});
    const det=g.detail.filter(it=>it.type==='text'&&!skip.includes(it.text)).map(big);
    if (det.length) det[0].gap=0;
    const top=pBottom+28*u, fh=footerH(env), bottom=H-56*u;
    fitDraw(env,g.verse.map(big),det,{x,y:top,w,h:bottom-fh-(fh?36*u:0)-top},'left','top');
    drawFooter(env,x,w,bottom,'left',th.muted);
    if (st.frame){ ctx.strokeStyle=rgba(th.accent,0.85); ctx.lineWidth=Math.max(1,1.3*u); ctx.strokeRect(28*u,28*u,W-56*u,H-56*u); }
  }
};
