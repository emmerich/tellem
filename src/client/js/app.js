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
require('./ack');

angular.module('tellemApp', ['ui.router', 'tellemApp.bootstrap', 'tellemApp.controllers', 'tellemApp.bulletins'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'view/home.html'
		})

		.state('send', {
			url: '/send?{channel:int}',
			templateUrl: 'view/sender.html',
			controller: 'SendCtrl'
		})

		.state('channel', {
			url: '/channel',
			// Need to do this so that the child template renders
			// https://github.com/angular-ui/ui-router/issues/325
			template: '<ui-view />'
		})

			.state('channel.id', {
				url: '/{channelId:int}',
				templateUrl: 'view/channel.html',
				controller: 'ChannelCtrl'
			})

			.state('channel.new', {
				url: '/new',
				templateUrl: '/view/channel.new.html',
				controller: 'NewChannelCtrl'
			});
	}]);