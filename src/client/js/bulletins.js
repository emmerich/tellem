'use strict';

var event = require('../../common/event');

/*
	The bulletins modules handle sending bulletin requests from client to server.
 */

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