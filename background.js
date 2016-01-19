chrome.browserAction.onClicked.addListener(function(tab) {
	try {
		chrome.identity.getAuthToken({ interactive: true, scopes: ['profile'] }, function(token) { // The code below is taken from: https://groups.google.com/a/chromium.org/forum/#!topic/chromium-extensions/wbKqwWuQlDw
			var xhr = new XMLHttpRequest();
			xhr.open("GET", 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token, true);
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					console.log(JSON.parse(xhr.response));
				}
			}
			xhr.send();
		}.bind(this));
	} catch(e) {
		console.log(e);
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {				 

});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {

});
