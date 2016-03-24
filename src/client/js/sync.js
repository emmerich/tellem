'use strict';

var ModelUpdateRequest = require('../../common/model/ModelUpdateRequest');
var ModelCreateRequest = require('../../common/model/ModelCreateRequest');
var ModelDeleteRequest = require('../../common/model/ModelDeleteRequest');
var event = require('../../common/event');
var Channel = require('../../common/model/Channel');

angular.module('tellemApp.sync', ['tellemApp.session', 'tellemApp.socket', 'tellemApp.ack'])

	// Code for listening constantly for updates to models on the server
	.run(['$rootScope', 'socket', 'acks', 'currentUser', function($rootScope, socket, acks, currentUser) {
		var getCollection = function(name) {
			switch(name) {
				case 'channels':
					return $rootScope.channels;
				case 'users':
					throw 'Tried to get users collection, but at the moment we only store one user';
				default:
					throw 'Unrecognized collection: ' + name;
			}
		};

		var setCollection = function(name, collection) {
			switch(name) {
				case 'channels':
					$rootScope.channels = collection;
					break;
				case 'users':
					throw 'Tried to get users collection, but at the moment we only store one user';
				default:
					throw 'Unrecognized collection: ' + name;
			}
		};

		socket.on(event.DB_UPDATE, function(payload) {
			var modelChange = payload.data;
			var ack = payload._ack;

			modelChange.updates.forEach(function(update) {
				if(update.collection === 'users') {
					var curr = currentUser();

					if(curr._id === update.model._id) {
						Object.keys(update.model).forEach(function(key) {
							curr[key] = update.model[key];
						});
					}
				} else {
					throw 'Update collection ' + update.collection + ' not yet implemented.';
				}
			});

			modelChange.creates.forEach(function(create) {
				var collection = getCollection(create.collection);
				var newCollection = collection.slice();
				newCollection.push(create.model);
				setCollection(create.collection, newCollection);
			});

			modelChange.deletes.forEach(function(deleteObj) {
				var collection = getCollection(deleteObj.collection);
				var index = collection.findIndex(function(obj) {
					return obj._id === deleteObj.id;
				});

				if(index > -1) {
					var newCollection = collection.slice();
					newCollection.splice(index, 1);
					setCollection(deleteObj.collection, newCollection);
				} else {
					// something went wrong, the index wasn't in the collection
					console.error('Tried to delete id', deleteObj.id, 'from collection', deleteObj.collection, 'but the id wasnt in the collection');
				}
			});

			acks.resolve(ack, modelChange);

			// a bit hacky, making the entire digest run. Maybe have updates
			// done on ack.done
			$rootScope.$apply();
		});
	}])

	.factory('sync', ['socket', 'acks', '$q', function(socket, acks, $q) {
		var emit = function(requestConstructor, event, params) {
			var request = new requestConstructor(params);
			var deferred = $q.defer();
			socket.emit(event, {
				data: request,
				_ack: acks.create(deferred)
			});

			return deferred.promise;
		};

		return {
			update: function(collection, id, update) {
				return emit(ModelUpdateRequest, event.MODEL_UPDATE_REQUEST, {
					id: id,
					collection: collection,
					update: update
				});
			},

			create: function(collection, model) {
				return emit(ModelCreateRequest, event.MODEL_CREATE_REQUEST, {
					collection: collection,
					model: model
				});
			},

			delete: function(collection, id) {
				return emit(ModelDeleteRequest, event.MODEL_DELETE_REQUEST, {
					collection: collection,
					id: id
				});
			}
		}
	}]);