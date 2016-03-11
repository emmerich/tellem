'use strict';

// AngularJS packages are not CommonJS packages, so we don't have to assign
// a variable to anything. Actually we just require them, they come in and
// modify the global object.
require('angular');
require('angular-route');

angular.module('tellemApp', ['ngRoute', 'tellemApp.bootstrap', 'tellemApp.controllers', 'tellemApp.notification'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			controller: 'HomeCtrl',
			templateUrl: 'view/home.html'
		})
		.otherwise({ redirectTo: '/' });
	}]);

// Typically this is what you would see in the index.html file, but we can load
// them using CommonJS. Any order as Angular takes care of the actual dependency
// injection, here we're just making sure they're in the file.
require('./controllers');
require('./socket');
require('./sync');
require('./notification');
require('./db');
require('./session');
require('./notifier');
require('./bootstrap');