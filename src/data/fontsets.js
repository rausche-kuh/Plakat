/* ---------- Schriften ----------
   Jede Schriftwahl legt fest, welche Schrift für welche Rolle auf dem Plakat verwendet wird.
   Rollen: {f: Familie, w: Gewicht, s: 'normal'|'italic'}; title und verse zusätzlich mit
   size (Grundgröße in Plakat-Einheiten), lh (Zeilenhöhe), sp (Sperrung, nur title).
     title   Titel              verse   Bibelvers
     body    Fließtext          strong  Datum, Kasten-Überschrift
     italic  Hinweis, Schluss   hand    Handschrift (Herzlich-Layouts)
     handB   Handschrift fett   num     Datum groß (Herzlich-Layouts)
   bs           Faktor für alle übrigen Textgrößen
   italicBoost  Faktor für Einladungszeile, Hinweis und Schlusszeile
   warmTitle/warmDate/warmCard  Größen für Titel, Datum und Kasten in den Herzlich-Layouts
   css/cssW     Schrift und Gewicht der Musterkachel im Tab „Anlass“
   Neue Schriftfamilien zusätzlich im Google-Fonts-Link in index.html eintragen. */
export const FONTSETS = {
  herzlich:{name:'Herzlich',sub:'Pinsel und Handschrift',css:"'Caveat Brush'",cssW:400,
    title:{f:'Caveat Brush',w:400,s:'normal',size:104,lh:1.0,sp:0},
    verse:{f:'Kalam',w:400,s:'normal',size:31,lh:1.35},
    body:{f:'Nunito',w:600,s:'normal'}, strong:{f:'Nunito',w:800,s:'normal'},
    italic:{f:'Kalam',w:700,s:'normal'}, hand:{f:'Kalam',w:400,s:'normal'}, handB:{f:'Kalam',w:700,s:'normal'}, num:{f:'Nunito',w:900,s:'normal'},
    bs:1, italicBoost:1.1, warmTitle:136, warmDate:104, warmCard:58},
  freundlich:{name:'Freundlich',sub:'Weiche Antiqua',css:'Fraunces',cssW:600,
    title:{f:'Fraunces',w:600,s:'normal',size:84,lh:1.05,sp:0},
    verse:{f:'Fraunces',w:400,s:'italic',size:30,lh:1.4},
    body:{f:'Nunito',w:600,s:'normal'}, strong:{f:'Nunito',w:800,s:'normal'},
    italic:{f:'Fraunces',w:400,s:'italic'}, hand:{f:'Fraunces',w:400,s:'italic'}, handB:{f:'Fraunces',w:600,s:'normal'}, num:{f:'Fraunces',w:600,s:'normal'},
    bs:1, italicBoost:1.08, warmTitle:100, warmDate:88, warmCard:42},
  edel:{name:'Edel',sub:'Feine Antiqua',css:'"Cormorant Garamond"',cssW:600,
    title:{f:'Cormorant Garamond',w:600,s:'normal',size:92,lh:1.02,sp:0},
    verse:{f:'Cormorant Garamond',w:500,s:'italic',size:35,lh:1.3},
    body:{f:'Jost',w:400,s:'normal'}, strong:{f:'Jost',w:500,s:'normal'},
    italic:{f:'Cormorant Garamond',w:500,s:'italic'}, hand:{f:'Cormorant Garamond',w:500,s:'italic'}, handB:{f:'Cormorant Garamond',w:600,s:'normal'}, num:{f:'Cormorant Garamond',w:600,s:'normal'},
    bs:1, italicBoost:1.2, warmTitle:104, warmDate:90, warmCard:44},
  traditionell:{name:'Traditionell',sub:'Römische Versalien',css:'Cinzel',cssW:500,
    title:{f:'Cinzel',w:500,s:'normal',size:66,lh:1.16,sp:0.02},
    verse:{f:'EB Garamond',w:400,s:'italic',size:32,lh:1.36},
    body:{f:'EB Garamond',w:400,s:'normal'}, strong:{f:'EB Garamond',w:500,s:'normal'},
    italic:{f:'EB Garamond',w:400,s:'italic'}, hand:{f:'EB Garamond',w:400,s:'italic'}, handB:{f:'EB Garamond',w:500,s:'normal'}, num:{f:'Cinzel',w:500,s:'normal'},
    bs:1.14, italicBoost:1, warmTitle:76, warmDate:70, warmCard:36},
  warm:{name:'Schlicht',sub:'Weiche Buchschrift',css:'Lora',cssW:500,
    title:{f:'Lora',w:500,s:'normal',size:76,lh:1.1,sp:0},
    verse:{f:'Lora',w:400,s:'italic',size:28,lh:1.45},
    body:{f:'Lora',w:400,s:'normal'}, strong:{f:'Lora',w:600,s:'normal'},
    italic:{f:'Lora',w:400,s:'italic'}, hand:{f:'Lora',w:400,s:'italic'}, handB:{f:'Lora',w:600,s:'normal'}, num:{f:'Lora',w:600,s:'normal'},
    bs:0.94, italicBoost:1, warmTitle:88, warmDate:80, warmCard:40},
  klar:{name:'Klar',sub:'Ruhige Grotesk',css:'Jost',cssW:300,
    title:{f:'Jost',w:300,s:'normal',size:82,lh:1.06,sp:0},
    verse:{f:'Jost',w:300,s:'italic',size:28,lh:1.45},
    body:{f:'Jost',w:400,s:'normal'}, strong:{f:'Jost',w:500,s:'normal'},
    italic:{f:'Jost',w:300,s:'italic'}, hand:{f:'Jost',w:300,s:'italic'}, handB:{f:'Jost',w:500,s:'normal'}, num:{f:'Jost',w:500,s:'normal'},
    bs:1, italicBoost:1, warmTitle:94, warmDate:86, warmCard:40}
};
/** Rollen, deren Schriften beim Start vorgeladen werden */
export const FONT_ROLES = ['title','verse','body','strong','italic','hand','handB','num'];
