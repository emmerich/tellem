'use strict';

angular.module('tellemApp.db', ['tellemApp.sync'])

	.factory('users', ['sync', function(sync) {
		return {
			update: function(user, update) {
				sync.update('users', user._id, update);
			}
		}
	}]);