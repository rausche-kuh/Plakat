/* Layout „Scherenschnitt“ – Spitzenrand wie aus schwarzem Papier geschnitten, oben eine Krone aus Ranken und Tulpen
   um das Zierelement im Medaillon, Foto im Oval mit Spitzenkranz, Text mittig. Wenig Tinte: nur schmale Stege und Punkte. */
import { blocks, fitDraw, measureGroup, footerH, drawFooter, drawPhoto, heart, arranged } from '../render/toolkit.js';

export default {
  id: 'scherenschnitt',
  name: 'Scherenschnitt',
  group: 'schwarzweiss',
  about: 'Spitzenrand und Rankenkrone wie aus Papier geschnitten, Foto im Oval, Text mittig – festlich und volkstümlich, wenig Tinte',
  photo: true,
  parts: ['photo','text'],
  draw(env){
    const {ctx,W,H,u,th,st}=env, ink=th.ink, bg=th.bg, hasPh=!!env.photo;
    ctx.fillStyle=ink; ctx.strokeStyle=ink; ctx.lineCap='round';
    lace(30*u);

    /* Krone: Medaillon mit Zierelement, Ranken mit Blättern, Tulpen und Herzen; ohne Foto größer und tiefer */
    const ck=hasPh?1:1.12, cy=(hasPh?172:214)*u;
    crown(W/2,cy,ck*u);
    let top=cy+(hasPh?112:120)*u;

    /* Foto im Oval mit Spitzenkranz; bei viel Text kleiner */
    const fh=footerH(env), bottom=H-92*u, tb=bottom-fh-(fh?30*u:0), g=blocks(env,{titleBoost:hasPh?1:1.12}), tw=W-260*u;
    if (hasPh){
      const need=measureGroup(env,[...g.top,...g.verse],1,tw).h+measureGroup(env,g.detail,1,tw).h+48*u, ry=Math.max(112*u,Math.min(164*u,(tb-top-88*u-need*0.8)/2)), rx=ry*1.35, p=arranged(env,'photo',{x:W/2-rx,y:top+32*u,w:2*rx,h:2*ry}), ox=p.x+p.w/2, oy=p.y+p.h/2;
      ctx.save(); ctx.beginPath(); ctx.ellipse(ox,oy,p.w/2,p.h/2,0,0,Math.PI*2); ctx.clip(); drawPhoto(env,p,'rect'); ctx.restore();
      ovalLace(ox,oy,p.w/2,p.h/2);
      top+=32*u+2*ry+56*u;
    }
    fitDraw(env,[...g.top,...g.verse],g.detail,arranged(env,'text',{x:130*u,y:top,w:tw,h:tb-top}),'center','center');
    drawFooter(env,130*u,W-260*u,bottom,'center',th.muted);
    if (st.frame){ ctx.strokeStyle=ink; ctx.lineWidth=Math.max(1,1.2*u); ctx.strokeRect(88*u,88*u,W-176*u,H-176*u); }

    /** Spitzenrand: äußerer Steg, Bögen nach innen mit Punkten, Stege dazwischen, Herzen in den Ecken */
    function lace(i0){
      const d=30*u, sw=5*u;
      ctx.fillRect(i0,i0,W-2*i0,sw); ctx.fillRect(i0,H-i0-sw,W-2*i0,sw); ctx.fillRect(i0,i0,sw,H-2*i0); ctx.fillRect(W-i0-sw,i0,sw,H-2*i0);
      const side=(x0,y0,ang,L)=>{ ctx.save(); ctx.translate(x0,y0); ctx.rotate(ang);
        const n=Math.max(4,Math.round((L-2*d)/(26*u))), s=(L-2*d)/n/2;
        ctx.lineWidth=3.2*u; ctx.beginPath(); ctx.moveTo(d,d); ctx.lineTo(L-d,d); ctx.stroke();
        for (let k=0;k<n;k++){ const cx=d+(2*k+1)*s;
          ctx.beginPath(); ctx.arc(cx,d,s,Math.PI,0,true); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx,d+s*0.42,2.6*u,0,Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(cx,sw+3*u); ctx.lineTo(cx+3.6*u,(sw+d)/2+1*u); ctx.lineTo(cx,d-3*u); ctx.lineTo(cx-3.6*u,(sw+d)/2+1*u); ctx.closePath(); ctx.fill();
          ctx.lineWidth=2.6*u; ctx.beginPath(); ctx.moveTo(cx+s,sw); ctx.lineTo(cx+s,d); ctx.stroke(); ctx.lineWidth=3.2*u; }
        ctx.restore(); };
      side(i0,i0,0,W-2*i0); side(W-i0,i0,Math.PI/2,H-2*i0); side(W-i0,H-i0,Math.PI,W-2*i0); side(i0,H-i0,-Math.PI/2,H-2*i0);
      [[i0,i0,1,1],[W-i0,i0,-1,1],[W-i0,H-i0,-1,-1],[i0,H-i0,1,-1]].forEach(([x,y,sx,sy])=>{
        ctx.save(); ctx.translate(x+sx*(d+sw)/2,y+sy*(d+sw)/2); ctx.rotate(Math.atan2(sy,sx)-Math.PI/2); heart(ctx,0,-1*u,15*u); ctx.fill(); ctx.restore(); });
    }

    /** Krone um (cx,cy), Maßstab s (Pixel je Einheit) */
    function crown(cx,cy,s){
      ctx.save(); ctx.translate(cx,cy);
      for (const m of [-1,1]){ ctx.save(); ctx.scale(m,1);
        // Ranke: geschwungener Stiel vom Medaillon nach außen, am Ende eingerollt
        ctx.lineWidth=5*s; ctx.beginPath(); ctx.moveTo(70*s,8*s); ctx.bezierCurveTo(130*s,-46*s,186*s,52*s,250*s,12*s); ctx.bezierCurveTo(292*s,-14*s,318*s,-4*s,332*s,-34*s); ctx.stroke();
        ctx.lineWidth=3.4*s; ctx.beginPath(); ctx.moveTo(250*s,12*s); ctx.bezierCurveTo(268*s,44*s,300*s,52*s,312*s,30*s); ctx.arc(302*s,28*s,10*s,0,-Math.PI*1.1,true); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(116*s,-14*s); ctx.bezierCurveTo(112*s,-52*s,134*s,-70*s,154*s,-64*s); ctx.arc(150*s,-56*s,9*s,-0.5,Math.PI*1.2); ctx.stroke();
        // Blätter längs der Ranke, abwechselnd oben und unten
        const S1=[70,8,130,-46,186,52,250,12], S2=[250,12,292,-14,318,-4,332,-34];
        [[S1,0.2,-1,30],[S1,0.4,1,28],[S1,0.62,-1,30],[S1,0.84,1,26],[S2,0.45,-1,22]].forEach(([b,t,side,l])=>{ const q=bez(b,t); leaf(q[0]*s,q[1]*s,l*s,q[2]+side*52); });
        tulip(334*s,-36*s,40*s,24); tulip(156*s,-66*s,26*s,-8);
        heart(ctx,206*s,58*s,22*s); ctx.fill(); heart(ctx,320*s,40*s,14*s); ctx.fill();
        ctx.beginPath(); ctx.arc(176*s,-34*s,4.5*s,0,Math.PI*2); ctx.arc(266*s,-30*s,4*s,0,Math.PI*2); ctx.fill();
        ctx.restore(); }
      // Medaillon: gezackter Kranz, Ring, Innenlinie, Zierelement (sonst ein Herz) auf Papier
      const R=64*s;
      for (let k=0;k<24;k++){ const a=k/24*Math.PI*2; ctx.beginPath(); ctx.arc(Math.cos(a)*(R+3*s),Math.sin(a)*(R+3*s),8*s,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.fill(); ctx.fillStyle=ink;
      ctx.lineWidth=5*s; ctx.beginPath(); ctx.arc(0,0,R-2*s,0,Math.PI*2); ctx.stroke();
      ctx.lineWidth=Math.max(1,1.6*s); ctx.beginPath(); ctx.arc(0,0,R-11*s,0,Math.PI*2); ctx.stroke();
      // Tropfen unter dem Medaillon
      ctx.beginPath(); ctx.moveTo(0,R+12*s); ctx.bezierCurveTo(9*s,R+24*s,9*s,R+34*s,0,R+38*s); ctx.bezierCurveTo(-9*s,R+34*s,-9*s,R+24*s,0,R+12*s); ctx.fill();
      if (st.ornament){ const o=env.orn, os=Math.min(R*1.2,R*1.5/o.wf); o.draw(ctx,0,0,os,{a:ink,b:ink,bg,c:th.muted}); }
      else { heart(ctx,0,2*s,40*s); ctx.fill(); }
      ctx.restore();
      ctx.fillStyle=ink; ctx.strokeStyle=ink;
    }
    /** Punkt auf einer kubischen Kurve b=[x0,y0,…,x3,y3] bei t → [x, y, Richtung in Grad] */
    function bez(b,t){ const m=1-t, c=[m*m*m,3*m*m*t,3*m*t*t,t*t*t], d=[-3*m*m,3*m*m-6*m*t,6*m*t-3*t*t,3*t*t], v=(w,o)=>w.reduce((a,wi,i)=>a+wi*b[2*i+o],0);
      return [v(c,0),v(c,1),Math.atan2(v(d,1),v(d,0))*180/Math.PI]; }
    /** Blatt mit Fuß (x,y), Länge l, Richtung a Grad (0 = nach rechts) */
    function leaf(x,y,l,a){ ctx.save(); ctx.translate(x,y); ctx.rotate(a*Math.PI/180);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(l*0.45,-l*0.36,l,0); ctx.quadraticCurveTo(l*0.45,l*0.36,0,0); ctx.fill(); ctx.restore(); }
    /** Tulpe mit Fuß (x,y), Größe h, geneigt um a Grad */
    function tulip(x,y,h,a){ ctx.save(); ctx.translate(x,y); ctx.rotate(a*Math.PI/180); ctx.beginPath(); ctx.moveTo(0,0);
      ctx.bezierCurveTo(-h*0.55,-h*0.1,-h*0.52,-h*0.7,-h*0.32,-h); ctx.lineTo(-h*0.12,-h*0.64); ctx.lineTo(0,-h*1.08); ctx.lineTo(h*0.12,-h*0.64); ctx.lineTo(h*0.32,-h);
      ctx.bezierCurveTo(h*0.52,-h*0.7,h*0.55,-h*0.1,0,0); ctx.fill(); ctx.restore(); }
    /** Spitzenkranz ums Oval: kräftige Linie, außen Punkte in gleichen Abständen, innen eine Haarlinie */
    function ovalLace(ox,oy,rx,ry){
      ctx.lineWidth=5*u; ctx.beginPath(); ctx.ellipse(ox,oy,rx+6*u,ry+6*u,0,0,Math.PI*2); ctx.stroke();
      ctx.lineWidth=Math.max(1,1.5*u); ctx.beginPath(); ctx.ellipse(ox,oy,rx+28*u,ry+28*u,0,0,Math.PI*2); ctx.stroke();
      // Punkte und Bögen gleichmäßig nach Bogenlänge verteilen
      const N=360, pts=[]; let len=0, px=ox+rx+17*u, py=oy;
      for (let i=0;i<=N;i++){ const t=i/N*Math.PI*2, x=ox+(rx+17*u)*Math.cos(t), y=oy+(ry+17*u)*Math.sin(t); len+=Math.hypot(x-px,y-py); pts.push([x,y,len,t]); px=x; py=y; }
      const n=Math.round(len/(24*u)), step=len/n; let j=0;
      for (let k=0;k<n;k++){ while (pts[j][2]<k*step) j++; const [x,y,,t]=pts[j];
        ctx.beginPath(); ctx.arc(x,y,4.6*u,0,Math.PI*2); ctx.fill();
        const nx=Math.cos(t)*(rx+6*u)+ox, ny=Math.sin(t)*(ry+6*u)+oy; ctx.lineWidth=2.4*u; ctx.beginPath(); ctx.moveTo(nx,ny); ctx.lineTo(x,y); ctx.stroke(); }
    }
  }
};
