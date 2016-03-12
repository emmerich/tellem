angular.module('tellemApp.notifier', ['tellemApp.db'])

	.factory('notifier', ['ChromeNotifier', function(chromeNotifier) {
		return chromeNotifier;
	}])

	.factory('ChromeNotifier', ['notificationTitle', 'channels', function(notificationTitle, channels) {
		return {
			notify: function(bulletin) {
				var channel = channels.getById(bulletin.channelId);
				var title = notificationTitle.get(bulletin, channel);

				new Notification(title, {
					title: title,
					dir: "auto",
					lang: bulletin.language,
					body: bulletin.message,
					tag: channel.name,
					icon: bulletin.icon
					// onclick, onshow, onerror, onclose
				});
			}
		}
	}])

	.factory('notificationTitle', function() {
		return {
			get: function(bulletin, channel) {
				return bulletin.sender + '@' + channel.name;
			}
		};
	});