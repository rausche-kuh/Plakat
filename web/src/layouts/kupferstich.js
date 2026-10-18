/* Layout „Kupferstich“ – das Foto als Linienstich wie in alten Bibeln: waagerechte Linien, die im Dunkeln dicker werden,
   im Oval mit feinem Doppelrahmen auf einer Platte mit kleinen Schnörkeln in den Ecken. Klassischer Textsatz mittig darunter.
   Wenig Tinte: auch die dunkelsten Stellen decken nur gut die Hälfte, zum Rand hin wird der Stich heller. */
import { rgba, luma, drawPhoto, blocks, fitDraw, footerH, drawFooter, drawFrame, arranged } from '../render/toolkit.js';

/** Foto in r zeichnen, Pixel zurücklesen und die Fläche wieder mit Papier füllen → l(x,y): Helligkeit 0–1, ohne Foto null */
function sample(env,r){
  const {ctx,W,H,th}=env; drawPhoto(env,r,'rect');
  const x0=Math.max(0,Math.floor(r.x)), y0=Math.max(0,Math.floor(r.y)), w=Math.min(W,Math.ceil(r.x+r.w))-x0, h=Math.min(H,Math.ceil(r.y+r.h))-y0;
  if (w<1||h<1) return null;
  const d=env.photo? ctx.getImageData(x0,y0,w,h).data : null; ctx.fillStyle=th.bg; ctx.fillRect(x0,y0,w,h);
  if (!d) return null;
  const px=(x,y)=>{ const i=(Math.min(h-1,Math.max(0,Math.round(y-y0)))*w+Math.min(w-1,Math.max(0,Math.round(x-x0))))*4; return (0.299*d[i]+0.587*d[i+1]+0.114*d[i+2])/255; };
  return (x,y,s)=>(px(x,y)*2+px(x-s,y)+px(x+s,y)+px(x,y-s)+px(x,y+s))/6;
}
/** Tonwerte strecken: die 4 % dunkelsten werden voll, die 4 % hellsten leer; die Mitten etwas heller (weniger Tinte) */
function stretch(a){ const s=Float32Array.from(a).sort(), lo=s[Math.floor(s.length*0.04)]||0, hi=s[Math.floor(s.length*0.96)]||1;
  return v=>Math.pow(Math.min(1,Math.max(0,(v-lo)/Math.max(0.2,hi-lo))),1.25); }
/** Schnörkel in einer Ecke (x,y); sx, sy = ±1 zeigen zur Mitte, s = Größe */
function curl(ctx,x,y,sx,sy,s,lw){
  ctx.save(); ctx.translate(x,y); ctx.scale(sx*s/100,sy*s/100); ctx.lineWidth=lw*100/s; ctx.beginPath();
  for (const [a,b] of [[1,0],[0,1]]){ const P=(px,py)=>[a?px:py,a?py:px];   // einmal an der oberen, einmal an der seitlichen Kante entlang
    ctx.moveTo(...P(14,14)); ctx.bezierCurveTo(...P(40,6),...P(62,20),...P(78,12)); ctx.bezierCurveTo(...P(92,5),...P(98,20),...P(86,24)); ctx.bezierCurveTo(...P(78,27),...P(74,18),...P(81,16)); }
  ctx.stroke(); ctx.beginPath(); ctx.moveTo(12,12); ctx.quadraticCurveTo(33,15,34,34); ctx.quadraticCurveTo(15,33,12,12); ctx.fill(); ctx.restore();   // Blatt zur Mitte
}

