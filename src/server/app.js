var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var passport = require('passport');
var session = require('express-session');
var passportSocketIo = require('passport.socketio');
var MongoStore = require('connect-mongo')(session);

var BulletinEmitter = require('./emitters/BulletinEmitter');
var BaseEmitter = require('./emitters/BaseEmitter');
var event = require('../common/event');
var Connection = require('./connection/Connection');
var ConnectionManager = require('./connection/ConnectionManager');

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

app.use(session({ secret: SECRET, resave: false, saveUninitialized: false, store: sessionStore }));
app.use(passport.initialize());
app.use(passport.session());

// routes
require('./routes')(app, passport);

io.use(passportSocketIo.authorize({
  secret:      SECRET,    // the session_secret to parse the cookie
  store:       sessionStore
}));

var bulletinEmitter = new BulletinEmitter();
var modelUpdateEmitter = new BaseEmitter({ eventName: event.MODEL_UPDATE });
var modelCreateEmitter = new BaseEmitter({ eventName: event.MODEL_CREATE });
var connectionManager = new ConnectionManager({
	bulletinEmitter: bulletinEmitter,
	modelUpdateEmitter: modelUpdateEmitter,
	modelCreateEmitter: modelCreateEmitter
});

io.on('connection', function(socket) {
	// Delegate all connection logic to the ConnectionManager.
	var connection = new Connection({
		socket: socket,
		user: socket.request.user
	});

	socket.on('disconnect', function() {
		connectionManager.unmanage(connection);
	});

	connectionManager.manage(connection);
});

// Start the server.
http.listen(3000, function() {});