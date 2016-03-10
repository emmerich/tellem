var ActiveConnection = function(params) {
	this.id = params.id;
	this.socket = params.socket;
	this.user = params.user;
};

module.exports = ActiveConnection;