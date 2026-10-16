/* Anlass „Passion und Karfreitag“ – Zierelement: Kreuz über einem Hügel */

export default {
  id: 'passion',
  name: 'Passion und Karfreitag',
  short: 'Karfreitag',
  quiet: true,
  colors: { paper: '#F4F3F1', ink: '#1F1D20', accent: '#5B4A63', onDark: '#BCAEC3', deep: '#1E1B21', soft: '#E4E1E3' },
  warm: { paper: '#F5F1EC', ink: '#2E2830', a: '#5E4A6A', b: '#857565' },
  texts: {
    title: 'Karfreitag',
    subtitle: 'Gottesdienst zur Sterbestunde Jesu',
    verse: 'Es ist vollbracht.',
    ref: 'Johannes 19,30',
    date: 'Freitag, 26. März 2027',
    time: '15:00 Uhr',
    people: 'Pfarrer Thomas Berger\nAnna Lehmann, Orgel',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      c.strokeStyle=k.b; c.lineWidth=Math.max(1.2,s*0.032); c.lineCap='butt';
      c.beginPath(); c.moveTo(x,y-s*0.42); c.lineTo(x,y+s*0.36); c.moveTo(x-s*0.22,y-s*0.17); c.lineTo(x+s*0.22,y-s*0.17); c.stroke();
      c.strokeStyle=k.a; c.lineWidth=Math.max(1,s*0.016);
      c.beginPath(); c.moveTo(x-s*0.38,y+s*0.42); c.quadraticCurveTo(x,y+s*0.28,x+s*0.38,y+s*0.42); c.stroke();
    },
  },
};
