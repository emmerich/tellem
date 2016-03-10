var q = require('q');

var users = [
	{ _id: 0, username: 'steven', password: 'password', channels: [0, 1] },
	{ _id: 1, username: 'michael', password: 'password', channels: [1, 2] }
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