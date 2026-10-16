/* ---------- PDF ohne Zusatzbibliothek ----------
   Eine A4-Seite mit einem JPEG-Bild über die ganze Fläche. Mehr braucht das Plakat nicht,
   und so kommt die Werkstatt ohne Internet und ohne jsPDF aus. */

/** Text für das PDF-Info-Feld als UTF-16-Hex-String (Umlaute bleiben erhalten) */
const pdfText = s => '<FEFF'+[...s].map(ch=>{ const c=ch.codePointAt(0); if (c<0x10000) return c.toString(16).padStart(4,'0');
  const v=c-0x10000; return ((v>>10)+0xD800).toString(16)+((v&0x3FF)+0xDC00).toString(16); }).join('').toUpperCase()+'>';

/** jpeg: Bytes einer JPEG-Datei (Uint8Array), w/h: Pixelmaße; gibt ein Blob 'application/pdf' zurück */
export function jpegToPdf(jpeg,w,h,title=''){
  const PW=595.28, PH=841.89, enc=new TextEncoder(), parts=[], offs=[]; let len=0;
  const put=x=>{ const b=typeof x==='string'?enc.encode(x):x; parts.push(b); len+=b.length; };
  const obj=(n,body)=>{ offs[n]=len; put(`${n} 0 obj\n${body}\nendobj\n`); };
  put('%PDF-1.4\n%âãÏÓ\n');   // Kommentar mit Bytes > 127: kennzeichnet die Datei als binär
  obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
  obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  offs[4]=len; put(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  put(jpeg); put('\nendstream\nendobj\n');
  const cs=`q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`;
  obj(5,`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
  obj(6,`<< /Title ${pdfText(title)} /Creator ${pdfText('Plakatwerkstatt')} >>`);
  const xref=len;
  put(`xref\n0 7\n0000000000 65535 f \n${offs.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}`);
  put(`trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts,{type:'application/pdf'});
}
