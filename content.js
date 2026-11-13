// Teilenummern-Anzeige für rosepassion.com
// Liest die Porsche-Teilenummern aus den Link-Adressen und blendet sie neben dem Teilenamen ein.

(function () {
  // Icon in der Chrome-Leiste nur auf dieser Seite orange schalten
  try { chrome.runtime.sendMessage({ type: "rp-active" }); } catch (e) {}

  const DONE = "data-rp-partno";
  const LABELS = {
    de: { old: "ersetzt", copied: "kopiert", hint: "Klick: kopieren mit Leerzeichen · Shift-Klick: ohne Leerzeichen" },
    en: { old: "replaces", copied: "copied", hint: "Click: copy with spaces · Shift-click: without spaces" },
    fr: { old: "remplace", copied: "copié", hint: "Clic : copier avec espaces · Maj-clic : sans espaces" },
    es: { old: "sustituye", copied: "copiado", hint: "Clic: copiar con espacios · Mayús-clic: sin espacios" },
    it: { old: "sostituisce", copied: "copiato", hint: "Clic: copia con spazi · Maiusc-clic: senza spazi" }
  };
  const lang = (location.pathname.match(/^\/([a-z]{2})(\/|$)/) || [])[1];
  const L = LABELS[lang] || LABELS.en;

  // Erkennt Teilenummern im letzten URL-Segment:
  // 92811019825 (Porsche 11-stellig), 9000671170a / 9281104750y (Porsche mit Buchstabe),
  // n0115562 / n01152427 (Normteile), pcg51216002 (Porsche Classic), 087300035s (VW-Nummern)
  function looksLikePartNumber(t) {
    if (/^\d{11}$/.test(t)) return true;
    if (/^\d{10}[a-z]$/i.test(t)) return true;
    if (/^\d{9}[a-z]$/i.test(t)) return true;
    if (/^n\d{7,9}$/i.test(t)) return true;
    if (/^pcg\d{8}$/i.test(t)) return true;
    return false;
  }

  function formatPartNumber(token, compact) {
    const t = token.toUpperCase();
    if (compact) return t;
    if (/^\d{11}$/.test(t) || /^\d{10}[A-Z]$/.test(t)) {
      return t.slice(0, 3) + " " + t.slice(3, 6) + " " + t.slice(6, 9) + " " + t.slice(9);
    }
    if (/^N\d{7,9}$/.test(t)) {
      return t.slice(0, 1) + " " + t.slice(1, 4) + " " + t.slice(4, 7) + " " + t.slice(7);
    }
    if (/^PCG\d{8}$/.test(t)) {
      return t.slice(0, 3) + " " + t.slice(3, 6) + " " + t.slice(6, 9) + " " + t.slice(9);
    }
    return t;
  }

  // Muster: <hauptnummer>-p<id>-<name...>-<ersetzte nummern...>-<ids>
  function extractNumbers(href) {
    let path;
    try { path = new URL(href, location.href).pathname; } catch (e) { return null; }
    const last = path.split("/").filter(Boolean).pop() || "";
    const tokens = last.split("-");
    const pIndex = tokens.findIndex((t) => /^p\d+$/i.test(t));
    if (pIndex < 1) return null;
    const main = tokens[pIndex - 1];
    if (!looksLikePartNumber(main)) return null;

    const seen = new Set([main.toUpperCase()]);
    const old = [];
    for (let i = pIndex + 1; i < tokens.length; i++) {
      const t = tokens[i];
      const k = t.toUpperCase();
      if (looksLikePartNumber(t) && !seen.has(k)) { seen.add(k); old.push(t); }
    }
    return { main, old };
  }

  function flash(el, text) {
    const hint = document.createElement("span");
    hint.className = "rp-copied";
    hint.textContent = text;
    el.parentNode.appendChild(hint);
    setTimeout(() => hint.remove(), 1200);
  }

  function copy(text, el) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => flash(el, L.copied)).catch(() => fallbackCopy(text, el));
    } else {
      fallbackCopy(text, el);
    }
  }

  function fallbackCopy(text, el) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); flash(el, L.copied); } catch (e) {}
    ta.remove();
  }

  function buildBadge(info, small) {
    const wrap = document.createElement("span");
    wrap.className = "rp-partno" + (small ? " rp-small" : "");

    const main = document.createElement("span");
    main.className = "rp-main";
    main.textContent = formatPartNumber(info.main, false);
    main.title = L.hint;
    main.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      copy(formatPartNumber(info.main, ev.shiftKey), main);
    });
    wrap.appendChild(main);

    if (info.old.length) {
      const old = document.createElement("span");
      old.className = "rp-old";
      old.textContent = L.old + " " + info.old.map((t) => formatPartNumber(t, false)).join(", ");
      wrap.appendChild(old);
    }
    return wrap;
  }

  function annotate() {
    const anchors = document.querySelectorAll("a[href*='-p']");
    // Adressen, die bereits an einem Listeneintrag hängen (für Datenblatt-Links)
    const doneHrefs = new Set(
      Array.from(document.querySelectorAll("a[" + DONE + "='main']")).map((a) => a.getAttribute("href"))
    );

    // Erster Durchgang: Listeneinträge (Text beginnt mit der Rose-Passion-Nummer P12345)
    // und Hover-Popups (fetter Teilename, kein Datenblatt-Link)
    anchors.forEach((a) => {
      if (a.hasAttribute(DONE)) return;
      const href = a.getAttribute("href");
      const text = (a.textContent || "").trim();
      if (!href || !text) return;
      if (/^teil-datenblatt$|^part data ?sheet$|^fiche/i.test(text)) return;
      if (!/^P\d{3,}/.test(text) && !a.querySelector("b, strong")) return;
      const info = extractNumbers(href);
      if (!info) { a.setAttribute(DONE, "none"); return; }
      a.setAttribute(DONE, "main");
      doneHrefs.add(href);
      a.appendChild(buildBadge(info, false));
    });

    // Zweiter Durchgang: Datenblatt-Links in Kacheln, deren Teil sonst nirgends annotiert ist
    anchors.forEach((a) => {
      if (a.hasAttribute(DONE)) return;
      const href = a.getAttribute("href");
      const text = (a.textContent || "").trim();
      if (!href || !/^teil-datenblatt$|^part data ?sheet$|^fiche/i.test(text)) return;
      if (doneHrefs.has(href)) { a.setAttribute(DONE, "skip"); return; }
      const info = extractNumbers(href);
      if (!info) { a.setAttribute(DONE, "none"); return; }
      a.setAttribute(DONE, "sheet");
      doneHrefs.add(href);
      a.parentNode.insertBefore(buildBadge(info, true), a);
    });
  }

  annotate();

  // Rose Passion lädt Teile der Seite nach, deshalb weiter beobachten (entprellt, eigene Knoten ignorieren)
  let timer = null;
  const observer = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1 && !(n.classList && n.classList.contains("rp-partno")) && !(n.classList && n.classList.contains("rp-copied"))) {
          relevant = true; break;
        }
      }
      if (relevant) break;
    }
    if (!relevant) return;
    clearTimeout(timer);
    timer = setTimeout(annotate, 150);
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
