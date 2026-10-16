/* Anlass „Ewigkeitssonntag“ – Zierelement: Kerze mit Lichtschein */
import { flame } from '../render/shapes.js';

export default {
  id: 'ewigkeit',
  name: 'Ewigkeitssonntag',
  quiet: true,
  colors: { paper: '#F4F4F3', ink: '#24262A', accent: '#5D5A6E', onDark: '#CBC6D8', deep: '#22252B', soft: '#E3E3E6' },
  warm: { paper: '#F4F2EF', ink: '#2B2A30', a: '#625E82', b: '#9A8460' },
  texts: {
    title: 'Ewigkeitssonntag',
    subtitle: 'Gottesdienst mit Gedenken an die Verstorbenen',
    verse: 'Gott wird abwischen alle Tränen von ihren Augen, und der Tod wird nicht mehr sein.',
    ref: 'Offenbarung 21,4',
    date: 'Sonntag, 22. November 2026',
    time: '10:00 Uhr',
    people: 'Pfarrer Thomas Berger\nAnna Lehmann, Orgel',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      const lw=Math.max(1,s*0.018); c.lineWidth=lw;
      c.save(); c.strokeStyle=k.a;
      c.globalAlpha*=0.5; c.beginPath(); c.arc(x,y-s*0.14,s*0.2,Math.PI*1.08,Math.PI*1.92); c.stroke();
      c.globalAlpha*=0.55; c.beginPath(); c.arc(x,y-s*0.14,s*0.29,Math.PI*1.12,Math.PI*1.88); c.stroke();
      c.restore();
      const cw=s*0.12, ch=s*0.4, by=y+s*0.4, ty=by-ch;
      c.fillStyle=k.bg; c.fillRect(x-cw/2,ty,cw,ch); c.strokeStyle=k.b; c.strokeRect(x-cw/2,ty,cw,ch);
      c.beginPath(); c.moveTo(x,ty); c.lineTo(x,ty-s*0.03); c.stroke();
      c.fillStyle=k.a; flame(c,x,ty-s*0.025,s*0.1,s*0.2); c.fill();
      c.beginPath(); c.moveTo(x-s*0.2,by); c.lineTo(x+s*0.2,by); c.stroke();
    },
  },
};
