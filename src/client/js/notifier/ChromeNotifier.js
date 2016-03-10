var ChromeNotifier = function() {
	Notification.requestPermission();
};

ChromeNotifier.prototype.notify = function(notiEvent) {
    var notification = notiEvent.notification;
    var channel = notiEvent.channel;

	new Notification(notification.title, {
		title: notification.title,
        dir: "auto",
        lang: notification.lang,
        body: channel.name + ': ' + notification.message,
        tag: channel.name,
        icon: notification.icon
        // onclick, onshow, onerror, onclose
    });
};

module.exports = ChromeNotifier;