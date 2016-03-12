var Channel = function(params) {
	this._id = params._id;
	this.name = params.name;
	this.description = params.description;
	this.senders = params.senders;
};

module.exports = Channel;