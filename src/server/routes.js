var env = require('./config').env;
var isLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(app, passport, channels) {
	app.get('/', isLoggedIn(), function (req, res) {
		channels.getAll().then(function(channels) {
			res.render('index', {
				'env': env,
				'contactMail': 'steven@usetellem.com',
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