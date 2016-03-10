var NotificationEmitter = function() {
	this.connections = [];
};

NotificationEmitter.prototype.add = function(connection) {
	this.connections.push(connection);
};

NotificationEmitter.prototype.remove = function(connection) {
	this.connections.splice(this.connections.indexOf(connection), 1);
};

NotificationEmitter.prototype.emit = function(notificationEvent) {
	// Go through each connection, and check if the user of that connection
	// is subscribed to the channel of the notification. If they are, send
	// them the event.
	this.connections.forEach(function(connection) {
		if(this._userIsSubscribed(connection.user, notificationEvent.channel)) {
			console.log('emit');
			connection.socket.emit('notification', notificationEvent);
		}
	}, this);
};

NotificationEmitter.prototype._userIsSubscribed = function(user, channel) {
	return user.channels.indexOf(channel.id) > -1;
};


module.exports = NotificationEmitter;