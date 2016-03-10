var TellemApp = require('./TellemApp');

window.TellemBootstrap = function() {};

window.TellemBootstrap.prototype.init = function() {
	var socket = io();
	var app = new TellemApp(socket);
	app.init();
};