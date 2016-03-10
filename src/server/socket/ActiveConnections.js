var ActiveConnection = require('./ActiveConnection');

var ActiveConnections = function() {
	this.id = 0;
	this.connections = [];
};

ActiveConnections.prototype.createNew = function(socket, user) {
	var conn = new ActiveConnection({
		id: this.id,
		socket: socket,
		user: user
	});

	this.id++;
	this.connections[this.id] = conn;

	return conn;
};