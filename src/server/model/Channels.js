var inherits = require('util').inherits;
var BaseModel = require('./BaseModel');
var ModelChange = require('./ModelChange');
var collections = require('../../common/collections');
var q = require('q');

var Channels = function(params) {
	BaseModel.call(this, params);
	
	this.users = params.users;
};
inherits(Channels, BaseModel);

Channels.prototype.delete = function(deleteRequest, ack, sender) {
	var _this = this;
	var deferred = q.defer();

	console.log('Delete channel', deleteRequest.id);

	this.db.findOne(this.model, { _id: deleteRequest.id }).then(function(channelToDelete) {
		if(channelToDelete.owner.equals(sender._id)) {
			var emitGroup = new ModelChange();

			_this.db.delete(_this.model, deleteRequest.id).then(function() {
				console.log('deleted model');
				emitGroup.delete(collections.CHANNELS, deleteRequest.id);

				var p = _this.users.deleteAllSubscriptionsForChannel(deleteRequest.id);
				
				p.then(function(users) {
					users.forEach(function(user) {
						emitGroup.update(collections.USERS, user);
					});

					_this.dbEmitter.emit(emitGroup, ack);
					console.log('deleted all', users);
					deferred.resolve(users);
				});
			});
		} else {
			// no permission to delete the channel
			deferred.reject("NO_PERMISSION");
		}
	});

	return deferred.promise;
};

module.exports = Channels;