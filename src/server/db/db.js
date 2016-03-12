var users = require('./users');

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
	}
};