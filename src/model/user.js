var User = function(params) {
	this._id = params._id;
	this.username = params.username;
	this.password = params.password;
	this.subscribedChannels = params.subscribedChannels;
};

module.exports = User;