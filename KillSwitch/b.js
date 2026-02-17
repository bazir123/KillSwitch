const config = {
  mode: "fixed_servers",
  rules: { singleProxy: { scheme: "http", host: "127.0.0.1", port: 9 } }
};

// Force BLOCK on load/install
const forceBlock = () => chrome.proxy.settings.set({ value: config, scope: 'regular' });
chrome.runtime.onInstalled.addListener(forceBlock);
chrome.runtime.onStartup.addListener(forceBlock);

// Handle Messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // 1. Check current status
  chrome.proxy.settings.get({ incognito: false }, (details) => {
    const isBlocked = details.value.mode === "fixed_servers";

    if (msg === "toggle") {
      // 2. If currently blocked, we CLEAR it. If allowed, we SET it.
      if (isBlocked) {
        chrome.proxy.settings.clear({ scope: 'regular' }, () => sendResponse(false));
      } else {
        chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => sendResponse(true));
      }
    } else {
      // Just return current status for the icon update
      sendResponse(isBlocked);
    }
  });
  
  return true; // Keep connection open for async response
});