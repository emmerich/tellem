'use strict';

/*
	The notifier is the module that handles sending notifications FROM the
	client to the server. It has nothing to do with receiving notifications
	from the server, that's done in the notification module.
 */

angular.module('tellemApp.notifier', ['tellemApp.socket'])

	.factory('notifier', ['socket', function(socket) {
		return {
			notify: function(notificationEvent) {
				console.log('off it goes', notificationEvent);
				socket.emit('notify', {
					notificationEvent: notificationEvent
				});
			}
		};
	}]);