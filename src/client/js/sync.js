'use strict';

angular.module('tellemApp.sync', ['tellemApp.session', 'tellemApp.socket'])

	// Code for listening constantly for updates to models on the server
	.run(['$rootScope', 'socket', 'acks', 'currentUser', function($rootScope, socket, acks, currentUser) {
		socket.on('UPDATE', function(update) {
			console.log('update received', update);

			// process the update
			// how to decide where to process the update. depends on the collection
			switch(update.collection) {
				case 'users':
					var thisUser = currentUser();

					if(update.id === thisUser._id) {
						// thisUser.subscribedChannels.push(update.data.subscribedChannels[0]);
						// update was for the current user
						Object.keys(update.data).forEach(function(key) {
							thisUser[key] = update.data[key];
						});

						console.log('user after update', thisUser);
					}

					// as we are outside of any $scope, we must force an update on the root
					$rootScope.$apply();

					break;
				default:
					throw 'Unknown update collection: ' + collection;
			}

			// acks.forEach(function(ack) {
			// 	if(ack.ackIsForUpdate(update)) {
			// 		console.log('update was an ack');
			// 		ack.fn();
			// 		acks.remove(ack);
			// 	}
			// });
		});
	}])

	.factory('Ack', function() {
		var Ack = function(collection, id, data, fn) {
			this.collection = collection;
			this.id = id;
			this.data = data;
			this.fn = fn;
		};

		Ack.prototype.ackIsForUpdate = function(update) {
			return update.collection === this.collection &&
				update.id === this.id &&
				angular.equals(update.data, this.data);
		};

		Ack.prototype.equals = function(ack) {
			return this.ackIsForUpdate({
					collection: ack.collection,
					id: ack.id,
					data: ack.data
				}) && this.fn === ack.fn;
		};

		return Ack;
	})

	.factory('acks', ['Ack', function(Ack) {
		var acks = [];
		return {
			acks: acks,

			forEach: acks.forEach.bind(acks),

			add: function(collection, id, data, fn) {
				acks.push(new Ack(collection, id, data, fn));
			},

			remove: function(ack) {
				var index = acks.findIndex(function(_ack) {
					return _ack.equals(ack);
				});

				if(index > -1) {
					acks.splice(index, 1);
				}
			}
		}
	}])

	.factory('sync', ['socket', '$q', 'acks', function(socket, $q, acks) {
		return {
			update: function(collection, id, update) {
				socket.emit('UPDATE', {
					collection: collection,
					id: id,
					update: update
				});

				// return $q(function(resolve, reject) {
				// 	acks.add(collection, id, update, resolve);

				// 	socket.emit('UPDATE', {
				// 		collection: collection,
				// 		id: id,
				// 		update: update
				// 	});
				// });
			}
		}
	}]);