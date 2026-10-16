/* Anlass „Konfirmation“ – Zierelement: Kreuz im Strahlenkranz */

export default {
  id: 'konfirmation',
  name: 'Konfirmation',
  colors: { paper: '#FAF8F6', ink: '#2A2324', accent: '#A3302F', onDark: '#EBB7A7', deep: '#2E2A33', soft: '#F2E6E2' },
  warm: { paper: '#FBF3EC', ink: '#33262A', a: '#C2413B', b: '#2F7AA8' },
  texts: {
    eyebrow: 'Herzliche Einladung zur',
    title: 'Konfirmation 2027',
    subtitle: 'Festgottesdienst',
    verse: 'Seid fröhlich in Hoffnung, geduldig in Trübsal, beharrlich im Gebet.',
    ref: 'Römer 12,12',
    date: 'Sonntag, 9. Mai 2027',
    time: '10:00 Uhr',
    people: 'Unsere Konfirmandinnen und Konfirmanden\nPfarrerin Miriam Stein\nBand der Jugendgruppe',
    closing: 'Feiert mit uns!',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      const lw=Math.max(1,s*0.018);
      c.strokeStyle=k.a; c.lineWidth=lw*0.7;
      for(let i=0;i<24;i++){ const a=i*Math.PI/12, r2=s*(i%2?0.36:0.44);
        c.beginPath(); c.moveTo(x+Math.cos(a)*s*0.28,y+Math.sin(a)*s*0.28); c.lineTo(x+Math.cos(a)*r2,y+Math.sin(a)*r2); c.stroke(); }
      c.lineWidth=lw; c.beginPath(); c.arc(x,y,s*0.21,0,Math.PI*2); c.stroke();
      c.strokeStyle=k.b; c.lineWidth=Math.max(1.2,s*0.03);
      c.beginPath(); c.moveTo(x,y-s*0.3); c.lineTo(x,y+s*0.3); c.moveTo(x-s*0.17,y-s*0.07); c.lineTo(x+s*0.17,y-s*0.07); c.stroke();
    },
  },
};
