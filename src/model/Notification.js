var Notification = function(params) {
	this.title = params.title;
	this.message = params.message;
	this.icon = params.icon;
	this.language = params.language;
};

module.exports = Notification;