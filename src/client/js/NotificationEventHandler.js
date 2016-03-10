var Notification = require('../../model/Notification');

var NotificationEventHandler = function(notifier) {
	this.notifier = notifier;
};

NotificationEventHandler.prototype.handle = function(payload) {
	this.notifier.notify(payload);
};

module.exports = NotificationEventHandler;