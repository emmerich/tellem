'use strict';

var event = require('../../common/event');

angular.module('tellemApp.bulletins', ['tellemApp.socket', 'tellemApp.notifier'])

	.run(['socket', 'notifier', function(socket, notifier) {
		socket.on(event.BULLETIN, function(bulletin) {
			notifier.notify(bulletin);
		});
	}])

	.factory('bulletins', ['socket', function(socket) {
		return {
			send: function(bulletinRequest) {
				socket.emit(event.BULLETIN_REQUEST, {
					data: bulletinRequest
				});
			}
		};
	}]);