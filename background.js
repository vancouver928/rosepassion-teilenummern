// Schaltet das Erweiterungs-Icon nur auf rosepassion.com auf Orange.
// Das Content-Script meldet sich beim Laden einer Rose-Passion-Seite, der Rest bleibt grau.
const ORANGE = { 16: "icons/icon16.png", 32: "icons/icon32.png", 48: "icons/icon48.png", 128: "icons/icon128.png" };

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg && msg.type === "rp-active" && sender.tab && sender.tab.id !== undefined) {
    chrome.action.setIcon({ tabId: sender.tab.id, path: ORANGE });
  }
});
