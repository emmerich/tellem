'use strict';

angular.module('tellemApp.session', [])

	.factory('currentUser', ['$rootScope', function($rootScope) {
		return function() {
			return $rootScope.user;
		};
	}]);