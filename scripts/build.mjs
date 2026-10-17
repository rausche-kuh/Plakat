// Baut die ganze Werkstatt zu einer einzigen HTML-Datei: dist/plakatwerkstatt.html
// Die Datei funktioniert per Doppelklick ohne Server und lässt sich als Claude-Artefakt veröffentlichen.
// Nur die Schriften kommen aus dem Netz (Google Fonts); Plakate, Fotos und Texte verlassen nie den Browser.
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = root + 'dist/plakatwerkstatt.html';

let js = (await build({
  entryPoints: [root + 'src/main.js'], bundle: true, format: 'iife', target: 'es2020',
  minify: true, charset: 'utf8', legalComments: 'none', write: false,
})).outputFiles[0].text;
// Beispielfotos einbetten: jeder Pfad assets/beispielfotos/….webp im Skript wird zur data:-URL (fehlt die Datei, bricht der Bau ab)
const fotos = {};
for (const [p] of js.matchAll(/assets\/beispielfotos\/[\w-]+\.webp/g)) fotos[p] ??= 'data:image/webp;base64,' + (await readFile(root + p)).toString('base64');
if (!Object.keys(fotos).length) throw new Error('Keine Beispielfotos im Skript gefunden.');
js = js.replace(/assets\/beispielfotos\/[\w-]+\.webp/g, p => fotos[p]);
if (/<\/script/i.test(js)) throw new Error('Das gebündelte Skript enthält „</script“ – bitte im Quelltext umschreiben.');

let html = await readFile(root + 'index.html', 'utf8');
const links = [...html.matchAll(/<link rel="stylesheet" href="(css\/[^"]+)">\n?/g)];
if (!links.length) throw new Error('Keine Stylesheets in index.html gefunden.');
for (const [tag] of links) html = html.replace(tag, () => '');
const css = (await Promise.all(links.map(([, href]) => readFile(root + href, 'utf8')))).join('\n');
html = html.replace('</head>', () => `<style>\n${css}</style>\n</head>`);

const entry = '<script type="module" src="src/main.js"></script>';
if (!html.includes(entry)) throw new Error(`${entry} fehlt in index.html.`);
html = html.replace(entry, () => `<script>\n${js}</script>`);

await mkdir(root + 'dist', { recursive: true });
await writeFile(out, html);
console.log(`${out.slice(root.length)} (${Math.round(html.length / 1024)} KB)`);
