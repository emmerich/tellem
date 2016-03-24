var User = require('../common/schema/User');
var config = require('./config')();
var client_id = config.client_id;
var devOps_id = config.devOps_id;

module.exports = function(bulletinEmitter) {

    var client_quotes = [
        "We have a new client. Please check the onboarding document to help get them set up.",
        "ImportantClient have asked to take a look at a support ticket they've raised.",
        "The meeting for the new client onboarding procedure is starting in 5 minutes."
    ];

    var devOps_quotes = [
        "There is a major issue in production, please check the issue tracker.",
        "The development server will be restarted in 5 minutes.",
        "There will be internet connectivity issues between 18:30 and 19:30 this evening."
    ];

    var bot = new User({
        email: "bot@usetellem.com",
        username: "tellem_bot",
        subscribedChannels: [] 
    });

    var send = function(channel, arr) {
        bulletinEmitter.emit({
            message: arr[Math.floor(Math.random() * arr.length)],
            channelId: channel
        }, bot);
    };

    var loop = function(channel, arr) {
        var rand = Math.floor(Math.random() * 30000);

        setTimeout(function() {
            send(channel, arr);
            loop(channel, arr);
        }, rand);
    };

    loop(client_id, client_quotes);
    loop(devOps_id, devOps_quotes);
};