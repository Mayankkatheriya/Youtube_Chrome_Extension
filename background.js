// TODO get and send the tab details to content Script by using chrome.tab API
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  //creating unique value from tab url
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    },
    function (response) {
      if (!chrome.runtime.lastError) {
        console.log("response", response);
      } else {
        console.log(chrome.runtime.lastError);
      }
    });
  }
});