'use strict';


angular.module('tellemApp.controllers', ['tellemApp.db', 'tellemApp.session'])

	.controller('TellemCtrl', ['$rootScope', '$window', function ($rootScope, $window) {
		var bootstrap = $window._tellem.bootstrap;

		// window._tellem.bootstrap will contain any bootstrapped data necessary
		// to run the application. Extract it here.
		$rootScope.subscribedChannelIds = bootstrap.subscribedChannelIds;
		$rootScope.channels = bootstrap.channels;
		$rootScope.user = bootstrap.user;
	}])

	.controller('HomeCtrl', ['$scope', 'users', 'currentUser',
		function($scope, users, currentUser) {
			$scope.subscribe = function(channelId) {
				var user = currentUser();
				var updatedChannels = user.channels.slice();
				updatedChannels.push(channelId);
				users.update(user, { channels: updatedChannels });
			};

			$scope.unsubscribe = function(channelId) {
				// debugger;
				var user = currentUser();
				var updatedChannels = user.channels.slice();
				updatedChannels.splice(user.channels.indexOf(channelId), 1);
				users.update(user, { channels: updatedChannels });
			};

			$scope.info = function(channelId) {
				console.log('show info', channelId);
			};
		}
	]);