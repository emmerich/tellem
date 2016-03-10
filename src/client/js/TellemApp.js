var NotificationEventHandler = require('./NotificationEventHandler');
var getNotifierInstance = require('./getNotifierInstance');

var TellemApp = function(socket) {
	this.socket = socket;
	this.notifier = getNotifierInstance();
	this.notificationEventHandler = new NotificationEventHandler(this.notifier);
};

TellemApp.prototype.init = function() {
	this.socket.on('notification', this.notificationEventHandler.handle.bind(this.notificationEventHandler));
	this.socket.emit('add-channel', 'test');
};

module.exports = TellemApp;