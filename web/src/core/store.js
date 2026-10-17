/* ---------- Speicher (IndexedDB, Notlösung im Arbeitsspeicher) ----------
   Tabellen: posters ({id,name,updated,state,thumb}) und meta (Schlüssel 'draft' = Entwurf). */
export const store = (()=>{
  let dbp=null, mem={posters:new Map(),meta:new Map()}, ok=true;
  function open(){
    if (dbp) return dbp;
    dbp=new Promise((res)=>{
      try{
        const r=indexedDB.open('plakatwerkstatt',1);
        r.onupgradeneeded=()=>{ r.result.createObjectStore('posters',{keyPath:'id'}); r.result.createObjectStore('meta'); };
        r.onsuccess=()=>res(r.result); r.onerror=()=>{ ok=false; res(null); }; r.onblocked=()=>{ ok=false; res(null); };
      }catch{ ok=false; res(null); }
    });
    return dbp;
  }
  async function tx(name,mode,fn){
    const db=await open();
    if (!db) return fn(null);
    return new Promise((res,rej)=>{ try{ const t=db.transaction(name,mode), s=t.objectStore(name); const r=fn(s); t.oncomplete=()=>res(r&&r.result!==undefined?r.result:undefined); t.onerror=()=>rej(t.error); t.onabort=()=>rej(t.error); }catch(e){ rej(e); } });
  }
  return {
    get ok(){ return ok; },
    async put(name,val,key){ const db=await open(); if(!db){ mem[name].set(key??val.id,val); return; } return tx(name,'readwrite',s=>s.put(val,key)); },
    async get(name,key){ const db=await open(); if(!db) return mem[name].get(key); return tx(name,'readonly',s=>s.get(key)); },
    async all(name){ const db=await open(); if(!db) return [...mem[name].values()]; return tx(name,'readonly',s=>s.getAll()); },
    async del(name,key){ const db=await open(); if(!db){ mem[name].delete(key); return; } return tx(name,'readwrite',s=>s.delete(key)); }
  };
})();
