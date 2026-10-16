# Plakatwerkstatt

Plakate für Gottesdienste und Veranstaltungen der Gemeinde – im Browser gestalten, als PDF drucken
oder als Bild teilen. Läuft komplett im Browser, Plakate werden lokal (IndexedDB) gespeichert.

## Starten

```sh
npm install      # einmalig (nur esbuild für den Build)
npm run dev      # → http://localhost:8000
npm run build    # → dist/plakatwerkstatt.html
```

`index.html` lädt die Quellen als ES-Module und braucht deshalb einen Webserver (`npm run dev`,
GitHub Pages o. Ä.); per Doppelklick über `file://` geht das nicht.
`npm run build` bündelt alles in **eine** HTML-Datei, die per Doppelklick funktioniert und sich
als Claude-Artefakt veröffentlichen lässt. Schriften (Google Fonts) und jsPDF kommen weiter aus dem Netz.

## Aufbau

```
index.html            Gerüst der Oberfläche (Tabs, Felder, Dialog)
css/                  theme · layout · components · responsive (in dieser Reihenfolge)
src/
  main.js             Start: Oberfläche verdrahten, Entwurf und Schriften laden
  layouts/            ein Layout pro Datei + index.js (Verzeichnis)   → README.md
  occasions/          ein Anlass pro Datei: Farben, Beispieltexte, Zierelement   → README.md
  data/
    fontsets.js       Schriftwahlen (Herzlich, Edel, …)
    ki-prompt.js      Auftrag für ChatGPT/Claude im Tab „KI-Entwurf“
  render/             Zeichnen auf dem Canvas
    poster.js         renderPoster(): baut env und ruft das Layout auf
    toolkit.js        Sammel-Export aller Zeichenhilfen für Layouts
    blocks.js         klassischer Textsatz (Gruppen setzen, automatisch verkleinern)
    warm.js           Herzlich-Baukasten (Papier, Pinsel, Handschrift)
    parts.js          Foto, Fußzeile, Rahmen
    text.js, shapes.js
  core/               ohne Oberfläche: Zustand, Farbschema, Bilder, Speicher, Dateiformat
  ui/                 ein Modul pro Tab (anlass, layout, texte, foto, ablage, ki) + preview, export, sync
scripts/              build.mjs (Einzeldatei), serve.mjs (Entwicklungsserver)
```

## Erweitern

- **Neues Layout:** [`src/layouts/README.md`](src/layouts/README.md) – eine Datei, eine Zeile im Verzeichnis.
- **Neuer Anlass:** [`src/occasions/README.md`](src/occasions/README.md) – genauso.
- **Neue Schrift:** Eintrag in `src/data/fontsets.js` und die Familie im Google-Fonts-Link in `index.html`.

Die Kennungen (`id` der Layouts und Anlässe, Schlüssel der Schriften) stehen in gespeicherten Plakaten
und Dateien – nicht umbenennen.

## Datenfluss

Der Zustand des aktuellen Plakats (`st` in `src/core/state.js`) ist ein einfaches Objekt:
Anlass, Layout, Schrift, Farbvariante, Optionen, Texte, Foto und Logo (als Data-URL).
Die Oberfläche ändert `st` und ruft `changed()` auf (`src/ui/sync.js`); das zeichnet die Vorschau neu
und sichert den Entwurf. `renderPoster(ctx, st, W)` zeichnet daraus das Plakat in beliebiger Auflösung –
für Vorschau, Miniaturen und Export gleich. Gesicherte Dateien und KI-Antworten laufen durch
`sanitize()`, unbekannte Werte fallen auf Standardwerte zurück.
