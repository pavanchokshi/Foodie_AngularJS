/**
 * New node file
 */
var mongo = require("../helper/mongo");
//var mongoURL = "mongodb://localhost:27017/receipedb";
var mongoURL = "mongodb://srushti:srushti@ds127998.mlab.com:27998/receipedb";
var ObjectId = require('mongodb').ObjectId;

exports.redirect_operation = function(req, callback) {
    var operation = req.operation;
    var message = req.message;

    switch (operation) {
        case "getReceipe":
            getReceipe(message, callback);
            break;
        case "getReceipes":
            getReceipes(message, callback);
            break;
        case "post":
            postReceipes(message, callback);
            break;
        case "likeReceipe":
            likeReceipe(message, callback);
            break;
        case "searchCuisine":
        	searchCuisine(message, callback);
        	break;
        default:
            callback({ status: 400, message: "Invalid Request" });
    }
};

function postReceipes(msg, callback) {
    var res = {};
    //console.log(msg);
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("receipeposts");
        coll.insert({ username: msg.username, name: msg.name, receipename: msg.receipename, ingredients: msg.ingredients, desc: msg.desc, cuisine: msg.cuisine, photoURL: msg.photoURL, steps: msg.steps, likes: msg.likes, timestamp: new Date() }, function(err, result) {
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

function getReceipes(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("receipeposts");
        var coll1 = mongo.collection("followers");
        coll1.find({ user_one: msg.username, status: 2 }).toArray(function(err, result) {
            if (err) {
                res.data = "Error Occurred!";
                console.log("Error");
            } else {
                //console.log("results line 58 : " + JSON.stringify(result, null, 4));
                var temp = [];
                temp.push(msg.username);
                for (var i = 0; i < result.length; i++) {
                    temp.push(result[i].user_two);
                }
                //console.log("temp arr : " + temp[0] + temp[1]);
                coll.find({ username: { $in: temp } }).sort({ timestamp: -1 }).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log("value of result in getReceipes line 68: " + JSON.stringify(result, null, 4));
                        res.value = "Success";
                        var receipeList = [];
                        var likes = {};
                        for (var i = 0; i < result.length; i++) {
                            likes = result[i].likes;
                            receipeList.push({
                                "list": {
                                    "id": result[i]._id,
                                    "username": result[i].username,
                                    "name": result[i].name,
                                    "receipename": result[i].receipename,
                                    "desc": result[i].desc,
                                    "timestamp": result[i].timestamp,
                                    "likes": likes,
                                    "photoURL": result[i].photoURL
                                }
                            });
                        }
                        res.data = receipeList;
                        console.log(receipeList);
                    }
                    callback(null, res);
                });
            }
        });
    });
}


function getReceipe(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("receipeposts");
        var o_id = new ObjectId(msg.id);
        coll.find({ _id: o_id }).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("value of result in getReceipe line 68: ");
                console.log(result);
                res.value = "Success";
                var receipeList = [];
                for (var i = 0; i < result.length; i++) {
                    receipeList.push({
                        "id": result[i]._id,
                        "userid": result[i].username,
                        "name": result[i].name,
                        "receipename": result[i].receipename,
                        "ingredients": result[i].ingredients,
                        "desc": result[i].desc,
                        "cuisine": result[i].cuisine,
                        "photoURL": result[i].photoURL,
                        "steps": result[i].steps,
                        "likes": result[i].likes,
                        "timestamp": result[i].timestamp
                    });
                }
                res.data = receipeList;
                console.log(res.data);
            }
            callback(null, res);
        });
    });
}

function likeReceipe(msg, callback) {
    console.log(msg);
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("receipeposts");
        var postId = new ObjectId(msg.receipeID);
        var likesData = {};
        likesData.name = msg.likesFullName;
        likesData.username = msg.likesUserId;
        if (msg.isLike) {
            console.log("Like.....");
            coll.update({ _id: postId }, { $push: { likes: likesData } }, // replacement, replaces only the field "hi"
                function(err, object) {
                    if (err) {
                        console.log(err.message); // returns error if no matching object found
                    } else {
                        res.message = "Liked";
                    }
                    callback(null, res);
                });
        } else {
            console.log("Unike.....");
            coll.update({ _id: postId }, { $pull: { likes: likesData } }, // replacement, replaces only the field "hi"
                function(err, object) {
                    if (err) {
                        console.log(err.message); // returns error if no matching object found
                    } else {
                        res.message = "Unliked";
                    }
                    callback(null, res);
                });
        }


    });
}

function searchCuisine(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("receipeposts");
        //var coll1 = mongo.collection("followers");
        coll.find({ cuisine: msg.cuisine}).toArray(function(err, result) {
            if (err) {
                res.data = "Error Occurred!";
                console.log("Error");
            } else {
            	res.value = "Success";
            	var receipeList = [];
            	var likes = {};
            	for (var i = 0; i < result.length; i++) {
            		likes = result[i].likes;
            		receipeList.push({
            			"list": {
            				"id": result[i]._id,
            				"username":result[i].username,
            				"name": result[i].name,
            				"receipename": result[i].receipename,
            				"desc": result[i].desc,
            				"timestamp": result[i].timestamp,
            				"likes": likes,
            				"photoURL":result[i].photoURL
            				}
            		});
            	}
            	res.data = receipeList;
            	console.log(receipeList);
            }
            callback(null, res);
        });
    });
}

function unlikeReceipe(msg, callback) {}