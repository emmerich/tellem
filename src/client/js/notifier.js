var notification = require('html5-desktop-notifications');

angular.module('tellemApp.notifier', ['tellemApp.db'])

	.factory('notifier', ['notificationTitle', 'channels', function(notificationTitle, channels) {
		return {
			notify: function(bulletin) {
				var channel = channels.getById(bulletin.channelId);
				var title = notificationTitle.get(bulletin, channel);

				var notification = notify.createNotification(title, {
					title: title,
					body: bulletin.message,
					icon: bulletin.icon,
					tag: channel._id
				});
			}
		};
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
				return '#' + channel.name + ' (from ' + bulletin.sender + ')';
			}
		};
	});