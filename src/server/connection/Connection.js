var Connection = function(params) {
	this.socket = params.socket;
	this.user = params.user;
};

module.exports = Connection;