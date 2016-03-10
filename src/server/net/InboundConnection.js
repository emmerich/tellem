var InboundConnection = function(params) {
	this.user = params.user;
	this.socket = params.socket;
};

module.exports = InboundConnection;