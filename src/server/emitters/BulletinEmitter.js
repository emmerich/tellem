var Bulletin = require('../../common/model/Bulletin');
var BaseEmitter = require('./BaseEmitter');
var inherits = require('util').inherits;
var event = require('../../common/event');
var channels = require('../db/channels');

var BulletinEmitter = function() {
	BaseEmitter.call(this);
};
inherits(BulletinEmitter, BaseEmitter);

BulletinEmitter.prototype.emit = function(bulletinRequest, sender) {
	var bulletin = new Bulletin({
		message: bulletinRequest.message,
		icon: 'img/icon.png',
		language: 'en-GB',
		channelId: bulletinRequest.channelId,
		sender: sender.username
	});

	var _this = this;

	channels.getById(bulletin.channelId).then(function(channel) {
		if(channel.senders.indexOf(sender._id) > -1) {
			_this.connections.forEach(function(connection) {
				if(_this._userIsSubscribed(connection.user, bulletin.channelId)) {
					connection.socket.emit(event.BULLETIN, bulletin);
				} else {
					console.log('User', connection.user.username, 'is not subscribed to', channel.name);
				}
			});
		} else {
			console.log('Sender', sender.username, 'cannot send to channel', channel.name);
		}
	})	
};

BulletinEmitter.prototype._userIsSubscribed = function(user, channelId) {
	return user.subscribedChannels.indexOf(channelId) > -1;
};

module.exports = BulletinEmitter;