/* ---------- Farbschema ----------
   Berechnet aus Anlass, Farbvariante und Akzentfarbe die Farben, die Layouts als env.th erhalten:
   bg, ink, accent, soft, muted, line, deep, onDark, second. */
import { mix } from './color.js';
import { getOccasion } from '../occasions/index.js';

export function theme(st){
  const occ = getOccasion(st.occasion), o = occ.colors; let bg,ink,accent,soft;
  if (st.variant==='dunkel'){ bg=o.deep; ink=mix(o.paper,'#ffffff',0.4); accent=st.accent||o.onDark; soft=mix(o.deep,'#ffffff',0.07); }
  else if (st.variant==='kraeftig'){ const w=occ.warm; bg=w.paper; ink=w.ink; accent=st.accent||w.a; soft=mix(w.paper,w.a,0.12);
    return {bg,ink,accent,soft,muted:mix(ink,bg,0.34),line:mix(ink,bg,0.22),deep:mix(w.ink,'#000000',0.15),onDark:st.accent?mix(st.accent,'#ffffff',0.45):mix(w.a,'#ffffff',0.35),second:w.b}; }
  else if (st.variant==='getoent'){ bg=o.soft; ink=o.ink; accent=st.accent||o.accent; soft=mix(o.soft,o.ink,0.07); }
  else { bg=o.paper; ink=o.ink; accent=st.accent||o.accent; soft=o.soft; }
  return {bg,ink,accent,soft,muted:mix(ink,bg,0.36),line:mix(ink,bg,0.22),deep:o.deep,
    onDark: st.accent? mix(st.accent,'#ffffff',0.45) : o.onDark,
    second: o.second || mix(accent,ink,0.35)};
}
