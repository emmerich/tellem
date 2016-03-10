var ChromeNotifier = require('./notifier/ChromeNotifier');

/**
 * Return an instance of Notifier suitable for the current environment.
 * @return {[type]} [description]
 */
var getNotifierInstance = function() {
	return new ChromeNotifier();
};

module.exports = getNotifierInstance;