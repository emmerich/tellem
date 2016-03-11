'use strict';

var NotificationEvent = require('../../model/NotificationEvent');
var Notification = require('../../model/Notification');

angular.module('tellemApp.controllers', ['tellemApp.db', 'tellemApp.session', 'tellemApp.notifier'])

	.controller('HomeCtrl', ['$rootScope', '$scope', 'users', 'channels', 'notifier', 'currentUser',
		function($rootScope, $scope, users, channels, notifier, currentUser) {
			var user = currentUser();

			$scope.$watch('user.subscribedChannels', function() {
				$scope.subscribedChannels = users.getSubscribedChannels(user);
				$scope.availableChannels = channels.get().filter(function(channel) {
					return !users.isSubscribedToChannel(user, channel);
				});
			});

			$scope.notificationChannel = 'dev_updates';
			$scope.notificationMessage = 'test';

			// $scope.notificationToSend = {
			// 	message: '',
			// 	channel: ''
			// };

			$scope.subscribe = function(channelId) {
				users.subscribeToChannel(currentUser(), channelId);
			};

			$scope.unsubscribe = function(channelId) {
				users.unsubscribeFromChannel(currentUser(), channelId);
			};

			$scope.info = function(channelId) {
				console.log('show info', channelId);
			};

			$scope.notify = function() {
				notifier.notify(new NotificationEvent({
					notification: new Notification({
						title: 'Test',
						message: $scope.notificationMessage,
						icon: 'img/icon.png',
						language: 'en-GB'
					}),

					channel: channels.getByName($scope.notificationChannel)
				}));
			};
		}
	]);