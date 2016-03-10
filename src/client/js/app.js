'use strict';

var tellemApp = angular.module('tellemApp', ['tellemApp.controllers', 'tellemApp.notification', 'ngRoute']);

tellemApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'HomeCtrl',
		templateUrl: 'view/home.html'
	})
	.otherwise({ redirectTo: '/' });
}]);