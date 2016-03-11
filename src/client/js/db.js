'use strict';

angular.module('tellemApp.db', ['tellemApp.sync'])

	.factory('users', ['$rootScope', 'sync', 'channels', function($rootScope, sync, channels) {

		var update = function(user, update) {
			sync.update('users', user._id, update);
		};

		return {
			getSubscribedChannels: function(user) {
				return user.subscribedChannels.map(function(channelId) {
					return channels.getById(channelId);
				});
			},

			isSubscribedToChannel: function(user, channel) {
				return user.subscribedChannels.indexOf(channel._id) > -1;
			},

			subscribeToChannel: function(user, channelId) {
				var updatedChannels = user.subscribedChannels.slice();
				updatedChannels.push(channelId);
				update(user, { subscribedChannels: updatedChannels });
			},

			unsubscribeFromChannel: function(user, channelId) {
				var updatedChannels = user.subscribedChannels.slice();
				updatedChannels.splice(updatedChannels.indexOf(channelId), 1);
				update(user, { subscribedChannels: updatedChannels });
			}
		}
	}])

	.factory('channels', ['$rootScope', function($rootScope) {
		return {
			get: function() {
				return $rootScope.channels;
			},

			getById: function(channelId) {
				return $rootScope.channels.filter(function(channel) {
					return channel._id === channelId;
				})[0];
			},

			getByName: function(name) {
				return $rootScope.channels.filter(function(channel) {
					return channel.name === name;
				})[0];
			}
		}
	}]);