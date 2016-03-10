var NotificationEvent = function(params) {
	this.notification = params.notification;

	//todo: should be channel id
	this.channel = params.channel;
};

module.exports = NotificationEvent;