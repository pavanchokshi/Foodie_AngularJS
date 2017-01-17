var mongo = require("../helper/mongo");
//var mongoURL = "mongodb://localhost:27017/receipedb";
var mongoURL = "mongodb://srushti:srushti@ds127998.mlab.com:27998/receipedb";

exports.redirect_operation = function(req, callback) {
    var operation = req.operation;
    var message = req.message;

    switch (operation) {
        case "login":
            login(message, callback);
            break;
        case "signup":
            signup(message, callback);
            break;
        case "logout":
            logout(message, callback);
            break;
        case "getUserDetails":
            getUserDetails(message, callback);
            break;
        case "followerDetails":
            followerDetails(message, callback);
            break;
        case "followeeDetails":
            followeeDetails(message, callback);
            break;
        case "cuisineDetails":
            cuisineDetails(message, callback);
            break;
        case "updateName":
            updateName(message, callback);
            break;
        default:
            callback({ status: 400, message: "Invalid Request" });
    }
};


function login(msg, callback) {
    var res = {};
    var username = msg.username;
    var password = msg.password;

    var json_responses;

    mongo.connect(mongoURL, function() {
        //console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection("login");

        coll.findOne({ username: username, password: password }, function(err, user) {
            if (user) {
                // This way subsequent requests will know the user is logged in.
                //req.session.username = user.username;
                //console.log(req.session.username +" is the session");
                res.data = user;
                res.code = "200";
                res.value = "Success Login";
                //json_responses = {"statusCode" : 200};
                //res.send(json_responses);

            } else {
                res.code = "401";
                res.value = "Failed Login";
                //json_responses = {"statusCode" : 401};
                //res.send(json_responses);
            }
            console.log("****************response*************** " + JSON.stringify(res));
            callback(null, res);
        });
    });
}

function signup(msg, callback) {
    var res = {};
    //ObjectId userid = new ObjectId();
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("login");
        coll.insert({ username: msg.username, password: msg.password, fname: msg.fname, lname: msg.lname, timestamp: new Date(), photoURL: msg.photoURL }, function(err, result) {
            if (err) {
                res.code = "500";
                res.value = "Error while connecting!";
            } else {
                //console.log("WriteResult.nInserted :" +JSON.stringify(result));
                if (result.insertedCount > 0) {
                    console.log("result.insertedCount : " + result.insertedCount);
                    console.log("Document Inserted");
                    res.code = "200";
                    res.value = "Document Inserted";
                } else {
                    res.code = "500";
                    res.value = "Error while inserting document!";
                }

            }
            callback(null, res);
        });
    });
}

function getUserDetails(msg, callback) {
    var res = {};
    var username = msg.user;
    var json_responses;

    mongo.connect(mongoURL, function() {
        //console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection("login");
        coll.findOne({ username: username }, function(err, user) {
            if (user) {
                // This way subsequent requests will know the user is logged in.
                //req.session.username = user.username;
                //console.log(req.session.username +" is the session");
                delete user.password;
                res.data = user;
                console.log(res.data);
                res.code = "200";
                res.value = "User found";
                //json_responses = {"statusCode" : 200};
                //res.send(json_responses);

            } else {
                res.code = "404";
                res.value = "User doesnt exist";
                //json_responses = {"statusCode" : 401};
                //res.send(json_responses);
            }
            callback(null, res);
        });
    });
}

function followerDetails(msg, callback) {
    var res = {};
    var username = msg.user;
    var json_responses;

    mongo.connect(mongoURL, function() {
        //console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection("followers");
        var temp = {};
        coll.find({ user_two: username, status: 2 }).count(function(err, count) {
            temp.noOfFollowers = count;
            res.data = temp;
            console.log(res.data);
            res.code = "200";
            res.value = "User found";
            callback(null, res);
        });
    });
}

function followeeDetails(msg, callback) {
    var res = {};
    var username = msg.user;
    mongo.connect(mongoURL, function() {
        //console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection("followers");
        var temp = {};
        coll.find({ user_one: username, status: 2 }).count(function(err, count) {
            temp.noOfFollowee = count;
            res.data = temp;
            console.log(res.data);
            res.code = "200";
            res.value = "User found";
            callback(null, res);
        });
    });
}

function cuisineDetails(msg, callback) {
    var res = {};
    var username = msg.user;
    mongo.connect(mongoURL, function() {
        //console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection("receipeposts");
        var temp = {};
        var cuisine = [];
        coll.distinct('cuisine', { username: username }, function(err, result) {
            for (var i = 0; i < result.length; i++) {
                cuisine.push(result[i]);
            }
            temp.cuisines = cuisine;
            res.data = temp.cuisines;
            console.log(res.data);
            res.code = "200";
            res.value = "User found";
            callback(null, res);
        });
    });
}

function updateName(msg, callback) {
    var res = {};
    console.log("inside updateName");
    //ObjectId userid = new ObjectId();

    mongo.connect(mongoURL, function() {
        var coll1 = mongo.collection("receipeposts");
        var newName = msg.fname + " " + msg.lname;
        coll1.update({ username: msg.username }, { $set: { name: newName } }, { multi: true }, function(err, result) {
            if (err) {
                res.code = "500";
                res.value = "Error while connecting!";
            } else {
                console.log("Document Modified + receipepost");
                res.code = "200";
                res.value = "Document Modified";
            }
        });
    });

    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("login");
        coll.update({ username: msg.username }, { $set: { fname: msg.fname, lname: msg.lname } }, function(err, result) {
            if (err) {
                res.code = "500";
                res.value = "Error while connecting!";
            } else {
                console.log("Document Modified + receipepost");
                res.code = "200";
                res.value = "Document Modified";
            }
            callback(null, res);
        });
    });
}