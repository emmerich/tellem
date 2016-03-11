var q = require('q');
var User = require('../../model/user');

var users = [
	new User({ _id: 0, username: 'steven', password: 'password', subscribedChannels: [0, 1] }),
	new User({ _id: 1, username: 'michael', password: 'password', subscribedChannels: [1, 2] })
];

var _findById = function(id) {
	return users.filter(function(u) {
		return u._id === id;
	})[0];
};

module.exports = {
	findByUsername: function(username) {
		return q.fcall(function() {
			return users.filter(function(u) {
				return u.username === username;
			})[0];
		});
	},

	findById: function(id) {
		return q.fcall(_findById.bind(this, id));
	},

	update: function(id, update) {
		return q.fcall(function() {
			var user = _findById(id);

			if(user) {
				Object.keys(update).forEach(function(key) {
					user[key] = update[key];
				});
			}
		});
	}
};