var MongooseDB = function(params) {
	this.mongoose = params.mongoose;
	this.url = params.url;
	this.db = this.mongoose.connection;
};

MongooseDB.prototype.init = function() {
	this.mongoose.connect(this.url);
	this.db.on('error', console.error.bind(console, 'connection error:'));
	this.db.once('open', function() {
		console.log('DB Connection Made');
	});
};

MongooseDB.prototype.create = function(collection, model) {
	var obj = new collection(model);
	return this._wrapPromise(obj.save());
};

MongooseDB.prototype.update = function(collection, id, update) {
	console.log('MongooseDB update', collection, id, update);
	return this._wrapPromise(collection.findByIdAndUpdate(id, update));
};

MongooseDB.prototype.delete = function(collection, id) {
	return this._wrapPromise(collection.remove({ _id: id }));
};

MongooseDB.prototype.findOne = function(collection, query) {
	return collection.findOne(query).exec();
};

MongooseDB.prototype.find = function(collection, query) {
	return collection.find(query).exec();
};

MongooseDB.prototype.getAll = function(collection) {
	return collection.find({}).exec();
};

MongooseDB.prototype._wrapPromise = function(promise) {
	promise.then(null, function(err) {
		console.log('Error', err);
		return promise;
	});

	return promise;
};

module.exports = MongooseDB;