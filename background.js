chrome.storage.session.set({ raised: 0 });
chrome.runtime.onMessage.addListener(function callback(request) {
  if (request.value) {
    chrome.storage.session.set({ raised: true });
    chrome.runtime.onMessage.removeListener(callback);
  }
});
chrome.tabs.onUpdated.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs.length != 0) {
      let url = tabs[0].url;
      chrome.storage.session.get(["raised"], function (items) {
        let parsed_url = url.split("/")[2];
        if (parsed_url === "meet.google.com" && !items.raised) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["raise-hand.js"],
          });
        }
      });
    }
  });
});
