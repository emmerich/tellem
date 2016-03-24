var inherits = require('util').inherits;
var BaseModel = require('./BaseModel');
var ModelChange = require('./ModelChange');
var collections = require('../../common/collections');
var q = require('q');
var winston = require('winston');

var Channels = function(params) {
	BaseModel.call(this, params);
	
	this.users = params.users;
};
inherits(Channels, BaseModel);

Channels.prototype.delete = function(deleteRequest, ack, sender) {
	var _this = this;
	var deferred = q.defer();

	this.db.findOne(this.model, { _id: deleteRequest.id }).then(function(channelToDelete) {
		if(channelToDelete.owner.equals(sender._id)) {
			var emitGroup = new ModelChange();
			winston.info('Deleting channel %s', channelToDelete.name);

			_this.db.delete(_this.model, deleteRequest.id).then(function() {
				emitGroup.delete(collections.CHANNELS, deleteRequest.id);

				var p = _this.users.deleteAllSubscriptionsForChannel(deleteRequest.id);
				
				p.then(function(users) {
					winston.info('%s users had a subscription to that channel, removing subscriptions.', users.length);
					users.forEach(function(user) {
						emitGroup.update(collections.USERS, user);
					});

					_this.dbEmitter.emit(emitGroup, ack);
					deferred.resolve(users);
				});
			});
		} else {
			// no permission to delete the channel
			deferred.reject("NO_PERMISSION");
			winston.log('warn', 'User %s tried to delete channel %s but did not have permission.', sender.username, channelToDelete.name)
		}
	});

	return deferred.promise;
};

module.exports = Channels;