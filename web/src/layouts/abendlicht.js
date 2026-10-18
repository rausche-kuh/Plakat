/* Layout „Abendlicht“ – Foto rechts, das weich in den Grund übergeht; links ein großer Titel in Versalien,
   darunter ein Wort in Schreibschrift, das in den Titel hineinragt, der Vers und der Termin auf einem
   farbigen Band mit runder Spitze. Einladung und Schlusszeile stehen gesperrt oben und unten.
   Vorbild: eine Plakatvorlage für einen Gebetsgottesdienst. „Dunkel“ ergibt den ursprünglichen Eindruck. */
import { mix, rgba, drawPhoto, measureGroup, fitDraw, footerH, drawFooter, drawFrame, inkOn, quote, textEl, warmStack, sz } from '../render/toolkit.js';

export default {
  id: 'abendlicht',
  name: 'Abendlicht',
  group: 'freundlich',
  about: 'Foto rechts, das in den Grund übergeht, großer Titel mit Schreibschrift, Termin auf farbigem Band – stimmungsvoll, gut für Abendgottesdienste',
  photo: true,
  draw(env){
    const {ctx,W,H,u,th,st,fs}=env, T=st.texts, ts=st.textScale, bs=fs.bs, f=k=>ts*sz(st,k), tr=s=>(s||'').trim();
    const m=80*u, cw=530*u, fh=footerH(env), bottom=H-56*u;

    /* gesperrte Zeilen oben (Einladung) und unten (Schluss) */
    const spaced=(k,size)=>tr(T[k])? [{type:'text',text:tr(T[k]).toUpperCase(),font:fs.strong,size:size*bs*f(k),lh:1.35,sp:0.3,color:th.ink,gap:0,balance:true}] : [];
    const eb=spaced('eyebrow',22), cl=spaced('closing',20);
    const ebH=eb.length? Math.min(measureGroup(env,eb,1,W-2*m).h,120*u) : 0, clH=cl.length? Math.min(measureGroup(env,cl,1,W-2*m).h,110*u) : 0;
    const top=ebH? 80*u+ebH : 30*u, clY=bottom-fh-(fh?30*u:0)-clH, low=clH? clY : bottom-fh-(fh?30*u:0);

    /* Foto rechts, zu den Rändern hin in den Grund ausgeblendet */
    const p={x:W*0.44,y:top+20*u,w:W*0.56,h:low-top-40*u};
    drawPhoto(env,p,'rect',{fill:th.soft});
    const fade=(x0,y0,x1,y1,rx,ry,rw,rh)=>{ const g=ctx.createLinearGradient(x0,y0,x1,y1); g.addColorStop(0,th.bg); g.addColorStop(1,rgba(th.bg,0)); ctx.fillStyle=g; ctx.fillRect(rx,ry,rw,rh); };
    // die Flächen reichen 2 px über das Foto hinaus, sonst bleibt in kleinen Vorschauen eine feine Kante stehen
    fade(p.x,0,p.x+p.w*0.62,0,p.x-2,p.y-2,p.w*0.62+2,p.h+4);
    fade(0,p.y,0,p.y+p.h*0.22,p.x-2,p.y-2,p.w+4,p.h*0.22+2);
    fade(0,p.y+p.h,0,p.y+p.h*0.7,p.x-2,p.y+p.h*0.7,p.w+4,p.h*0.3+2);

    if (ebH) fitDraw(env,eb,[],{x:m,y:80*u,w:W-2*m,h:ebH},'center','top');
    if (clH) fitDraw(env,cl,[],{x:m,y:clY,w:W-2*m,h:clH},'center','top');

    /* linke Spalte: Titel mit Schreibschrift, Vers, Termin-Band, Weiteres */
    const els=[], scr=fs.script, sSize=(scr?100:46)*f('subtitle');
    const tEl=tr(T.title)? textEl(env,{text:tr(T.title),upper:true,font:fs.title,size:fs.title.size*1.4*sz(st,'title'),lh:0.96,color:th.ink,x:m,w:cw}) : null;
    const sEl=tr(T.subtitle)? textEl(env,{text:tr(T.subtitle),font:scr||fs.handB,size:sSize,lh:scr?0.95:1.15,color:th.accent,x:m,w:cw}) : null;
    if (tEl||sEl){ let a,b,o;
      // die Schreibschrift rückt ein Stück in die letzte Titelzeile hinein, eine andere Schrift steht knapp darunter.
      // Lange Untertitel werden kleiner, bis sie höchstens etwa zwei Zeilen brauchen.
      els.push({gap:0,width:()=>cw,
        measure(k){ a=tEl?tEl.measure(k):0; let ks=k; b=sEl?sEl.measure(ks):0;
          while (sEl && b>2.2*sSize*k*u && ks>0.4*k){ ks*=0.92; b=sEl.measure(ks); }
          o=a&&b? (scr? Math.min(b,sSize*ks*u)*0.4 : -12*k*u) : 0; return a+b-o; },
        draw(y){ if (tEl) tEl.draw(y); if (sEl) sEl.draw(y+a-o); } }); }
    if (tr(T.verse)) els.push(textEl(env,{text:quote(tr(T.verse)),font:fs.verse,size:fs.verse.size*f('verse'),lh:fs.verse.lh,color:th.ink,x:m,w:cw*0.92,gap:34}));
    if (tr(T.ref)) els.push(textEl(env,{text:tr(T.ref),upper:true,font:fs.body,size:15*bs*f('ref'),lh:1.3,color:th.muted,x:m,w:cw,sp:0.14,balance:false,gap:10}));

    const fa=mix(th.accent,'#000000',0.22), fb=mix(th.accent,'#ffffff',0.14), ink=inkOn(mix(fa,fb,0.5),mix(th.deep,'#000000',0.3)), P=32*u, rw=cw-P-60*u, rows=[];
    if (tr(T.date)) rows.push(textEl(env,{text:tr(T.date),font:fs.strong,size:34*bs*f('date'),lh:1.2,color:ink,x:m+P,w:rw,balance:false}));
    if (tr(T.time)) rows.push(textEl(env,{text:tr(T.time),font:fs.strong,size:34*bs*f('time'),lh:1.2,color:ink,x:m+P,w:rw,balance:false,gap:2}));
    if (tr(T.place)) rows.push(textEl(env,{text:tr(T.place),font:fs.body,size:25*bs*f('place'),lh:1.25,color:ink,x:m+P,w:rw,gap:10}));
    if (tr(T.address)) rows.push(textEl(env,{text:tr(T.address),font:fs.body,size:21*bs*f('address'),lh:1.25,color:rgba(ink,0.85),x:m+P,w:rw,gap:2}));
    if (rows.length){ let q;
      els.push({gap:40,width:()=>q.w,
        measure(k){ let h=0; const hs=rows.map((e,i)=>{ const eh=e.measure(k); h+=eh+(i?e.gap*k*u:0); return eh; }), py=22*k*u;
          q={hs,k,py,h:h+2*py}; q.w=Math.max(...rows.map(e=>e.width()))+P+Math.max(P,q.h/2); return q.h; },
        draw(y){ const r=q.h/2, x1=m+q.w, g=ctx.createLinearGradient(m,0,x1,0); g.addColorStop(0,fa); g.addColorStop(1,fb);
          ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(m,y); ctx.lineTo(x1-r,y); ctx.arc(x1-r,y+r,r,-Math.PI/2,Math.PI/2); ctx.lineTo(m,y+q.h); ctx.closePath(); ctx.fill();
          let yy=y+q.py; rows.forEach((e,i)=>{ if (i) yy+=e.gap*q.k*u; e.draw(yy); yy+=q.hs[i]; }); } }); }

    if (tr(T.people)) els.push(textEl(env,{text:tr(T.people),font:fs.body,size:20*bs*f('people'),lh:1.45,color:th.muted,x:m,w:cw,balance:false,gap:30}));
    if (tr(T.boxTitle)) els.push(textEl(env,{text:tr(T.boxTitle),font:fs.strong,size:23*bs*f('boxTitle'),lh:1.3,color:th.ink,x:m,w:cw,gap:26}));
    if (tr(T.boxText)) els.push(textEl(env,{text:tr(T.boxText),font:fs.body,size:20*bs*f('boxText'),lh:1.45,color:th.muted,x:m,w:cw,gap:tr(T.boxTitle)?4:26}));
    if (tr(T.note)) els.push(textEl(env,{text:tr(T.note),font:fs.italic,size:21*bs*fs.italicBoost*f('note'),lh:1.35,color:th.accent,x:m,w:cw,gap:22}));
    warmStack(env,els,{x:m,y:top+40*u,w:cw,h:low-top-90*u},'center');

    drawFooter(env,m,W-2*m,bottom,'center',th.muted);
    if (st.frame) drawFrame(env,28*u,rgba(th.accent,0.85));
  }
};
