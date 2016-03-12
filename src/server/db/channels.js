var q = require('q');
var Channel = require('../../common/model/Channel');
var ModelCreate = require('../../common/model/ModelCreate');

var nextId = 3;
var channels = [new Channel({
	_id: 0,
	name: 'dev_updates',
	description: 'Provides updates on the state of the development servers. Restarts, downtime, known issues.',
	senders: [0]
}),new Channel({
	_id: 1,
	name: 'new_clients',
	description: 'Bulletins about any new clients we receive.',
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
	},

	create: function(createRequest) {
		return q.fcall(function() {
			var channel = new Channel(createRequest.model);
			channel._id = nextId;
			nextId++;

			console.log('created channel', channel);

			channels.push(channel);

			return new ModelCreate({
				collection: createRequest.collection,
				model: channel
			});
		});
	}
}