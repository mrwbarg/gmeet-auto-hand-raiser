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

chrome.storage.local.get(["hand_raiser_patterns"], function (items) {
  var patterns = [];
  if (items.hand_raiser_patterns) {
    patterns = JSON.parse(items.hand_raiser_patterns);
  }

  if (patterns) {
    var meetingName = getElementByXpath(
      "/html/body/div[1]/c-wiz/div[1]/div/div[13]/div[3]/div[10]/div[1]/div/div/div/span/div[1]"
    )?.innerHTML;
    patterns.forEach((pattern) => {
      if (pattern.type === "exact" && meetingName === pattern.pattern) {
        raiseHandButton.click();
      }
      if (pattern.type === "regex" && meetingName?.match(pattern.pattern)) {
        raiseHandButton.click();
      }
    });
  }
});
