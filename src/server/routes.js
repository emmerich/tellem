var env = require('./config')().env;
var isLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(app, passport, channels) {
	app.get('/app', isLoggedIn(), function (req, res) {
		channels.getAll().then(function(channels) {
			res.render('app', {
				'env': env,
				'contactMail': 'steven@usetellem.com',
				'bootstrap': {
					'channels': channels,
					'user': req.user
				}
			});
		});
	});

	app.get('/', function(req, res) {
		res.render('index', {
			'env': env
		});
	});

	app.get('/login', function(req, res) {
		var error = req.flash('error')[0];

		if(error === 'Missing credentials') {
			error = 'Please supply an email address and a username.';
		}

		res.render('login', {
			'env': env,
			'message': error,
			'contactMail': 'steven@usetellem.com'
		});
	});

	var authenticate = passport.authenticate('local', {
		successRedirect: '/app',
		failureRedirect: '/login',
		failureFlash: true
	});

	app.post('/register', function(req, res) {
		req._register = true;
		authenticate.apply(this, Array.prototype.slice.apply(arguments));
	});

	app.post('/login', authenticate);
}