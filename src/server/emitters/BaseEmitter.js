var BaseEmitter = function(params) {
	this.connections = [];
	this.eventName = params.eventName;
};

BaseEmitter.prototype.add = function(connection) {
	this.connections.push(connection);
};

BaseEmitter.prototype.remove = function(connection) {
	this.connections.splice(this.connections.indexOf(connection), 1);
};

BaseEmitter.prototype.emit = function(obj, ack) {
	this.connections.forEach(function(connection) {
		connection.socket.emit(this.eventName, {
			data: obj,
			_ack: ack
		});
	}, this);
};

module.exports = BaseEmitter;