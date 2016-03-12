var q = require('q');
var Channel = require('../../common/model/Channel');

var channels = [new Channel({
	_id: 0,
	name: 'dev_updates',
	description: 'Updates on the development servers.',
	senders: [0]
}),new Channel({
	_id: 1,
	name: 'new_clients',
	description: 'New clients.',
	senders: [0]
}),new Channel({
	_id: 2,
	name: 'prod_bugs',
	description: 'Bugs that arise in the production systems.',
	senders: []
})];

module.exports = {
	get: function() {
		return q.fcall(function() {
			return channels;
		});
	},

	getById: function(id) {
		return q.fcall(function() {
			return channels.filter(function(channel) {
				return channel._id === id;
			})[0];
		});
	}
}