/* Anlass „Weihnachten“ – Zierelement: Stern von Betlehem */

export default {
  id: 'weihnachten',
  name: 'Weihnachten',
  colors: { paper: '#FBF9F4', ink: '#29251F', accent: '#A47F3B', onDark: '#DDC184', deep: '#1F2A3A', soft: '#F1EADB', second: '#7A2A30' },
  warm: { paper: '#FBF3E6', ink: '#3A2620', a: '#B0322B', b: '#2F6B45' },
  texts: {
    eyebrow: 'Herzliche Einladung zur',
    title: 'Christvesper',
    subtitle: 'Gottesdienst am Heiligen Abend',
    verse: 'Euch ist heute der Heiland geboren, welcher ist Christus, der Herr, in der Stadt Davids.',
    ref: 'Lukas 2,11',
    date: 'Donnerstag, 24. Dezember 2026',
    time: '16:00 Uhr',
    people: 'Kindergruppe der Gemeinde\nPosaunenchor\nPfarrer Thomas Berger',
    boxTitle: 'Mit Krippenspiel!',
    boxText: 'Die Kinder der Gemeinde spielen die Weihnachtsgeschichte.',
    closing: 'Wir freuen uns auf euch!',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      const cy=y-s*0.08, ri=s*0.042, R=[0.33,0.25,0.5,0.25];
      c.beginPath();
      for(let i=0;i<8;i++){ const a=-Math.PI/2+i*Math.PI/4; const r=i%2? ri : s*R[i/2]; const px=x+Math.cos(a)*r, py=cy+Math.sin(a)*r; i?c.lineTo(px,py):c.moveTo(px,py); }
      c.closePath(); c.fillStyle=k.a; c.fill();
      c.strokeStyle=k.a; c.lineWidth=Math.max(1,s*0.014);
      for(let i=0;i<4;i++){ const a=-Math.PI/4+i*Math.PI/2; c.beginPath(); c.moveTo(x+Math.cos(a)*s*0.08,cy+Math.sin(a)*s*0.08); c.lineTo(x+Math.cos(a)*s*0.19,cy+Math.sin(a)*s*0.19); c.stroke(); }
      c.fillStyle=k.b; [[-0.32,-0.3],[0.34,-0.18],[-0.24,0.2],[0.28,0.28]].forEach(([dx,dy])=>{ c.beginPath(); c.arc(x+dx*s,y+dy*s,s*0.014,0,Math.PI*2); c.fill(); });
    },
  },
};
