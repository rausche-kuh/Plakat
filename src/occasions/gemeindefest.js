/* Anlass „Gemeindefest“ – Zierelement: Wimpelkette */

export default {
  id: 'gemeindefest',
  name: 'Gemeindefest',
  colors: { paper: '#FBF9F2', ink: '#262B22', accent: '#4E7A3F', onDark: '#E3C25B', deep: '#2C4428', soft: '#EAEFDC', second: '#D3A12F' },
  warm: { paper: '#FDF6E5', ink: '#2F2A1E', a: '#DE731B', b: '#3E8A55' },
  texts: {
    eyebrow: 'Herzliche Einladung zum',
    title: 'Gemeindefest',
    subtitle: 'Ein Tag für Groß und Klein',
    verse: 'Kommt, denn es ist alles bereit!',
    ref: 'Lukas 14,17',
    date: 'Sonntag, 4. Juli 2027',
    time: 'ab 11:00 Uhr',
    people: 'Familiengottesdienst\nMittagessen und Kuchenbuffet\nMusik vom Posaunenchor',
    boxTitle: 'Für die ganze Familie!',
    boxText: 'Hüpfburg, Kinderschminken und eine Rallye rund um die Kirche.',
    closing: 'Wir freuen uns auf euch!',
  },
  ornament: {
    wf: 1.6,
    draw(c,x,y,s,k){
      const hw=s*0.78, ay=y-s*0.2, sag=s*0.2, A=[x-hw,ay], C=[x,ay+2*sag], B=[x+hw,ay];
      c.strokeStyle=k.b; c.lineWidth=Math.max(1,s*0.014);
      c.beginPath(); c.moveTo(A[0],A[1]); c.quadraticCurveTo(C[0],C[1],B[0],B[1]); c.stroke();
      const n=8;
      for(let i=0;i<n;i++){ const t=(i+0.5)/n, u=1-t;
        const px=u*u*A[0]+2*u*t*C[0]+t*t*B[0], py=u*u*A[1]+2*u*t*C[1]+t*t*B[1];
        const tx=2*u*(C[0]-A[0])+2*t*(B[0]-C[0]), ty=2*u*(C[1]-A[1])+2*t*(B[1]-C[1]); const L=Math.hypot(tx,ty), ux=tx/L, uy=ty/L;
        const bw=s*0.075, th=s*0.21;
        c.beginPath(); c.moveTo(px-ux*bw,py-uy*bw); c.lineTo(px+ux*bw,py+uy*bw); c.lineTo(px-uy*th,py+ux*th); c.closePath();
        c.fillStyle=i%2?k.c:k.a; c.fill(); }
      c.fillStyle=k.b; [A,B].forEach(p=>{ c.beginPath(); c.arc(p[0],p[1],s*0.02,0,Math.PI*2); c.fill(); });
    },
  },
};
