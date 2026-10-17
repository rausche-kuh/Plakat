/* Anlass „Erntedank“ – Zierelement: zwei Ähren */

export default {
  id: 'erntedank',
  name: 'Erntedank',
  colors: { paper: '#F8F5EC', ink: '#2C2A1E', accent: '#8E6B22', onDark: '#DFBE6E', deep: '#373D23', soft: '#ECE5CF', second: '#5E7A3E' },
  warm: { paper: '#FBF1E0', ink: '#3E2A1C', a: '#CF5F1B', b: '#557F2E' },
  texts: {
    eyebrow: 'Herzliche Einladung zum',
    title: 'Erntedankfest',
    subtitle: 'Familiengottesdienst mit Erntekrone',
    verse: 'Aller Augen warten auf dich, und du gibst ihnen ihre Speise zur rechten Zeit.',
    ref: 'Psalm 145,15',
    date: 'Sonntag, 3. Oktober 2027',
    time: '10:00 Uhr',
    people: 'Kindergarten Arche Noah\nPfarrerin Miriam Stein',
    boxTitle: 'Für die ganze Familie!',
    boxText: 'Der Kindergarten gestaltet mit – Kinder sind herzlich willkommen.',
    note: 'Gaben für die Tafel bitte bis Samstag in die Kirche bringen',
    closing: 'Wir freuen uns auf euch!',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      const ear=(ang)=>{
        c.save(); c.translate(x,y+s*0.44); c.rotate(ang); const len=s*0.86;
        c.strokeStyle=k.b; c.lineWidth=Math.max(1,s*0.016);
        c.beginPath(); c.moveTo(0,0); c.lineTo(0,-len*0.92); c.stroke();
        c.fillStyle=k.a;
        for(let i=0;i<6;i++){ const gy=-len*0.46-i*len*0.075;
          [-1,1].forEach(sd=>{ c.beginPath(); c.ellipse(sd*s*0.03,gy,s*0.021,s*0.046,sd*0.45,0,Math.PI*2); c.fill(); }); }
        c.beginPath(); c.ellipse(0,-len*0.46-6*len*0.075+s*0.01,s*0.019,s*0.044,0,0,Math.PI*2); c.fill();
        c.beginPath(); c.moveTo(0,-len*0.2); c.quadraticCurveTo(s*0.13,-len*0.27,s*0.17,-len*0.42); c.quadraticCurveTo(s*0.06,-len*0.3,0,-len*0.26); c.stroke();
        c.restore();
      };
      ear(-0.3); ear(0.3);
    },
  },
};
