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

	.controller('SendCtrl', ['$stateParams', '$scope', '$rootScope', 'bulletins', 'channels', function($stateParams, $scope, $rootScope, bulletins, channels) {
		$rootScope.activeChannelId = null;

		var preDefinedChannel = $stateParams.channel;

		if(Array.isArray(preDefinedChannel)) {
			console.log('Send page doesnt yet support multiple channels in the URL (', preDefinedChannel ,') - picked the first one.');
			$scope.channel = channels.getById(preDefinedChannel[0]).name;
		} else if(preDefinedChannel === undefined) {
			$scope.channel = '';
		} else {
			$scope.channel = channels.getById(preDefinedChannel).name;
		}
		
		$scope.message = 'test';

		$scope.send = function() {
			var bulletinRequest = new BulletinRequest({
				message: $scope.message,
				channelId: channels.getByName($scope.channel)._id
			});

			bulletins.send(bulletinRequest);
		};
	}])

	.controller('ChannelCtrl', ['$stateParams', '$scope', '$rootScope', 'channels', 'users', 'currentUser', function($stateParams, $scope, $rootScope, channels, users, currentUser) {
		var channelId = $stateParams.channelId;

		$scope.channel = channels.getById(channelId);
		
		$rootScope.activeChannelId = channelId;

		$scope.unsubscribe = function(channelId) {
			users.unsubscribeFromChannel(currentUser(), channelId);
		};

		$scope.subscribe = function(channelId) {
			users.subscribeToChannel(currentUser(), channelId);
		};

		$scope.$watch('user.subscribedChannels', function() {
			$scope.subscribed = currentUser().subscribedChannels.indexOf(channelId) > -1;
		});

	}]);