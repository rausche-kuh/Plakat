/* ---------- Dateiformat „plakatwerkstatt“ (Sichern, Übertragen, KI-Entwürfe) ---------- */
export const packFile = posters => new Blob([JSON.stringify({format:'plakatwerkstatt',version:1,exportedAt:new Date().toISOString(),posters},null,1)],{type:'application/json'});

/** Liest Plakate aus einer Datei: {posters:[…]}, ein einzelnes {state} oder ein nackter Zustand. */
export function posterList(data){
  if (!data || typeof data!=='object') return [];
  if (Array.isArray(data.posters)) return data.posters.filter(p=>p&&typeof p==='object');
  if (data.state) return [data];
  if (data.texts) return [{state:data}];
  return [];
}

/* ---------- Antwort der KI lesen (Dialog „KI-Entwurf“) ----------
   Gelesen wird von der ersten { bis zur letzten }, Text drumherum stört also nicht. Klappt das nicht, sagt
   `why` dem Nutzer, was am JSON nicht stimmt, wo, und was er tun kann. */
const NO_JSON = 'In der Antwort steht kein Entwurf – es fehlen die geschweiften Klammern { } des JSON. Hat die KI das JSON in ein eigenes Fenster oder eine Datei geschrieben? Dann kopieren Sie es von dort oder öffnen die Datei mit „Datei der KI öffnen“. Sonst schreiben Sie der KI: „Bitte gib das JSON als Codeblock hier im Chat aus.“';
const CUT = 'Die Antwort ist unvollständig: Das JSON hört mittendrin auf. Kopieren Sie die komplette Antwort – oder, falls die KI mittendrin aufgehört hat, schreiben Sie ihr: „Bitte gib das komplette JSON noch einmal aus.“';
const NO_POSTER = 'Das JSON ist lesbar, enthält aber keinen Plakatentwurf: Es fehlt die Liste "posters" mit "state" und "texts". Schreiben Sie der KI: „Bitte halte dich genau an das FORMAT aus dem Auftrag.“';
/** {data} mit mindestens einem Plakat, sonst {why}. */
export function readAnswer(raw){
  const a=raw.indexOf('{'), b=raw.lastIndexOf('}'), t=raw.slice(a,b>a?b+1:raw.length);
  if (a<0) return {why:NO_JSON};
  let data; try{ data=JSON.parse(t); }catch(e){
    const p=jsonProblem(t); if (!p) return {why:`Das JSON ist fehlerhaft (Meldung des Browsers: ${e.message}). Schicken Sie diese Meldung der KI und bitten Sie um ein korrigiertes JSON.`};
    if (p.cut) return {why:CUT};
    const at=a+p.at, ls=raw.lastIndexOf('\n',at-1)+1, nl=raw.indexOf('\n',at), le=nl<0?raw.length:nl, from=Math.max(ls,at-30), to=Math.min(le,at+30);
    const near=(raw.slice(ls,from).trim()?'…':'')+raw.slice(from,to).trim()+(raw.slice(to,le).trim()?'…':'');
    return {why:`Das JSON hat einen Fehler: ${p.why}.\nBetroffene Stelle: ${near}\nSchicken Sie diese Meldung der KI und bitten Sie um ein korrigiertes JSON – oder korrigieren Sie die Stelle selbst im Antwortfeld.`};
  }
  return posterList(data).length ? {data} : {why:NO_POSTER};
}
/** Erste typische Ursache, an der JSON.parse scheitert: {at, why} (at = Stelle in t), {cut} wenn das JSON vorher aufhört, sonst null. */
function jsonProblem(t){
  let depth=0, val=false, str=false, nl=false, end=0; // val: eben endete ein Wert (bei end), str: und zwar ein Text, nl: seitdem kam ein Zeilenumbruch
  for (let i=0;i<t.length;i++){
    const c=t[i];
    if (c===' '||c==='\t'||c==='\r') continue;
    if (c==='\n'){ nl=true; continue; }
    if (val&&!depth) return {at:i,why:'Nach dem Ende des JSON folgt noch mehr – vermutlich mehrere JSON-Blöcke oder Entwürfe ohne die gemeinsame Liste "posters". Alle Entwürfe gehören in EINEN Block'};
    if (val&&/["{[\w-]/.test(c)) return str&&!nl?{at:i,why:'Mitten in einem Text steht ein gerades Anführungszeichen ("). Innerhalb von Texten sind nur „ “ erlaubt'}:{at:end,why:'Hier fehlt ein Komma vor dem nächsten Eintrag'};
    if (c==='"'){
      let j=i+1; for (; j<t.length&&t[j]!=='"'; j++){ if (t[j]==='\\') j++; else if (t[j]<' ') return {at:j,why:t[j]==='\n'||t[j]==='\r'?'In einem Text steht ein echter Zeilenumbruch. Erlaubt ist nur \\n':'In einem Text steht ein Tabulator oder Steuerzeichen'}; }
      if (j>=t.length) return {cut:true};
      i=end=j; val=str=true; nl=false; continue;
    }
    if (/[\w-]/.test(c)){
      const w=/[\w.+-]+/y; w.lastIndex=i; const word=w.exec(t)[0];
      if (!/^(true|false|null|-?\d+(\.\d+)?([eE][+-]?\d+)?)$/.test(word)) return {at:i,why:`„${word}“ steht ohne Anführungszeichen`};
      i=end=i+word.length-1; val=true; str=nl=false; continue;
    }
    str=nl=false;
    if (c==='{'||c==='['){ depth++; val=false; continue; }
    if (c==='}'||c===']'){ if (--depth<0) return {at:i,why:'Hier steht eine schließende Klammer zu viel'}; val=true; end=i; continue; }
    if (c===','){ if (/^\s*[}\]]/.test(t.slice(i+1))) return {at:i,why:'Nach dem letzten Eintrag steht ein überzähliges Komma'}; val=false; continue; }
    if (c===':'){ val=false; continue; }
    if ('„“”‚‘’\'«»'.includes(c)) return {at:i,why:'Hier steht ein typografisches oder einfaches Anführungszeichen. Feldnamen und Texte müssen in geraden Anführungszeichen (") stehen'};
    if (c==='/') return {at:i,why:'Im JSON steht ein Kommentar, das ist nicht erlaubt'};
    if (c==='.'||c==='…') return {at:i,why:'Hier hat die KI etwas ausgelassen („…“). Das JSON muss vollständig ausgeschrieben sein'};
    return {at:i,why:/[\s\u200b-\u200d]/.test(c)?'Hier steht ein unsichtbares Sonderzeichen, meist vom Kopieren. Kopieren Sie die Antwort mit dem Kopier-Knopf der KI':`Unerwartetes Zeichen „${c}“`};
  }
  return depth>0?{cut:true}:null;
}

