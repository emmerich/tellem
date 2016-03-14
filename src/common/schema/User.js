var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = Schema({
	username: String,
	password: String,
	subscribedChannels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }]
});

module.exports = mongoose.model('User', schema);