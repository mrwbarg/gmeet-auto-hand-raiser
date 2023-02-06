function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

var raiseHandButton = document.querySelector(
  'button[aria-label="Raise hand (ctrl + alt + h)"]'
);

var alreadyRaised = 0;
chrome.storage.local.get(["hand_raiser_patterns"], function (items) {
  var patterns = [];
  if (items.hand_raiser_patterns) {
    patterns = JSON.parse(items.hand_raiser_patterns);
  }
  if (patterns) {
    var meetingName = getElementByXpath(
      "//div[@data-tooltip-x-position or @data-tooltip-y-position]"
    )?.innerHTML;
    patterns.forEach((pattern) => {
      if (pattern.type === "exact" && meetingName === pattern.pattern) {
        raiseHandButton.click();
        chrome.runtime.sendMessage({ value: true }, null);
        return true;
      }
      if (pattern.type === "regex" && meetingName?.match(pattern.pattern)) {
        raiseHandButton.click();
        chrome.runtime.sendMessage({ value: true }, null);
        return true;
      }
    });
  }
  return false;
});
