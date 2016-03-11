'use strict';

var io = require('socket.io-client');

angular.module('tellemApp.socket', [])

	.factory('socket', function() {
		return io();
	});