var socket = (function() {

	function socketFactory(options) {
		options = options || {};
		var socket = options.ioSocket || io.connect();
		var prefix = 'socket:';

		var addListener = function (eventName, callback) {
			socket.on(eventName, callback);
		};

		var addOnceListener = function (eventName, callback) {
			socket.once(eventName, callback);
		};

		var wrappedSocket = {
			on: addListener,
			addListener: addListener,
			once: addOnceListener,

			removeListener: function (ev, fn) {
				if (fn) {
					arguments[1] = fn;
				}
				return socket.removeListener.apply(socket, arguments);
			},

			removeAllListeners: function() {
				return socket.removeAllListeners.apply(socket, arguments);
			},

			disconnect: function (close) {
				return socket.disconnect(close);
			}
		};

		return wrappedSocket;
	}

	var socket = socketFactory({
		ioSocket: io('ws://pagebubble.com', {
			path: '/socket.io-client'
		})
	});

	return {
		socket: socket,

		syncUpdates: function (modelName, array, cb) {
			cb = cb || function() {};

			socket.on(modelName + ':save', function (item) {
				var oldItem = _.find(array, {_id: item._id});
				var index = array.indexOf(oldItem);
				var event = 'created';

				// replace oldItem if it exists
				// otherwise just add item to the collection
				if (oldItem) {
					array.splice(index, 1, item);
					event = 'updated';
				} else {
					array.push(item);
				}

				cb(event, item, array);
			});

			socket.on(modelName + ':remove', function (item) {
				var event = 'deleted';
				_.remove(array, {_id: item._id});
				cb(event, item, array);
			});
		},

		unsyncUpdates: function (modelName) {
			socket.removeAllListeners(modelName + ':save');
			socket.removeAllListeners(modelName + ':remove');
		}
	};
})();