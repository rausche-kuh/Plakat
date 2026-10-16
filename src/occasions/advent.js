/* Anlass „Advent“ – Zierelement: Adventskranz mit vier Kerzen */
import { flame } from '../render/shapes.js';

export default {
  id: 'advent',
  name: 'Advent',
  colors: { paper: '#F8F6F9', ink: '#2B2438', accent: '#5E4683', onDark: '#D2BE8C', deep: '#2A2240', soft: '#E9E3EF' },
  warm: { paper: '#FBF4EE', ink: '#3A2838', a: '#7B3F8C', b: '#C38B2C' },
  texts: {
    eyebrow: 'Herzliche Einladung',
    title: 'Lichter im Advent',
    subtitle: 'Musikalische Andacht zum ersten Advent',
    verse: 'Siehe, dein König kommt zu dir, ein Gerechter und ein Helfer.',
    ref: 'Sacharja 9,9',
    date: 'Sonntag, 29. November 2026',
    time: '17:00 Uhr',
    people: 'Kirchenchor St. Johannis\nPfarrer Thomas Berger, Liturgie',
    boxTitle: 'Punsch und Gebäck',
    boxText: 'Nach der Andacht laden wir noch vor die Kirche ein.',
    closing: 'Wir freuen uns auf euch!',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      c.lineWidth=Math.max(1,s*0.02); c.strokeStyle=k.b;
      c.beginPath(); c.ellipse(x,y+s*0.3,s*0.45,s*0.1,0,0,Math.PI*2); c.stroke();
      c.beginPath(); c.ellipse(x,y+s*0.3,s*0.37,s*0.062,0,0,Math.PI*2); c.stroke();
      [-0.27,-0.09,0.09,0.27].forEach((dx,i)=>{
        const cw=s*0.072,ch=s*0.3,cx=x+dx*s,by=y+s*(i===0||i===3?0.3:0.335),ty=by-ch;
        c.fillStyle=k.bg; c.fillRect(cx-cw/2,ty,cw,ch); c.strokeRect(cx-cw/2,ty,cw,ch);
        c.beginPath(); c.moveTo(cx,ty); c.lineTo(cx,ty-s*0.025); c.stroke();
        c.fillStyle=k.a; flame(c,cx,ty-s*0.02,s*0.07,s*0.15); c.fill();
      });
    },
  },
};
