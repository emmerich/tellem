'use strict';

angular.module('tellemApp.socket', [])

	.factory('socket', function() {
		return io();
	});