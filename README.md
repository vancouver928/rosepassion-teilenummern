# Teilenummern-Anzeige für rosepassion.com

Chrome-Erweiterung, die auf rosepassion.com die Porsche-Teilenummern direkt in der Teileliste anzeigt. Rose Passion zeigt in den Ersatzteilschemata nur die eigene Artikelnummer (P12345); die Porsche-Nummer steckt in der Link-Adresse jedes Teils. Diese Erweiterung liest sie aus und blendet sie ein, formatiert wie im Porsche-Katalog (zum Beispiel 928 110 198 25), zusammen mit den ersetzten Vorgängernummern.

Klick auf die Nummer kopiert sie in die Zwischenablage, Shift-Klick kopiert sie ohne Leerzeichen.

Funktioniert in den Schema-Listen, in den Hover-Popups am Schemabild und in den Teile-Kacheln der Kategorieseiten, in allen Sprachversionen der Seite.

## Installation

Aus dem Chrome Web Store (sobald freigegeben) oder manuell:

1. Dieses Repository als Zip herunterladen und entpacken.
2. In Chrome `chrome://extensions` öffnen, "Entwicklermodus" einschalten.
3. "Entpackte Erweiterung laden" und den entpackten Ordner wählen (der mit der manifest.json).
4. rosepassion.com neu laden.

Funktioniert auch in Edge, Brave und Arc.

## Datenschutz

Die Erweiterung sammelt keine Daten, sendet nichts an Server und läuft ausschließlich auf rosepassion.com. Details in [privacy-policy.md](privacy-policy.md).

## Rechtliches

Privates Hobbyprojekt, nicht verbunden mit Rose Passion oder Porsche. Alle Rechte vorbehalten.

## English

Chrome extension that shows the Porsche part numbers directly in the parts list on rosepassion.com. Rose Passion only shows its own article number (P12345); the Porsche number is hidden in each part's link address. This extension reads it and displays it in the Porsche catalogue format (for example 928 110 198 25), together with the superseded previous numbers. Click copies the number, shift-click copies it without spaces.

No data is collected or sent anywhere. See [privacy-policy.md](privacy-policy.md). Not affiliated with Rose Passion or Porsche. All rights reserved.

## Versionen

1.3: Das Icon in der Chrome-Leiste ist grau und wird nur auf rosepassion.com orange (kleiner Hintergrund-Teil, keine neue Berechtigung).

1.2: Klick auf das Erweiterungs-Icon öffnet ein kleines Fenster mit Spendenlink (PayPal) und Link zur Fehlermeldung. Keine neuen Berechtigungen, keine Änderung am Content-Script.

1.1: Hover-Popups und Kacheln werden mit annotiert, Shift-Klick kopiert ohne Leerzeichen, Beschriftung folgt der Seitensprache, erweiterte Nummernerkennung, Icons.