/* ---------- Link „#plakat=…“: Texte und Gestaltung ohne Foto und Logo, komprimiert im Link selbst ----------
   Der Teil nach # geht nie an den Server. Hatte das Plakat ein Foto, zeigt der Empfänger das Beispielfoto. */
const pipe = (bytes,t) => new Response(new Blob([bytes]).stream().pipeThrough(t));
export async function posterLink(s){
  const state={...s,id:undefined,photo:{...s.photo,src:null,example:!!(s.photo.src||s.photo.example)},logo:{src:null}};
  const z=new Uint8Array(await pipe(JSON.stringify({name:s.name,state}),new CompressionStream('deflate-raw')).arrayBuffer());
  let bin=''; for (const b of z) bin+=String.fromCharCode(b);
  return location.origin+location.pathname+'#plakat='+btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
/** Liest {name,state} aus location.hash; null, wenn es kein Plakat-Link ist. Wirft bei beschädigtem Link. */
export async function readLink(hash){
  const m=/^#plakat=([\w-]+)$/.exec(hash); if (!m) return null;
  const bin=atob(m[1].replace(/-/g,'+').replace(/_/g,'/'));
  return JSON.parse(await pipe(Uint8Array.from(bin,c=>c.charCodeAt(0)),new DecompressionStream('deflate-raw')).text());
}
