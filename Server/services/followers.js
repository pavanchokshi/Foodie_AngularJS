/**
 * New node file
 */
var mongo = require("../helper/mongo");
var mongoURL = "mongodb://srushti:srushti@ds127998.mlab.com:27998/receipedb";

exports.redirect_operation = function(req, callback) {
    var operation = req.operation;
    var message = req.message;

    switch (operation) {
        case "add":
            addFollower(message, callback);
            break;
        case "confirm":
            confirmFollower(message, callback);
            break;
        case "getFollowerList":
            getFollowerList(message, callback);
            break;
        case "getFollowingList":
            getFollowingList(message, callback);
            break;
        case "getPendingList":
            getPendingFollowerList(message, callback);
            break;
        case "checkFollowRequest":
            checkFollowRequest(message, callback);
            break;
        case "getAll":
            getAll(message, callback);
            break;
        default:
            callback({ status: 400, message: "Invalid Request" });
    }
};

function addFollower(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("followers");
        coll.insert({ user_one: msg.username, user_two: msg.toUser, status: 1, timestamp: new Date() }, function(err, result) {
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

function confirmFollower(msg, callback) {
    console.log("in confirmFollower services" + JSON.stringify(msg));
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("followers");
        coll.update({ user_two: msg.username, user_one: msg.withUser }, { $set: { status: 2 } }, function(err, result) {
            if (err) {
                res.code = "500";
                res.value = "Error while connecting!";
            } else {
                if (result.ok == 1) {
                    res.code = "200";
                    res.value = "Document Updated";
                    console.log("**Update** " + JSON.stringify(result));
                } else {
                    res.code = "304";
                    res.value = "error in update";
                }
            }
            callback(null, res);
        });
    });
}

function getFollowerList(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("followers");
        var coll1 = mongo.collection("login");
        coll.find({ user_two: msg.username, status: 2 }).toArray(function(err, result) {
            if (err) {
                res.data = "Error Occurred!";
                console.log("Error");
            } else {
                var temp = [];
                for (var i = 0; i < result.length; i++) {
                    temp.push(result[i].user_one);
                }
                res.data = temp;
                coll1.find({ username: { $in: temp } }).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log("value of result in getReceipes line 68: " + JSON.stringify(result, null, 4));
                        res.value = "Success";
                        var userlist = [];
                        for (var i = 0; i < result.length; i++) {
                            userlist.push({
                                "list": {
                                    "fname": result[i].fname,
                                    "lname": result[i].lname,
                                    "username": result[i].username,
                                    "photoURL": result[i].photoURL
                                }
                            });
                        }
                        res.data = userlist;
                    }
                    callback(null, res);
                });
            }
        });
    });
}

function getFollowingList(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("followers");
        var coll1 = mongo.collection("login");
        coll.find({ user_one: msg.username, status: 2 }).toArray(function(err, result) {
            if (err) {
                res.data = "Error Occurred!";
                console.log("Error");
            } else {
                var temp = [];
                for (var i = 0; i < result.length; i++) {
                    temp.push(result[i].user_two);
                }
                res.data = temp;
                coll1.find({ username: { $in: temp } }).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log("value of result in getReceipes line 68: " + JSON.stringify(result, null, 4));
                        res.value = "Success";
                        var userlist = [];
                        for (var i = 0; i < result.length; i++) {
                            userlist.push({
                                "list": {
                                    "fname": result[i].fname,
                                    "lname": result[i].lname,
                                    "username": result[i].username,
                                    "photoURL": result[i].photoURL
                                }
                            });
                        }
                        res.data = userlist;
                    }
                    callback(null, res);
                });
            }
        });
    });
}

function getPendingFollowerList(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("followers");
        coll.find({ user_two: msg.username, status: 1 }).toArray(function(err, result) {
            if (err) {
                console.log("error");
            } else {
                var temp = [];
                for (var i = 0; i < result.length; i++) {
                    temp.push(result[i].user_one);
                }
                res.data = temp;
            }
            callback(null, res);
        });
    });
}

function checkFollowRequest(msg, callback) {
    console.log("in checkFollowRequest");
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("followers");
        coll.find({ $or: [{ user_one: msg.user1, user_two: msg.user2 }, { user_two: msg.user1, user_one: msg.user2 }] }).toArray(function(err, result) {
            if (err) {
                console.log("error");
                res.data = "Error!";
            } else {
                var temp = [];
                for (var i = 0; i < result.length; i++) {
                    temp.push({
                        "list": {
                            "follower": result[i].user_one,
                            "username": result[i].user_two,
                            "status": result[i].status
                        }
                    });
                }
                res.data = temp;
                console.log("++++++++" + JSON.stringify(res.data));
            }
            callback(null, res);
        });
    });
}

function getAll(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll1 = mongo.collection("login");
        var coll2 = mongo.collection("receipeposts");
        coll1.distinct("username", function(err, result) {
            if (err) {
                res.data = "Error Occurred!";
            } else {
                var temp = [];
                for (var i = 0; i < result.length; i++) {
                    if (!(((msg.username).localeCompare(result[i])) == 0))
                        temp.push(result[i]);
                }
                coll2.distinct("cuisine", function(err, result) {
                    if (err) {
                        res.data = "Error Occurred!";
                    } else {
                        for (var i = 0; i < result.length; i++) {
                            temp.push(result[i]);
                        }
                    }
                    res.data = temp;
                    callback(null, res);
                });
            }

        });
    });
}