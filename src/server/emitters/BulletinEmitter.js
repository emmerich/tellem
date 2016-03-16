var Bulletin = require('../../common/model/Bulletin');
var DefaultEmitter = require('./DefaultEmitter');
var inherits = require('util').inherits;
var event = require('../../common/event');

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
		// check if sender is on the list
		if(sender._id === 'tellem.bot' ||
			channel.senders.indexOf(sender._id) > -1) {

			_this.connections.forEach(function(connection) {
				console.log('getting user', connection.user._id);
				_this.users.get(connection.user._id).then(function(user) {
					console.log('got user', user, bulletin, _this._userIsSubscribed);
					if(_this._userIsSubscribed(user, bulletin.channelId)) {
						connection.socket.emit(event.BULLETIN, bulletin);
					} else {
						console.log('User', connection.user.username, 'is not subscribed to', channel.name);
					}	
				});
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