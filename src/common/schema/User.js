var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = Schema({
	email: {
        type: String,
        unique: true
    },
	username: String,
	subscribedChannels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }]
});

module.exports = mongoose.model('User', schema);