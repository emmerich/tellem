var LocalStrategy = require('passport-local').Strategy;
var collections = require('../common/collections');
var User = require('../common/schema/User');
var winston = require('winston');

module.exports = function(passport, users, database) {

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

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true
        }, function(req, email, password, done) {
            // Register a new user
            if(req._register) {
                var email = req.body.email;
                var username = req.body.username;

                if(email && username) {
                    winston.log('info', 'New user registration, email: %s, username: %s', email, username);

                    database.create(User, {
                        username: username,
                        email: email,
                        subscribedChannels: []
                    }).then(function(user) {
                        winston.log('info', 'New user created successfully.');
                        done(null, user);
                    }, function() {
                        winston.log('warn', 'The email %s is already in use.', email);
                        done(null, false, { message: 'Email address already registered.'});
                    });
                } else {
                    done(null, false, { message: 'Please supply an email address and a username.' });
                }
            } else {
                // Verify the email exists
                users.getByEmail(email).then(function(user) {
                    if(user !== null) {
                        done(null, user);
                    } else {
                        done(null, false, { message: 'Email address not registered.'});
                    }
                });
            }
    }));

};