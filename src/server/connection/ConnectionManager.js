var event = require('../../common/event');
var db = require('../db/db');

var ConnectionManager = function(params) {
	this.bulletinEmitter = params.bulletinEmitter;
	this.modelUpdateEmitter = params.modelUpdateEmitter;
	this.modelCreateEmitter = params.modelCreateEmitter;
};

ConnectionManager.prototype.manage = function(connection) {
	var socket = connection.socket;
	var user = connection.user;

	this.bulletinEmitter.add(connection);
	this.modelUpdateEmitter.add(connection);
	this.modelCreateEmitter.add(connection);

	socket.on(event.BULLETIN_REQUEST, this._handleBulletinRequest.bind(this, user));
	socket.on(event.MODEL_UPDATE_REQUEST, this._handleModelUpdateRequest.bind(this, user));
	socket.on(event.MODEL_CREATE_REQUEST, this._handleModelCreateRequest.bind(this, user));
};

ConnectionManager.prototype.unmanage = function(connection) {
	this.bulletinEmitter.remove(connection);
	connection.socket.removeAllListeners();
};

ConnectionManager.prototype._handleBulletinRequest = function(sender, payload) {
	this.bulletinEmitter.emit(payload.data, sender);
};

ConnectionManager.prototype._handleModelUpdateRequest = function(sender, payload) {
	var _this = this;

	db.update(payload.data, sender).then(function(modelUpdate) {
		_this.modelUpdateEmitter.emit(modelUpdate, payload._ack);
	});
};

ConnectionManager.prototype._handleModelCreateRequest = function(sender, payload) {
	var _this = this;

	db.create(payload.data, sender).then(function(modelCreate) {
		_this.modelCreateEmitter.emit(modelCreate, payload._ack);
	});
};

module.exports = ConnectionManager;