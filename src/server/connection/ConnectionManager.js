var event = require('../../common/event');

var ConnectionManager = function(params) {
	this.bulletinEmitter = params.bulletinEmitter;
	this.dbEmitter = params.dbEmitter;

	this.users = params.users;
	this.channels = params.channels;
};

ConnectionManager.prototype.manage = function(connection) {
	var socket = connection.socket;
	var user = connection.user;

	this.bulletinEmitter.add(connection);
	this.dbEmitter.add(connection);

	socket.on(event.BULLETIN_REQUEST, this._handleBulletinRequest.bind(this, user));
	socket.on(event.MODEL_UPDATE_REQUEST, this._handleCRUD.bind(this, user, 'update'));
	socket.on(event.MODEL_CREATE_REQUEST, this._handleCRUD.bind(this, user, 'create'));
	socket.on(event.MODEL_DELETE_REQUEST, this._handleCRUD.bind(this, user, 'delete'));
};

ConnectionManager.prototype.unmanage = function(connection) {
	this.bulletinEmitter.remove(connection);
	connection.socket.removeAllListeners();
};

ConnectionManager.prototype._handleBulletinRequest = function(sender, payload) {
	this.bulletinEmitter.emit(payload.data, sender);
};

ConnectionManager.prototype._handleCRUD = function(sender, operation, payload) {
	var request = payload.data;
	var db = this._getDB(request.collection);

	db[operation](request, payload._ack);
};

ConnectionManager.prototype._getDB = function(collection) {
	switch(collection) {
		case 'users':
			return this.users;
		case 'channels':
			return this.channels;
		default:
			throw 'Unrecognized collection: ' + collection;
	}
};

module.exports = ConnectionManager;