//super simple rpc server example
var amqp = require('amqp');

var login = require('./services/login');
var overview = require('./services/overview');
var receipeposts = require('./services/receipeposts');
var followers = require('./services/followers');
var express = require('express');
var cnn = amqp.createConnection({ host: '127.0.0.1' });
/*var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);*/
var mongo = require("./helper/mongo");

var app = express();

/*app.use(expressSession({
    secret: 'sjsucmpe280',
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    store: new mongoStore({
        url: mongoSessionConnectURL
    })
}));

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function() {
    console.log('Connected to mongo at: ' + mongoSessionConnectURL);
});*/


cnn.on('ready', function() {
    //console.log("listening on login_queue");

    cnn.queue('login_queue', function(q) {
        q.subscribe(function(message, headers, deliveryInfo, m) {
            console.log("inside server server.js");
            login.redirect_operation(message, function(err, res) {
                console.log("res in redirect_operation : " + res);
                publishQueue(cnn, m, res);
            });
        });
    });

    cnn.queue('overview_queue', function(q) {
        q.subscribe(function(message, headers, deliveryInfo, m) {
            console.log("inside server server.js");
            overview.redirect_operation(message, function(err, res) {
                console.log("res in redirect_operation overview: " + res);
                publishQueue(cnn, m, res);
            });
        });
    });

    cnn.queue('receipeposts_queue', function(q) {
        q.subscribe(function(message, headers, deliveryInfo, m) {
            console.log("inside server server.js");
            receipeposts.redirect_operation(message, function(err, res) {
                console.log("res in redirect_operation receipeposts: " + res);
                publishQueue(cnn, m, res);
            });
        });
    });

    cnn.queue('followers_queue', function(q) {
        q.subscribe(function(message, headers, deliveryInfo, m) {
            console.log("inside server server.js");
            followers.redirect_operation(message, function(err, res) {
                console.log("res in redirect_operation followers: " + res);
                publishQueue(cnn, m, res);
            });
        });
    });

});

//return index sent
function publishQueue(cnn, m, res) {
    console.log("res in publishQueue : " + res);
    cnn.publish(m.replyTo, res, {
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        correlationId: m.correlationId
    });
}