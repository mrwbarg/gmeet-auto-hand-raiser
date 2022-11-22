chrome.tabs.onUpdated.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs.length != 0) {
      let url = tabs[0].url;
      if (url.includes("meet.google.com")) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["raise-hand.js"],
        });
      }
    }
  });
});
