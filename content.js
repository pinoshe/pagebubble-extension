(function() {
	$('body').tooltip({
		content: function() {
			return 'Some info...';
		},
		items: 'a',
		open: function(event, ui) {
			if (typeof(event.originalEvent) === 'undefined') {
				return false;
			}
			var $id = $(ui.tooltip).attr('id');
			$('div.ui-tooltip').not('#' + $id).remove();

			// ajax function to pull in data and add it to the tooltip goes here
		},
		close: function(event, ui) {
			ui.tooltip.hover(function() {
				$(this).stop(true).fadeTo(400, 1); 
			}, function() {
				$(this).fadeOut('400', function() {
					$(this).remove();
				});
			});
		}
	});
})();