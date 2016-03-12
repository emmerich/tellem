'use strict';

var ModelUpdateRequest = require('../../common/model/ModelUpdateRequest');
var ModelCreateRequest = require('../../common/model/ModelCreateRequest');
var event = require('../../common/event');
var Channel = require('../../common/model/Channel');

angular.module('tellemApp.sync', ['tellemApp.session', 'tellemApp.socket', 'tellemApp.ack'])

	// Code for listening constantly for updates to models on the server
	.run(['$rootScope', 'socket', 'acks', 'currentUser', function($rootScope, socket, acks, currentUser) {
		socket.on(event.MODEL_UPDATE, function(payload) {
			var modelUpdate = payload.data;

			// process the update
			// how to decide where to process the update. depends on the collection
			switch(modelUpdate.collection) {
				case 'users':
					var thisUser = currentUser();

					if(modelUpdate.id === thisUser._id) {
						// thisUser.subscribedChannels.push(update.data.subscribedChannels[0]);
						// update was for the current user
						Object.keys(modelUpdate.update).forEach(function(key) {
							thisUser[key] = modelUpdate.update[key];
						});
					}



					

					break;
				default:
					throw 'Unknown update collection: ' + collection;
			}

			acks.resolve(payload._ack, payload.data);

			// as we are outside of any $scope, we must force an update on the root
			$rootScope.$apply();
			// acks.forEach(function(ack) {
			// 	if(ack.ackIsForUpdate(update)) {
			// 		console.log('update was an ack');
			// 		ack.fn();
			// 		acks.remove(ack);
			// 	}
			// });
		});

		socket.on(event.MODEL_CREATE, function(payload) {
			var modelCreate = payload.data;

			switch(modelCreate.collection) {
				case 'channels':
					var channel = new Channel(modelCreate.model);
					var newChannels = $rootScope.channels.slice();
					newChannels.push(channel);
					$rootScope.channels = newChannels;

					break;
				default:
					throw 'Unknown update collection: ' + modelCreate.collection;
			}

			acks.resolve(payload._ack, payload.data);
			$rootScope.$apply();
		});
	}])

	.factory('sync', ['socket', 'acks', '$q', function(socket, acks, $q) {
		return {
			update: function(collection, id, update) {
				var request = new ModelUpdateRequest({
					id: id,
					collection: collection,
					update: update
				});
				var deferred = $q.defer();

				socket.emit(event.MODEL_UPDATE_REQUEST, {
					data: request,
					_ack: acks.create(deferred)
				});

				return deferred.promise;
			},

			create: function(collection, model) {
				var request = new ModelCreateRequest({
					collection: collection,
					model: model
				});
				var deferred = $q.defer();

				socket.emit(event.MODEL_CREATE_REQUEST, {
					data: request,
					_ack: acks.create(deferred)
				});

				return deferred.promise;
			}
		}
	}]);