var Bulletin = function(params) {
	this.sender = params.sender;
	this.message = params.message;
	this.icon = params.icon;
	this.language = params.language;
	this.channelId = params.channelId;
};

module.exports = Bulletin;
