/* Anlass „Konzert“ – Zierelement: Orgelpfeifen */

export default {
  id: 'konzert',
  name: 'Konzert',
  colors: { paper: '#F7F6F2', ink: '#1E2126', accent: '#8A6837', onDark: '#D8B880', deep: '#1E2228', soft: '#E8E4DA' },
  warm: { paper: '#FAF3E8', ink: '#2C2622', a: '#A2602A', b: '#33496A' },
  texts: {
    eyebrow: 'Herzliche Einladung zur',
    title: 'Abendmusik bei Kerzenschein',
    subtitle: 'Werke von Bach, Buxtehude und Mendelssohn',
    verse: 'Singet dem Herrn ein neues Lied!',
    ref: 'Psalm 96,1',
    date: 'Samstag, 12. Dezember 2026',
    time: '19:00 Uhr',
    people: 'Anna Lehmann, Orgel\nKammerchor St. Johannis\nLeitung: Jonas Weber',
    note: 'Eintritt frei – Spenden erbeten',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      const lw=Math.max(1,s*0.016), pw=s*0.074, gap=s*0.03, n=7, total=n*pw+(n-1)*gap, x0=x-total/2, base=y+s*0.36;
      const hs=[0.44,0.56,0.68,0.78,0.68,0.56,0.44];
      c.lineWidth=lw;
      hs.forEach((h,i)=>{ const px=x0+i*(pw+gap), top=base-h*s;
        c.fillStyle=k.bg; c.fillRect(px,top,pw,h*s); c.strokeStyle=k.b; c.strokeRect(px,top,pw,h*s);
        c.strokeStyle=k.a; c.beginPath(); c.moveTo(px+pw*0.18,base-s*0.11); c.lineTo(px+pw/2,base-s*0.155); c.lineTo(px+pw*0.82,base-s*0.11); c.stroke(); });
      c.strokeStyle=k.b; c.beginPath(); c.moveTo(x0-s*0.05,base+s*0.04); c.lineTo(x0+total+s*0.05,base+s*0.04); c.stroke();
      c.beginPath(); c.moveTo(x0-s*0.08,base+s*0.08); c.lineTo(x0+total+s*0.08,base+s*0.08); c.stroke();
    },
  },
};
