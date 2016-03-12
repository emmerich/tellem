var users = require('./users');
var channels = require('./channels');

module.exports = {
	update: function(modelUpdateRequest, sender) {
		// Delegate to the correct db
		// authenticate the user
		switch(modelUpdateRequest.collection) {
			case 'users':
				return users.update(modelUpdateRequest.id, modelUpdateRequest.update);
			default:
				throw 'Unknown collection: ' + modelUpdateRequest.collection
		}
	},

	create: function(modelCreateRequest, sender) {
		// Delegate to the correct db
		// authenticate the user
		switch(modelCreateRequest.collection) {
			case 'channels':
			console.log('creating');
				return channels.create(modelCreateRequest);
			default:
				throw 'Unknown collection: ' + modelCreateRequest.collection
		}
	}
};