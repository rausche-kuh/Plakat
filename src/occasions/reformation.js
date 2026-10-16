/* Anlass „Reformationstag“ – Zierelement: Lutherrose */
import { heart } from '../render/shapes.js';

export default {
  id: 'reformation',
  name: 'Reformationstag',
  colors: { paper: '#F9F7F4', ink: '#221E1D', accent: '#9C2A24', onDark: '#E7A69C', deep: '#2B1A19', soft: '#F0E3DF' },
  warm: { paper: '#FAF2EA', ink: '#2E2220', a: '#B3302A', b: '#2F4B6E' },
  texts: {
    eyebrow: 'Herzliche Einladung zum',
    title: 'Reformationstag',
    subtitle: 'Festgottesdienst mit Abendmahl',
    verse: 'Der Gerechte wird aus Glauben leben.',
    ref: 'Römer 1,17',
    date: 'Samstag, 31. Oktober 2026',
    time: '18:00 Uhr',
    people: 'Kantorei St. Johannis\nPfarrer Thomas Berger',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      const lw=Math.max(1,s*0.018); c.lineWidth=lw;
      c.strokeStyle=k.b; c.beginPath(); c.arc(x,y,s*0.45,0,Math.PI*2); c.stroke();
      c.strokeStyle=k.a;
      for(let i=0;i<5;i++){ const a=-Math.PI/2+Math.PI/5+i*2*Math.PI/5;
        c.beginPath(); c.arc(x+Math.cos(a)*s*0.22,y+Math.sin(a)*s*0.22,s*0.165,0,Math.PI*2); c.fillStyle=k.bg; c.fill(); c.stroke(); }
      c.beginPath(); c.arc(x,y,s*0.19,0,Math.PI*2); c.fillStyle=k.bg; c.fill(); c.stroke();
      c.fillStyle=k.a; heart(c,x,y+s*0.01,s*0.26); c.fill();
      c.strokeStyle=k.bg; c.lineWidth=Math.max(1,s*0.024);
      c.beginPath(); c.moveTo(x,y-s*0.07); c.lineTo(x,y+s*0.07); c.moveTo(x-s*0.045,y-s*0.03); c.lineTo(x+s*0.045,y-s*0.03); c.stroke();
    },
  },
};