export default {
  id: 'kupferstich',
  name: 'Kupferstich',
  group: 'schwarzweiss',
  about: 'Foto als Linienstich wie in alten Bibeln, im Oval mit feinem Rahmen und Schnörkeln, Text klassisch darunter',
  photo: true,
  parts: ['photo','text'],
  draw(env){
    const {ctx,W,H,u,th,st}=env, def={x:W/2-250*u,y:110*u,w:500*u,h:580*u}, p=arranged(env,'photo',def);
    const cx=p.x+p.w/2, cy=p.y+p.h/2, rx=p.w/2, ry=p.h/2, dark=luma(th.bg)<0.5, o=env.orn;
    // Stich: waagerechte, leicht gewellte Linien; Strichstärke folgt der Dunkelheit (auf dunklem Grund der Helligkeit)
    const l=sample(env,p), sp=7*u, cap=0.6, dx=Math.max(1.5,2.5*u), orn=st.ornament && !l, rows=[], all=[];
    for (let y=p.y+sp/2; y<p.y+p.h; y+=sp){ const hw=Math.sqrt(Math.max(0,1-((y-cy)/ry)**2))*rx, row=[];
      for (let x=cx-hw-dx; x<=cx+hw+dx; x+=dx){ const t=Math.hypot((x-cx)/rx,(y-cy)/ry), v=l? l(x,y,sp/3) : 0;
        row.push(x,t,l? (dark?v:1-v) : orn&&t<0.5? 0 : 0.14+0.5*t*t); if (l) all.push(row[row.length-1]); }
      rows.push([y,row]); }
    const tone=l? stretch(all) : v=>v;
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.clip(); ctx.fillStyle=th.ink;
    rows.forEach(([y,row],j)=>{ const top=[], bot=[];
      for (let i=0;i<row.length;i+=3){ const x=row[i], t=row[i+1], f=l? Math.min(1,(1.04-t)/0.3) : 1, w=sp*cap*tone(row[i+2])*Math.max(0,f)/2;
        const yy=y+1.3*u*Math.sin(x/(70*u)+j*0.45); top.push(x,yy-w); bot.push(x,yy+w); }
      if (!top.length) return;
      ctx.beginPath(); ctx.moveTo(top[0],top[1]); for (let i=2;i<top.length;i+=2) ctx.lineTo(top[i],top[i+1]);
      for (let i=bot.length-2;i>=0;i-=2) ctx.lineTo(bot[i],bot[i+1]); ctx.closePath(); ctx.fill(); });
    ctx.restore();
    // Doppelrahmen ums Oval, Platte mit Schnörkeln in den Ecken
    ctx.strokeStyle=th.ink; ctx.fillStyle=th.ink;
    ctx.lineWidth=Math.max(1,2.6*u); ctx.beginPath(); ctx.ellipse(cx,cy,rx+12*u,ry+12*u,0,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=Math.max(0.8,0.9*u); ctx.beginPath(); ctx.ellipse(cx,cy,rx+5*u,ry+5*u,0,0,Math.PI*2); ctx.stroke();
    const P=34*u, px0=p.x-P, py0=p.y-P, pw=p.w+2*P, ph=p.h+2*P;
    ctx.lineWidth=Math.max(1,1.4*u); ctx.strokeRect(px0,py0,pw,ph); ctx.lineWidth=Math.max(0.8,0.8*u); ctx.strokeRect(px0+6*u,py0+6*u,pw-12*u,ph-12*u);
    const cs=Math.min(pw,ph)*0.2, ci=12*u;
    [[px0+ci,py0+ci,1,1],[px0+pw-ci,py0+ci,-1,1],[px0+ci,py0+ph-ci,1,-1],[px0+pw-ci,py0+ph-ci,-1,-1]].forEach(([x,y,a,b])=>curl(ctx,x,y,a,b,cs,1.3*u));
    // Zierelement: ohne Foto groß im Oval, sonst als kleines Medaillon auf der Unterkante der Platte
    const oc={a:th.accent,b:th.ink,bg:th.bg,c:th.second};
    if (orn){ ctx.save(); o.draw(ctx,cx,cy,Math.min(rx,ry)*Math.min(0.62,0.9/o.wf),oc); ctx.restore(); }
    let top=def.y+def.h+P+56*u;   // Text richtet sich nach der Platte des Layouts, nicht nach der verschobenen
    if (st.ornament && l){ const r=40*u, oy=py0+ph; ctx.fillStyle=th.bg; ctx.beginPath(); ctx.arc(cx,oy,r,0,Math.PI*2); ctx.fill();
      ctx.lineWidth=Math.max(1,1.4*u); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,oy,r-5*u,0,Math.PI*2); ctx.lineWidth=Math.max(0.8,0.8*u); ctx.stroke();
      ctx.save(); o.draw(ctx,cx,oy,Math.min(44*u,64*u/o.wf),oc); ctx.restore(); top+=30*u; }
    const fh=footerH(env), bottom=H-56*u, g=blocks(env);
    fitDraw(env,[...g.top,...g.verse],g.detail,arranged(env,'text',{x:110*u,y:top,w:W-220*u,h:bottom-fh-(fh?36*u:0)-top}),'center','center');
    drawFooter(env,110*u,W-220*u,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
