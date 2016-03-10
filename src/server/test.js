var channels = require('./db/channels');
var Notification = require('../model/Notification');
var NotificationEvent = require('../model/NotificationEvent');

module.exports = function(notificationEmitter) {
	var i = 0;

	setInterval(function() {
		channels.get().then(function(channels) {
			var ev = new NotificationEvent({
				notification: new Notification({
					'title': 'Notification ' + i,
					'message': 'This is notification number ' + i,
					'lang': 'en-GB',
					'icon': 'img/icon.png'
				}),
				'channel': channels[Math.floor(Math.random()*channels.length)]
			});

			console.log('Notification', i, 'going to channel', ev.channel);

			notificationEmitter.emit(ev);

			i++;
		});
		
	}, 5000);
};