var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, users) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        users.get(id).then(function(user) {
        	if(user === null) {
        		done(null, null);
        	} else {
        		done(null, user);
        	}
        });
    });

    passport.use(new LocalStrategy(function(username, password, done) {
    	users.getByUsername(username).then(function(user) {
			if(user !== null && user.password === password) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));

};