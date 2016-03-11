angular.module('tellemApp.notification', ['tellemApp.socket'])

	.run(['socket', 'clientNotifier', function(socket, clientNotifier) {
		// Listen for any notification events
		socket.on('notification', function(notification) {
			console.log('notification', notification);
			clientNotifier.notify(notification);
		});
	}])


	.factory('clientNotifier', ['ChromeNotifier', function(chromeNotifier) {
		return chromeNotifier;
	}])

	.factory('ChromeNotifier', function() {
		return {
			notify: function(notiEvent) {
				var notification = notiEvent.notification;
				var channel = notiEvent.channel;

				new Notification(notification.title, {
					title: notification.title,
					dir: "auto",
					lang: notification.lang,
					body: channel.name + ': ' + notification.message,
					tag: channel.name,
					icon: notification.icon
					// onclick, onshow, onerror, onclose
				});
			}
		}
	})