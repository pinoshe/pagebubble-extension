(function() {
	var notifications = [],
		removePanelTimeout;

	socket.syncUpdates('notification', notifications, function(event, item, array) {
		console.log('Notifications array is updated! Now it looks like this:');
		console.log(array);
	});

	$('body').append('<pagebubblewrapper><pagebubblelikebtn style="background: url(' + chrome.extension.getURL('lib/images/like.png') + ');"></pagebubblelikebtn><pagebubbledislikebtn style="background: url(' + chrome.extension.getURL('lib/images/dislike.png') + ');"></pagebubbledislikebtn></pagebubblewrapper>')

	$('a').hover(
		function(e) {
			var offset = $(this).offset(),
				offsetParent = $(this).offsetParent(),
				isPositioned = offsetParent[0] !== $('html')[0];

			$('pagebubblewrapper').attr('style', 'display: block; left: ' + (isPositioned || offset.left + offsetParent.left - 32 < 0 ? e.pageX - 64 : offset.left - 32) + 'px; top: ' + (isPositioned ? e.pageY - 12 : offset.top) + 'px;');

			clearTimeout(removePanelTimeout);
			removePanelTimeout = setTimeout(function() {
				$('pagebubblewrapper').removeAttr('style');
			}, 500);
		},
		function(e) {
			
		}
	);

	$('pagebubblewrapper').hover(
		function(e) {
			clearTimeout(removePanelTimeout);
		},
		function(e) {
			$('pagebubblewrapper').removeAttr('style');
		}
	);
})();