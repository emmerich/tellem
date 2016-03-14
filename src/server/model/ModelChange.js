var ModelChange = function() {
	this.creates = [];
	this.updates = [];
	this.deletes = [];
};

ModelChange.create = function(collection, model) {
	var group = new ModelChange();
	group.create(collection, model);
	return group;
};

ModelChange.update = function(collection, model) {
	var group = new ModelChange();
	group.update(collection, model);
	return group;
};

ModelChange.delete = function(collection, id) {
	var group = new ModelChange();
	group.delete(collection, id);
	return group;
};

ModelChange.prototype.create = function(collection, model) {
	this.creates.push({
		collection: collection,
		model: model
	});
};

ModelChange.prototype.update = function(collection, model) {
	this.updates.push({
		collection: collection,
		model: model
	});
};

ModelChange.prototype.delete = function(collection, id) {
	this.deletes.push({
		collection: collection,
		id: id
	});
};

module.exports = ModelChange;