var ModelUpdateRequest = function(params) {
	this.id = params.id;
	this.collection = params.collection;
	this.update = params.update;
};

module.exports = ModelUpdateRequest;