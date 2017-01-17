// Users related API's

var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.logIn = function(req, res) {

    var username = req.body.userName;
    var password = req.body.password;

    //console.log("Inside users.js " + username + password);

    var msg_payload = {
        operation: "login",
        message: {
            username: username,
            password: password
        }
    };

    mq_client.make_request('login_queue', msg_payload, function(err, results) {
        //console.log("inside make_request in users.js :" + JSON.stringify(results));
        console.log(results.data._id);
        if (err) {
            throw err;
        } else {
            if (results.code == 200) {
                console.log("valid Login");
                console.log(results);
                res.status(200).json(results);
            } else {
                console.log("Invalid Login");
                res.send({ "login": "Fail" });
            }
        }
    });
};

exports.signUp = function(req, res) {

    var msg_payload = {
        operation: "signup",
        message: {
            username: req.body.userName,
            password: req.body.password,
            fname: req.body.fName,
            lname: req.body.lName,
            photoURL: req.body.photoURL
        }
    };

    //console.log("Inside users.js " + username + password);
    mq_client.make_request('login_queue', msg_payload, function(err, results) {
        console.log(results);
        if (err) {
            res.status(500).json({
                message: "User Already Exists!"
            });
        } else {
            console.log("Success in users.js signup");
            //req.session.user = req.body.userName;
            res.status(200).json({
                message: "success"
            });
        }
    });
};

exports.getUserDetails = function(req, res) {
    var msg_payload = {
        operation: "getUserDetails",
        message: {
            user: req.params.user,
        }
    };

    //console.log("Inside users.js " + username + password);
    mq_client.make_request('login_queue', msg_payload, function(err, results) {
        if (err) {
            res.status(404).json({
                message: "User Doesnt Exist!"
            });
        } else {
            console.log("Success in users.js getUserDetails");
            //req.session.user = req.body.userName;
            res.status(200).json({
                message: "success",
                data: results.data
            });
        }
    });
};

exports.followerDetails = function(req, res) {
    var msg_payload = {
        operation: "followerDetails",
        message: {
            user: req.params.user,
        }
    };

    //console.log("Inside users.js " + username + password);
    mq_client.make_request('login_queue', msg_payload, function(err, results) {
        if (err) {
            res.status(404).json({
                message: "User Doesnt Exist!"
            });
        } else {
            console.log("Success in users.js getUserDetails");
            //req.session.user = req.body.userName;
            res.status(200).json({
                message: "success",
                data: results.data
            });
        }
    });
};

exports.followeeDetails = function(req, res) {
    var msg_payload = {
        operation: "followeeDetails",
        message: {
            user: req.params.user,
        }
    };

    //console.log("Inside users.js " + username + password);
    mq_client.make_request('login_queue', msg_payload, function(err, results) {
        if (err) {
            res.status(404).json({
                message: "User Doesnt Exist!"
            });
        } else {
            console.log("Success in users.js followeeDetails");
            //req.session.user = req.body.userName;
            res.status(200).json({
                message: "success",
                data: results.data
            });
        }
    });
};

exports.cuisineDetails = function(req, res) {
    var msg_payload = {
        operation: "cuisineDetails",
        message: {
            user: req.params.user,
        }
    };

    //console.log("Inside users.js " + username + password);
    mq_client.make_request('login_queue', msg_payload, function(err, results) {
        if (err) {
            res.status(404).json({
                message: "User Doesnt Exist!"
            });
        } else {
            console.log("Success in users.js getUserDetails");
            //req.session.user = req.body.userName;
            res.status(200).json({
                message: "success",
                data: results.data
            });
        }
    });
};

exports.getAll = function(req, res) {
    var msg_payload = {
        operation: "getAll",
        message: {
            username: req.params.user
        }
    };
    mq_client.make_request('followers_queue', msg_payload, function(err, results) {
        if (err) {
            res.status(404).json({
                message: "Error getting user"
            });
        } else {
            console.log("Success in users.js getAll");
            //req.session.user = req.body.userName;
            res.status(200).json({
                message: "success",
                data: results.data
            });
        }
    });
};
///neha
exports.updateName = function(req, res) {

    var msg_payload = {
        operation: "updateName",
        message: {
            username: req.body.userName,
            fname: req.body.fName,
            lname: req.body.lName
        }
    };

    console.log(msg_payload.message);
    mq_client.make_request('login_queue', msg_payload, function(err, results) {
        console.log(results);
        if (err) {
            res.status(500).json({
                message: "Unable to update username!"
            });
        } else {
            console.log("Success in users.js updateName");
            //req.session.user = req.body.userName;
            res.status(200).json({
                message: "success"
            });
        }
    });
};