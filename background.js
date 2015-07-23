chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('Waking up!');
  chrome.tabs.executeScript({
    code: 'console.log("Hello world!")'
  });
});
