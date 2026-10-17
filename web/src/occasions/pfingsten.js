/* Anlass „Pfingsten“ – Zierelement: Flammen des Geistes */
import { flame } from '../render/shapes.js';

export default {
  id: 'pfingsten',
  name: 'Pfingsten',
  colors: { paper: '#FBF7F4', ink: '#2B1E1B', accent: '#B0352B', onDark: '#F1A774', deep: '#45201B', soft: '#F4E3DC', second: '#D98A3D' },
  warm: { paper: '#FDF3EA', ink: '#3B231C', a: '#CF3E28', b: '#E08A26' },
  texts: {
    eyebrow: 'Herzliche Einladung zum',
    title: 'Pfingstgottesdienst',
    subtitle: 'Unter freiem Himmel im Pfarrgarten',
    verse: 'Es soll nicht durch Heer oder Kraft, sondern durch meinen Geist geschehen.',
    ref: 'Sacharja 4,6',
    date: 'Pfingstsonntag, 16. Mai 2027',
    time: '10:00 Uhr',
    people: 'Pfarrerin Miriam Stein\nGospelchor der Gemeinde',
    boxTitle: 'Picknick im Grünen',
    boxText: 'Bringt gern eine Decke mit – für Getränke ist gesorgt.',
    note: 'Bei Regen in der Kirche',
    closing: 'Wir freuen uns auf euch!',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      c.fillStyle=k.a; flame(c,x,y+s*0.34,s*0.27,s*0.68); c.fill();
      c.fillStyle=k.bg; flame(c,x,y+s*0.3,s*0.1,s*0.24); c.fill();
      c.strokeStyle=k.a; c.lineWidth=Math.max(1,s*0.018);
      flame(c,x-s*0.24,y+s*0.34,s*0.16,s*0.4); c.stroke();
      flame(c,x+s*0.24,y+s*0.34,s*0.16,s*0.4); c.stroke();
    },
  },
};
