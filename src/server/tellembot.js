var io = require('socket.io-client');
var event = require('../common/event');
var BulletinRequest = require('../common/model/BulletinRequest');

module.exports = function(bulletinEmitter) {

	// what can the bot do
	// send a notification in x minutes
	// send a notification every x minutes
	// send to multiple channels
	// must turn off the bot after a while to avoid spam (maybe on disconnect?)
	
	
	// setInterval(function() {
	// 	bulletinEmitter.emit(new BulletinRequest({
	// 		message: 'Test',
	// 		channelId: '56e86ecf6fd0732f20cf2f8c'
	// 	}), {
	// 		username: 'tellem.bot',
	// 		_id: 'tellem.bot'
	// 	})
	// }, 5000);
};