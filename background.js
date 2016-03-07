var isActive = false;

function login(callback) {
	try {
		chrome.identity.getAuthToken({ interactive: true, scopes: ['profile'] }, function(token) { // The code below is taken from: https://groups.google.com/a/chromium.org/forum/#!topic/chromium-extensions/wbKqwWuQlDw
			var xhr = new XMLHttpRequest();
			xhr.open("GET", 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token, true);
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					callback();
				}
			}
			xhr.send();
		}.bind(this));
	} catch(e) {
		console.log(e);
	}
}

function messageAllTabs(message) {
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0 ; i < tabs.length ; i++) {
			chrome.tabs.sendMessage(tabs[i].id, { type: message });
		}
	});
}

chrome.browserAction.onClicked.addListener(function(tab) {
	if (!isActive) {
		login(function() {
			chrome.tabs.sendMessage(tab.id, { type: 'activate' });
			isActive = true;
		});
	}
	else {
		messageAllTabs('deactivate');
		isActive = false;
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (isActive) {
		messageAllTabs('deactivate');
		isActive = false;
	}
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {				 
	if (isActive) {
		messageAllTabs('deactivate');
		isActive = false;
	}
});

chrome.tabs.onActivated.addListener(function(info) {
	if (isActive) {
		messageAllTabs('deactivate');
		isActive = false;
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type === 'deactivate') {
		messageAllTabs('deactivate');
		isActive = false;
	}
});