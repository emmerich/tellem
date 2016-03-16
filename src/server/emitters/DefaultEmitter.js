var event = require('../../common/event');

var DefaultEmitter = function(params) {
	this.connections = [];

	this.event = params.event;
};

DefaultEmitter.prototype.add = function(connection) {
	this.connections.push(connection);
};

DefaultEmitter.prototype.remove = function(connection) {
	this.connections.splice(this.connections.indexOf(connection), 1);
};

/**
 * [emit description]
 * @param  {DBEmitGroup} emitGroup [description]
 * @return {[type]}           [description]
 */
DefaultEmitter.prototype.emit = function(data, ack) {
	this.connections.forEach(function(connection) {
		var payload = {
			data: data
		};

		if(ack !== null) {
			payload._ack = ack;
		}

		connection.socket.emit(this.event, payload);
	}, this);
};

module.exports = DefaultEmitter;