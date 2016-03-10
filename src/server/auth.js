var users = require('./db/users');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        users.findById(id).then(function(user) {
        	if(user === null) {
        		done(null, null);
        	} else {
        		done(null, user);
        	}
        });
    });

    passport.use(new LocalStrategy(function(username, password, done) {
    	users.findByUsername(username).then(function(user) {
			if(user !== null && user.password === password) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));

};