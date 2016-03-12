'use strict';

// AngularJS packages are not CommonJS packages, so we don't have to assign
// a variable to anything. Actually we just require them, they come in and
// modify the global object.
require('angular');
require('angular-ui-router');

// Typically this is what you would see in the index.html file, but we can load
// them using CommonJS. Any order as Angular takes care of the actual dependency
// injection, here we're just making sure they're in the file.
require('./controllers');
require('./socket');
require('./sync');
require('./notifier');
require('./db');
require('./session');
require('./bulletins');
require('./bootstrap');

angular.module('tellemApp', ['ui.router', 'tellemApp.bootstrap', 'tellemApp.controllers', 'tellemApp.bulletins'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'view/home.html'
		})

		.state('send', {
			url: '/send',
			templateUrl: 'view/sender.html',
			controller: 'SendCtrl'
		});
	}]);