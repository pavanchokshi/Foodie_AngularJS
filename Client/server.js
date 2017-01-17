var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var overview = require('./routes/overview');
var receipes = require('./routes/receipes');
var followers = require('./routes/followers');

var http = require('http');
var path = require('path');
var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon1.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/templates/:file', routes.signUp);
app.get('/addUser', routes.signUp);
//app.get('/logout',routes.logout);
//app.get('/home',routes.logIn);
app.post('/api/signUp', users.signUp);
app.post('/api/logIn', users.logIn);
app.post('/api/addOverviewDetails', overview.addOverviewDetails);
app.get('/api/showOverview/:userName', overview.showOverview);
app.get('/api/showOverviewDetails/:userName/:ovid', overview.showOverviewDetails);
app.post('/api/postRecipe', receipes.postReceipes); // updated name
app.get('/api/getRecipes/:userName', receipes.getReceipes); //updated name
app.get('/api/getReceipe/:receipeId', receipes.getReceipe);
app.post('/api/likeReceipe', receipes.likeReceipe);
app.get('/api/getFollowerList/:userName', followers.getFollowerList);
app.get('/api/getFollowingList/:userName', followers.getFollowingList);
app.get('/api/getPendingFollowerList/:userName', followers.getPendingFollowerList);
app.post('/api/confirmFollower', followers.confirmFollower);
app.post('/api/addFollower', followers.addFollower);
app.get('/api/checkFollowRequest/:user1/:user2', followers.checkFollowRequest);
app.get('/api/getUserDetails/:user', users.getUserDetails);
app.get('/api/followerDetails/:user', users.followerDetails);
app.get('/api/followeeDetails/:user', users.followeeDetails);
app.get('/api/cuisineDetails/:user', users.cuisineDetails);
app.get('/api/getAll/:user', users.getAll);
app.get('/api/searchCuisine/:cuisineName',receipes.searchCuisine);
app.post('/api/updateUserName', users.updateName);
app.use('/', routes.views);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;