/* Anlass „Ostern“ – Zierelement: aufgehende Sonne über dem Horizont */

export default {
  id: 'ostern',
  name: 'Ostern',
  colors: { paper: '#FBFBF6', ink: '#2A2B24', accent: '#A9852F', onDark: '#E6CD86', deep: '#33402E', soft: '#EDF0E1', second: '#6B8A5A' },
  warm: { paper: '#FCF7E8', ink: '#3A3020', a: '#D0901A', b: '#5E9441' },
  texts: {
    eyebrow: 'Herzliche Einladung zur',
    title: 'Feier der Osternacht',
    subtitle: 'Vom Dunkel ins Licht',
    verse: 'Der Herr ist auferstanden, er ist wahrhaftig auferstanden!',
    ref: 'Lukas 24,34',
    date: 'Ostersonntag, 28. März 2027',
    time: '6:00 Uhr',
    people: 'Pfarrer Thomas Berger\nPosaunenchor',
    boxTitle: 'Osterfrühstück',
    boxText: 'Im Anschluss decken wir gemeinsam den Tisch im Gemeindehaus.',
    closing: 'Wir freuen uns auf euch!',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      const hy=y+s*0.2, lw=Math.max(1,s*0.018);
      c.lineWidth=lw; c.strokeStyle=k.b; c.beginPath(); c.moveTo(x-s*0.45,hy); c.lineTo(x+s*0.45,hy); c.stroke();
      c.beginPath(); c.arc(x,hy,s*0.16,Math.PI,0); c.closePath();
      c.save(); c.globalAlpha*=0.22; c.fillStyle=k.a; c.fill(); c.restore();
      c.strokeStyle=k.a; c.stroke();
      for(let i=0;i<11;i++){ const a=Math.PI+(i+0.5)*Math.PI/11, r2=s*(i%2?0.34:0.42);
        c.beginPath(); c.moveTo(x+Math.cos(a)*s*0.22,hy+Math.sin(a)*s*0.22); c.lineTo(x+Math.cos(a)*r2,hy+Math.sin(a)*r2); c.stroke(); }
      c.beginPath(); c.moveTo(x-s*0.3,hy+s*0.09); c.lineTo(x+s*0.3,hy+s*0.09); c.strokeStyle=k.b; c.lineWidth=lw*0.7; c.stroke();
    },
  },
};
