var inherits = require('util').inherits;
var BaseModel = require('./BaseModel');
var ModelChange = require('./ModelChange');
var collections = require('../../common/collections');

var Channels = function(params) {
	BaseModel.call(this, params);
	
	this.users = params.users;
};
inherits(Channels, BaseModel);

Channels.prototype.delete = function(deleteRequest, ack) {
	var _this = this;
	var emitGroup = new ModelChange();

	console.log('Delete channel', deleteRequest.id);

	return this.db.delete(this.model, deleteRequest.id).then(function() {
		console.log('Delete was fine, deleting subscriptions.');
		emitGroup.delete(collections.CHANNELS, deleteRequest.id);

		var p = _this.users.deleteAllSubscriptionsForChannel(deleteRequest.id);
		
		p.then(function(users) {
			console.log('all subs deleted, affected users:', users);
			users.forEach(function(user) {
				emitGroup.update(collections.USERS, user);
			});
console.log('emitting emitGroup', emitGroup);
			_this.dbEmitter.emit(emitGroup, ack);
		});

		return p;
	});
};

module.exports = Channels;