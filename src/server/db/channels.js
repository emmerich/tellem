var q = require('q');
var Channel = require('../../model/Channel');

var channels = [new Channel({
	id: 0,
	name: 'dev_updates',
	description: 'Updates on the development servers.'
}),new Channel({
	id: 1,
	name: 'new_clients',
	description: 'New clients.'
}),new Channel({
	id: 2,
	name: 'prod_bugs',
	description: 'Bugs that arise in the production systems.'
})];

module.exports = {
	get: function() {
		return q.fcall(function() {
			return channels;
		});
	}
}