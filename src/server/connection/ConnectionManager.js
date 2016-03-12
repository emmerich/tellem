var event = require('../../common/event');
var db = require('../db/db');

var ConnectionManager = function(params) {
	this.bulletinEmitter = params.bulletinEmitter;
	this.modelUpdateEmitter = params.modelUpdateEmitter;
};

ConnectionManager.prototype.manage = function(connection) {
	var socket = connection.socket;
	var user = connection.user;

	this.bulletinEmitter.add(connection);
	this.modelUpdateEmitter.add(connection);

	socket.on(event.BULLETIN_REQUEST, this._handleBulletinRequest.bind(this, user));
	socket.on(event.MODEL_UPDATE_REQUEST, this._handleModelUpdateRequest.bind(this, user));
};

ConnectionManager.prototype.unmanage = function(connection) {
	this.bulletinEmitter.remove(connection);
	connection.socket.removeAllListeners();
};

ConnectionManager.prototype._handleBulletinRequest = function(sender, bulletinRequest) {
	this.bulletinEmitter.emit(bulletinRequest, sender);
};

ConnectionManager.prototype._handleModelUpdateRequest = function(sender, modelUpdateRequest) {
	var _this = this;

	db.update(modelUpdateRequest, sender).then(function(modelUpdate) {
		_this.modelUpdateEmitter.emit(modelUpdate);
	});
};

module.exports = ConnectionManager;