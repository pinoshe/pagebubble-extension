chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('Hello World!');
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {         
   
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
   
});
