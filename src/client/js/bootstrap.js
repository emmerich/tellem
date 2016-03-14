'use strict';

var User = require('../../common/model/User');
var Channel = require('../../common/model/Channel');

angular.module('tellemApp.bootstrap', [])

	.run(['$window', '$rootScope', function($window, $rootScope) {

		var bootstrap = $window._tellem.bootstrap;

		// window._tellem.bootstrap will contain any bootstrapped data necessary
		// to run the application. Extract it here.
		$rootScope.channels = bootstrap.channels.map(function(channel) {
			return new Channel(channel);
		});

		$rootScope.user = new User(bootstrap.user);
	}]);