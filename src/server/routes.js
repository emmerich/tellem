var isLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var channels = require('./db/channels');

module.exports = function(app, passport) {
	app.get('/', isLoggedIn(), function (req, res) {
		channels.get().then(function(channels) {
			res.render('index', {
				'bootstrap': {
					'channels': channels,
					'user': req.user
				}
			});	
		});
	});

	app.get('/login', function(req, res) {
		res.render('login');
	});

	app.post('/login', passport.authenticate('local',
		{ successRedirect: '/', failureRedirect: '/login' }));
}