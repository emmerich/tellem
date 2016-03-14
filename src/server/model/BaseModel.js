var ModelChange = require('./ModelChange');

var BaseModel = function(params) {
	this.db = params.db;
	this.model = params.model;
	this.dbEmitter = params.dbEmitter;
};

BaseModel.prototype.create = function(createRequest, ack) {
	var _this = this;
	var p = this.db.create(this.model, createRequest.model);
	
	p.then(function(model) {
		_this.dbEmitter.emit(
			ModelChange.create(createRequest.collection, model), ack);
	});

	return p;
};

BaseModel.prototype.get = function(id) {
	return this.db.findOne(this.model, { _id: id });
};

BaseModel.prototype.getAll = function() {
	return this.db.getAll(this.model);
};

BaseModel.prototype.update = function(updateRequest, ack) {
	var _this = this;
	var p = this.db.update(this.model, updateRequest.id, updateRequest.update);
	
	p.then(function(model) {
		_this.dbEmitter.emit(
			ModelChange.update(updateRequest.collection, model), ack);
	});

	return p;
};

BaseModel.prototype.delete = function(deleteRequest, ack) {
	var _this = this;
	var p = this.db.delete(this.model, deleteRequest.id);

	p.then(function() {
		_this.dbEmitter.emit(
			ModelChange.delete(deleteRequest.collection, deleteRequest.id), ack);
	});

	return p;
};

module.exports = BaseModel;