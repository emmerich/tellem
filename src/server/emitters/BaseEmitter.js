var BaseEmitter = function(params) {
	if(params) {
		Object.keys(params).forEach(function(key) {
			this[key] = params[key];
		});	
	}

	this.connections = [];
};

BaseEmitter.prototype.add = function(connection) {
	this.connections.push(connection);
};

BaseEmitter.prototype.remove = function(connection) {
	this.connections.splice(this.connections.indexOf(connection), 1);
};

module.exports = BaseEmitter;