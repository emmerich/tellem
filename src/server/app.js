var winston = require('winston');

// Init the logger
if(process.env.TELLEM_ENV === 'dev') {
	winston.level = 'debug';
} else if(process.env.TELLEM_ENV === 'prod') {
	winston.level = 'info';
	winston.remove(winston.transports.Console);
	winston.add(winston.transports.File, { filename: 'tellem.log' });
}

var config = require('./config')();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var passport = require('passport');
var session = require('express-session');
var passportSocketIo = require('passport.socketio');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var MongooseDB = require('./db/MongooseDB');

var BulletinEmitter = require('./emitters/BulletinEmitter');
var DefaultEmitter = require('./emitters/DefaultEmitter');

var event = require('../common/event');
var Connection = require('./connection/Connection');
var ConnectionManager = require('./connection/ConnectionManager');



var User = require('../common/schema/User');
var Users = require('./model/Users');

var Channel = require('../common/schema/Channel');
var Channels = require('./model/Channels');

var SECRET = 'moon toes';

// use jade and the correct template dir
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// DB
var url = config.db;
var database = new MongooseDB({
	mongoose: require('mongoose'),
	url: url
});
database.init();

var sessionStore = new MongoStore({ url: config.db });

var dbEmitter = new DefaultEmitter({
	event: event.DB_UPDATE
});

var users = new Users({
	db: database,
	model: User,
	dbEmitter: dbEmitter
});

var channels = new Channels({
	db: database,
	users: users,
	model: Channel,
	dbEmitter: dbEmitter
});

// authentication
require('./auth')(passport, users, database);

// middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/static'));

//dev only
app.use(express.static(__dirname + '/../client'));
app.use('/fonts', express.static(__dirname + '/../../node_modules/bootstrap/fonts'));

app.use(session({ secret: SECRET, resave: false, saveUninitialized: false, store: sessionStore }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(err, req, res, next) {
  winston.log('error', err.stack);
  next(err);
});

io.use(passportSocketIo.authorize({
  secret:      SECRET,    // the session_secret to parse the cookie
  store:       sessionStore
}));

var bulletinEmitter = new BulletinEmitter({
	channels: channels,
	users: users
});
var connectionManager = new ConnectionManager({
	bulletinEmitter: bulletinEmitter,
	dbEmitter: dbEmitter,
	users: users,
	channels: channels
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

// routes
require('./routes')(app, passport, channels);

// Start the server.
http.listen(config.port, function() {
	winston.log('info', 'Server listening on port %d', config.port);
	require('./bot')(bulletinEmitter);
});