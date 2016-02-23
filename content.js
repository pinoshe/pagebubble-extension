function login() {
	var notifications = [],
		removePanelTimeout,
		targetUrl = '',
		hoverApplied = false;

	function applyNotificationsBadge() {
		$('a, img').each(function() {
			var notificationsCount = 0;
				i = notifications.length;
			while(i--) {
				if (notifications[i].data.targetUrl === (this.href || this.src)) {
					notificationsCount++;
				}
			}
			if (notificationsCount > 0) {
				$(this).attr('data-pagebubble-after-text', notificationsCount);
			}
		});
	}

	function stopHighlighting(target) {
		targetUrl = '';
		$('pagebubblewrapper, pagebubbleforeground').removeAttr('style');
	}

	$.ajax({
		type: "GET",
		contentType: 'application/json',
		dataType: 'json',
		url: "https://pagebubble.com/api/notifications",
		success: function (response) {
			notifications = response;
			applyNotificationsBadge();

			socket.syncUpdates('notification', notifications, function(event, item, array) {
				// console.log('Notifications array is updated! Now it looks like this:');
				// console.log(array);

				applyNotificationsBadge();
			});
		},
		error: function (xhr, ajaxOptions, thrownError) {}
	});

	$('body').append('<pagebubblewrapper><pagebubblelikebtn style="background: url(' + chrome.extension.getURL('lib/images/like.png') + ');"></pagebubblelikebtn><pagebubbledislikebtn style="background: url(' + chrome.extension.getURL('lib/images/dislike.png') + ');"></pagebubbledislikebtn></pagebubblewrapper><pagebubbleforeground></pagebubbleforeground>')

	$('a, img').hover(
		function(e) {
			if (hoverApplied) {
				return;
			}

			hoverApplied = true;
			setTimeout(function() {
				hoverApplied = false;
			}, 100);

			var offset = $(this).offset(),
				offsetParent = $(this).offsetParent(),
				isPositioned = offsetParent[0] !== $('html')[0],
				height = $(this).height(),
				width = $(this).width();

			if (e.target.tagName.toUpperCase() === 'IMG' && height && width) {
				$('pagebubbleforeground').attr('style', 'display: block; height: ' + height + 'px; left: ' + offset.left + 'px; top: ' + offset.top + 'px; width: ' + width + 'px;');
			}

			targetUrl = this.href || this.src;

			$('pagebubblewrapper').attr('style', 'display: block; left: ' + (e.target.tagName.toUpperCase() !== 'IMG' && (isPositioned || offset.left + offsetParent.left - 32 < 0) ? e.pageX - 64 : offset.left - 32) + 'px; top: ' + (e.target.tagName.toUpperCase() !== 'IMG' && isPositioned ? e.pageY - 12 : offset.top) + 'px;');

			clearTimeout(removePanelTimeout);
			removePanelTimeout = setTimeout(function() {
				stopHighlighting(e.target);
			}, 2000);
		},
		function(e) {
			
		}
	);

	$('pagebubblewrapper').hover(
		function(e) {
			clearTimeout(removePanelTimeout);
		},
		function(e) {
			stopHighlighting(e.target);
		}
	);

	$('pagebubblelikebtn').click(function() {
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			url: "https://pagebubble.com/api/notifications",
			data: JSON.stringify({
				name: 'like',
				data: {
					targetUrl: targetUrl
				},
				originUrl: window.location.href

			}),
			success: function (response) {},
			error: function (xhr, ajaxOptions, thrownError) {}
		});
	});

	$('pagebubbledislikebtn').click(function() {
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			url: "https://pagebubble.com/api/notifications",
			data: JSON.stringify({
				name: 'dislike',
				data: {
					targetUrl: targetUrl
				},
				originUrl: window.location.href
			}),
			success: function (response) {},
			error: function (xhr, ajaxOptions, thrownError) {}
		});
	});
}

chrome.runtime.onMessage.addListener(
	function(request, sender) {
		switch(request.type) {
		case 'login':
			login();
			break;
		}
	});