var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var passport = require('passport');
var session = require('express-session');
var passportSocketIo = require('passport.socketio');
var MongoStore = require('connect-mongo')(session);
var Notification = require('../model/Notification');
var NotificationEvent = require('../model/NotificationEvent');
var NotificationEmitter = require('./net/NotificationEmitter');
var InboundConnection = require('./net/InboundConnection');

var SECRET = 'moon toes';

// use jade and the correct template dir
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var sessionStore = new MongoStore({ url: 'mongodb://localhost:27017/tellem' });

// authentication
require('./auth')(passport);

// middleware
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(express.static(__dirname + '/static'));

//dev only
app.use(express.static(__dirname + '/../client'));


// todo: use a non-memory session store
app.use(session({ secret: SECRET, resave: false, saveUninitialized: false, store: sessionStore }));
app.use(passport.initialize());
app.use(passport.session());

// routes
require('./routes')(app, passport);

io.use(passportSocketIo.authorize({
  secret:      SECRET,    // the session_secret to parse the cookie
  store:       sessionStore
}));

var notificationEmitter = new NotificationEmitter();

io.on('connection', function(socket) {
	// When a new connection is made, create a new tuple and add it to the notification emitter.
	var connection = new InboundConnection({
		socket: socket,
		user: socket.request.user
	});

	notificationEmitter.add(connection);

	socket.on('disconnect', function() {
		notificationEmitter.remove(connection);
	});

	socket.on('UPDATE', function(data) {
		// collection, id, update
		console.log(data);

		// update the db
		if(data.collection === 'users') {
			require('./db/users').update(data.id, data.update).then(function() {
				io.emit('UPDATE', {
					collection: data.collection,
					id: data.id,
					data: data.update
				});	
			});
		}
	});
});

// Start the server.
http.listen(3000, function() {});



require('./test')(notificationEmitter);