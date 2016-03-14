'use strict';

var BulletinRequest = require('../../common/model/BulletinRequest');

angular.module('tellemApp.controllers', ['tellemApp.db', 'tellemApp.session', 'tellemApp.bulletins'])

	.controller('SideListCtrl', ['$rootScope', '$scope', 'users', 'channels', 'currentUser',
		function($rootScope, $scope, users, channels, currentUser) {
			var user = currentUser();

			// pass the updateFn to the subscribe/unsubscribe call, instead
			// of having to update everything

			var updateFn = function(newValue, oldValue) {
				console.log('updateFn');
				$scope.subscribedChannels = users.getSubscribedChannels(user);
				$scope.availableChannels = channels.get().filter(function(channel) {
					return !users.isSubscribedToChannel(user, channel);
				});
			};	

			$scope.$watch('user.subscribedChannels', updateFn);
			$rootScope.$watch('channels', updateFn);

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

	.controller('ChannelCtrl', ['$stateParams', '$scope', '$rootScope', '$state', 'channels', 'users', 'currentUser', function($stateParams, $scope, $rootScope, $state, channels, users, currentUser) {
		var channelId = $stateParams.channelId;

		$scope.channel = channels.getById(channelId);
		$rootScope.activeChannelId = channelId;
		$scope.isOwner = $scope.channel.owner === currentUser()._id;

		$scope.unsubscribe = function(channelId) {
			users.unsubscribeFromChannel(currentUser(), channelId);
		};

		$scope.subscribe = function(channelId) {
			users.subscribeToChannel(currentUser(), channelId);
		};

		$scope.delete = function(channelId) {
			channels.delete(channelId).then(function() {
				$state.go('home');
			});
		};

		$scope.$watch('user.subscribedChannels', function() {
			$scope.subscribed = currentUser().subscribedChannels.indexOf(channelId) > -1;
		});
	}])

	.controller('NewChannelCtrl', ['$rootScope', '$scope', '$state', 'channels', 'currentUser', function($rootScope, $scope, $state, channels, currentUser) {
		$rootScope.activeChannelId = null;

		$scope.name = '';
		$scope.description = '';

		$scope.save = function() {
			channels.create($scope.name, $scope.description, [currentUser()._id]).then(function(modelChange) {
				// what if other creates were made? need to look for the proper model and get the id
				var newChannel = modelChange.creates[0].model._id;
				$state.go('channel.id', { channelId: newChannel });
			});
		};
	}]);