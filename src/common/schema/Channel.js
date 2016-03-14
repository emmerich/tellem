var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = Schema({
	name: String,
	description: String,
	senders: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Channel', schema);