'use strict';

angular.module('tellemApp.ack', [])
	
	.factory('acks', function() {

		var acks = {};

		return {
			create: function(deferred) {
				var id = (Math.random() * 1000000).toFixed(0) + '' + Date.now();
				acks[id] = deferred;
				return id;
			},

			resolve: function() {
				var values = Array.prototype.slice.call(arguments);
				var id = values.shift();
				acks[id].resolve.apply(this, values);
			}
		};
	});