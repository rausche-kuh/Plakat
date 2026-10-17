/* ---------- Beispielfotos: echte Fotos (CC0/gemeinfrei), solange kein eigenes Foto hochgeladen ist ----------
   Sie zeigen nur, wie die Gestaltung mit Foto wirkt. Herkunft und Lizenzen: assets/beispielfotos/README.md.
   focus: Stelle im Bild (0–1 waagerecht, senkrecht), um die jedes Layout den Ausschnitt legt.
   Die Pfade stehen ausgeschrieben, weil scripts/build.mjs sie durch die eingebetteten Dateien ersetzt. */
const FOTOS = {
  'kirche-innen':{name:'Kirche innen', src:'assets/beispielfotos/kirche-innen.webp', focus:[0.5,0.62]},
  'kirche-aussen':{name:'Kirche außen', src:'assets/beispielfotos/kirche-aussen.webp', focus:[0.72,0.45]},
  osterfeuer:{name:'Osterfeuer', src:'assets/beispielfotos/osterfeuer.webp', focus:[0.62,0.6]},
  beisammensein:{name:'Kaffee und Kuchen', src:'assets/beispielfotos/beisammensein.webp', focus:[0.6,0.6]},
  kerzenlicht:{name:'Kerzenlicht', src:'assets/beispielfotos/kerzenlicht.webp', focus:[0.5,0.45]},
  erntedank:{name:'Erntedank', src:'assets/beispielfotos/erntedank.webp', focus:[0.5,0.55]},
  orgel:{name:'Orgel', src:'assets/beispielfotos/orgel.webp', focus:[0.5,0.5]},
};
/** Anlass → Beispielfoto; Anlässe ohne Eintrag bekommen „Kirche außen“ */
const BY_OCC = {passion:'kirche-innen', taufe:'kirche-innen', ostern:'osterfeuer', gemeindefest:'beisammensein',
  advent:'kerzenlicht', weihnachten:'kerzenlicht', ewigkeit:'kerzenlicht', erntedank:'erntedank', konzert:'orgel'};

/** Das Beispielfoto, das der Zustand s zeigt, oder null (eigenes Foto da oder „Ohne Foto“ gewählt) */
export const exampleFor = s => s.photo.src || !s.photo.example ? null : FOTOS[BY_OCC[s.occasion]||'kirche-aussen'];
