'use strict';

var Channel = require('../../common/model/Channel');

angular.module('tellemApp.db', ['tellemApp.sync'])

	.factory('users', ['$rootScope', 'sync', 'channels', function($rootScope, sync, channels) {

		var update = function(id, update) {
			return sync.update('users', id, update);
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
				return update(user._id, { subscribedChannels: updatedChannels });
			},

			unsubscribeFromChannel: function(user, channelId) {
				var updatedChannels = user.subscribedChannels.slice();
				updatedChannels.splice(updatedChannels.indexOf(channelId), 1);
				return update(user._id, { subscribedChannels: updatedChannels });
			}
		}
	}])

	.factory('channels', ['$rootScope', 'sync', 'currentUser', function($rootScope, sync, currentUser) {
		return {
			get: function() {
				return $rootScope.channels;
			},

			getById: function(channelId) {
				return $rootScope.channels.filter(function(channel) {
					return channel._id === channelId;
				})[0] || null;
			},

			getByName: function(name) {
				return $rootScope.channels.filter(function(channel) {
					return channel.name === name;
				})[0];
			},

			create: function(name, description, senders) {
				var channel = new Channel({
					name: name,
					description: description,
					senders: senders,
					owner: currentUser()._id
				});

				return sync.create('channels', channel);
			},

			delete: function(id) {
				return sync.delete('channels', id);
			}
		}
	}]);