'use strict';

// AngularJS packages are not CommonJS packages, so we don't have to assign
// a variable to anything. Actually we just require them, they come in and
// modify the global object.
require('jquery')
require('angular');
require('angular-ui-router');

require('angular-chosen-localytics/node_modules/chosen-npm/public/chosen.jquery.min');
require('angular-chosen-localytics/dist/angular-chosen.min');

require('bootstrap');
require('html5-desktop-notifications');

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
			url: '/send?{channel}',
			templateUrl: 'view/sender.html',
			controller: 'SendCtrl'
		})

		.state('channel', {
			url: '/channel',
			// Need to do this so that the child template renders
			// https://github.com/angular-ui/ui-router/issues/325
			template: '<ui-view />'
		})
			.state('channel.new', {
				url: '/new',
				templateUrl: '/view/channel.new.html',
				controller: 'NewChannelCtrl'
			})

			.state('channel.id', {
				url: '/:channelId',
				templateUrl: 'view/channel.html',
				controller: 'ChannelCtrl'
			})

			.state('channel.404', {
				url: '/404',
				templateUrl: 'view/channel.404.html'
			});
	}]);