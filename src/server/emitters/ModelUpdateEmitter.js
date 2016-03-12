var BaseEmitter = require('./BaseEmitter');
var inherits = require('util').inherits;
var event = require('../../common/event');

var ModelUpdateEmitter = function() {
	BaseEmitter.call(this);
};
inherits(ModelUpdateEmitter, BaseEmitter);

ModelUpdateEmitter.prototype.emit = function(modelUpdate) {
	this.connections.forEach(function(connection) {
		connection.socket.emit(event.MODEL_UPDATE, modelUpdate);
	});
};

module.exports = ModelUpdateEmitter;