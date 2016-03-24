var Bulletin = require('../../common/model/Bulletin');
var DefaultEmitter = require('./DefaultEmitter');
var inherits = require('util').inherits;
var event = require('../../common/event');
var winston = require('winston');

var BulletinEmitter = function(params) {
	DefaultEmitter.call(this, { eventName: event.BULLETIN });

	this.channels = params.channels;
	this.users = params.users;
};
inherits(BulletinEmitter, DefaultEmitter);

BulletinEmitter.prototype.emit = function(bulletinRequest, sender) {
	var bulletin = new Bulletin({
		message: bulletinRequest.message,
		icon: 'img/icon.png',
		language: 'en-GB',
		channelId: bulletinRequest.channelId,
		sender: sender.username
	});

	var _this = this;

	this.channels.get(bulletin.channelId).then(function(channel) {

		if(sender.username !== 'tellem_bot') {
			winston.log('info', 'User %s is sending a bulletin with message "%s" to channel "%s".', sender.username, bulletinRequest.message, channel.name);	
		}

		// check if sender is on the list
		_this.connections.forEach(function(connection) {
			_this.users.get(connection.user._id).then(function(user) {
				if(_this._userIsSubscribed(user, bulletin.channelId)) {
					connection.socket.emit(event.BULLETIN, bulletin);
				} else {
					winston.log('info', 'User %s is not subscribed to channel %s.', connection.user.username, channel.name);
				}	
			});
		});
	})	
};

BulletinEmitter.prototype._userIsSubscribed = function(user, channelId) {
	return user.subscribedChannels.indexOf(channelId) > -1;
};

module.exports = BulletinEmitter;