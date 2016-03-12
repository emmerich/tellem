'use strict';

var BulletinRequest = require('../../common/model/BulletinRequest');

angular.module('tellemApp.controllers', ['tellemApp.db', 'tellemApp.session', 'tellemApp.bulletins'])

	.controller('SideListCtrl', ['$scope', 'users', 'channels', 'currentUser',
		function($scope, users, channels, currentUser) {
			var user = currentUser();

			$scope.$watch('user.subscribedChannels', function() {
				$scope.subscribedChannels = users.getSubscribedChannels(user);
				$scope.availableChannels = channels.get().filter(function(channel) {
					return !users.isSubscribedToChannel(user, channel);
				});
			});

			$scope.subscribe = function(channelId) {
				users.subscribeToChannel(user, channelId);
			};

			$scope.unsubscribe = function(channelId) {
				users.unsubscribeFromChannel(user, channelId);
			};
		}
	])

	.controller('SendCtrl', ['$scope', 'bulletins', 'channels', function($scope, bulletins, channels) {
		$scope.channel = 'dev_updates';
		$scope.message = 'test';

		$scope.send = function() {
			var bulletinRequest = new BulletinRequest({
				message: $scope.message,
				channelId: channels.getByName($scope.channel)._id
			});

			bulletins.send(bulletinRequest);
		};
	}]);