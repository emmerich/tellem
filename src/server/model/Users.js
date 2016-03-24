var inherits = require('util').inherits;
var BaseModel = require('./BaseModel');
var q = require('q');

var Users = function(params) {
	BaseModel.call(this, params);
};
inherits(Users, BaseModel);

Users.prototype.getByUsername = function(username) {
	return this.db.findOne(this.model, { username: username });
};

Users.prototype.getByEmail = function(email) {
	return this.db.findOne(this.model, { email: email });
};

Users.prototype.deleteAllSubscriptionsForChannel = function(channelId) {
	var _this = this;

	return this.db.find(this.model, { subscribedChannels: channelId }).then(function(users) {
		var userPromises = [];

		users.forEach(function(user) {
			user.subscribedChannels.splice(user.subscribedChannels.indexOf(channelId), 1);
			userPromises.push(_this.db.update(_this.model, user._id, user));
		});

		return q.all(userPromises);
	});
};

module.exports = Users;