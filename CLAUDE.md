# Plakatwerkstatt – Hinweise für Claude

Browser-Werkzeug für Gemeindeplakate (Canvas, ES-Module, kein Framework). Oberfläche, Kommentare und Doku auf Deutsch.

## Nur lesen, was die Aufgabe braucht

- **Neues Layout:** `src/layouts/README.md`, `src/render/toolkit.js` und ein ähnliches Layout aus der Vorlagen-Tabelle der README. Danach die Zeile in `src/layouts/index.js`. Sonst nichts.
- **Neuer Anlass:** `src/occasions/README.md` und einen bestehenden Anlass als Vorlage, dann `src/occasions/index.js`.
- **Textsatz ändern:** `src/render/blocks.js` (klassisch) bzw. `src/render/warm.js` (Herzlich). Wirkt auf mehrere Layouts – prüfen, welche es nutzen.
- **Oberfläche:** das Modul des Tabs in `src/ui/` plus die Stelle in `index.html`. Styles in `css/components.css`.
- Überblick über alle Ordner: `README.md`.

## Regeln

- Layouts und Zeichenhilfen lesen den Zustand nur über `env.st`, nie über den globalen `st` (Miniaturen rendern mit anderem Layout).
- Maße in Plakat-Einheiten mal `u` (Breite = 1000 Einheiten).
- `id`s von Layouts/Anlässen und Schlüssel der Schriften nie umbenennen – sie stehen in gespeicherten Plakaten.
- UI-Module haben keine Seiteneffekte beim Laden; alles passiert in `init…()`, aufgerufen aus `src/main.js`.
- Kompakter Stil wie im bestehenden Code (Zeichencode in dichten Zeilen), kein Build-Schritt nötig für die Entwicklung.

## Ausprobieren

`npm run dev` (http://localhost:8000); Layouts per Screenshot der Vorschau prüfen (z. B. mit Playwright). `npm run build` erzeugt `dist/plakatwerkstatt.html` (nicht eingecheckt).
