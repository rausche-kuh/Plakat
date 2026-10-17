/* Anlass „Taufe“ – Zierelement: Wassertropfen über Wellen */

export default {
  id: 'taufe',
  name: 'Taufe',
  colors: { paper: '#F6F9FA', ink: '#1F2E38', accent: '#2F6E8C', onDark: '#A9D2E2', deep: '#1C3644', soft: '#E0ECF1' },
  warm: { paper: '#F2F8FA', ink: '#1F3442', a: '#2384B4', b: '#DA9E26' },
  texts: {
    eyebrow: 'Herzliche Einladung zum',
    title: 'Tauffest',
    subtitle: 'Gottesdienst mit Taufen unter freiem Himmel',
    verse: 'Fürchte dich nicht, denn ich habe dich erlöst; ich habe dich bei deinem Namen gerufen; du bist mein!',
    ref: 'Jesaja 43,1',
    date: 'Sonntag, 20. Juni 2027',
    time: '11:00 Uhr',
    people: 'Pfarrer Thomas Berger\nPosaunenchor',
    boxTitle: 'Taufe für Groß und Klein',
    boxText: 'Kinder, Jugendliche und Erwachsene können getauft werden.',
    note: 'Anmeldung zur Taufe im Gemeindebüro',
    closing: 'Wir freuen uns auf euch!',
  },
  ornament: {
    wf: 1,
    draw(c,x,y,s,k){
      const lw=Math.max(1,s*0.018); c.lineWidth=lw;
      c.beginPath(); c.moveTo(x,y-s*0.44);
      c.bezierCurveTo(x+s*0.05,y-s*0.3,x+s*0.18,y-s*0.16,x+s*0.18,y-s*0.04);
      c.bezierCurveTo(x+s*0.18,y+s*0.07,x+s*0.1,y+s*0.12,x,y+s*0.12);
      c.bezierCurveTo(x-s*0.1,y+s*0.12,x-s*0.18,y+s*0.07,x-s*0.18,y-s*0.04);
      c.bezierCurveTo(x-s*0.18,y-s*0.16,x-s*0.05,y-s*0.3,x,y-s*0.44); c.closePath();
      c.save(); c.globalAlpha*=0.2; c.fillStyle=k.a; c.fill(); c.restore();
      c.strokeStyle=k.a; c.stroke();
      for(let j=0;j<3;j++){ const wy=y+s*(0.24+j*0.085), hw=s*(0.44-j*0.08), amp=s*0.022, per=s*0.15;
        c.beginPath(); for(let t=-hw;t<=hw+0.1;t+=Math.max(0.5,s*0.01)){ const py=wy+Math.sin(t/per*Math.PI)*amp; t===-hw?c.moveTo(x+t,py):c.lineTo(x+t,py); }
        c.strokeStyle=j===0?k.a:k.b; c.stroke(); }
    },
  },
};
