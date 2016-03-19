'use strict';

var io = require('socket.io-client');

angular.module('tellemApp.socket', [])

	.factory('socket', [function() {
		var connection = io();

		connection.on('connect_error', function() {
			$('#connectionError').modal('show');
		});

		connection.on('connect', function() {
			$('#connectionError').modal('hide');
		});

		return connection;
	}]);