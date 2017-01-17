/**
 * New node file
 */
var mongo = require("../helper/mongo");
//var mongoURL = "mongodb://localhost:27017/receipedb";
var mongoURL = "mongodb://srushti:srushti@ds127998.mlab.com:27998/receipedb";

exports.redirect_operation = function(req, callback) {
    var operation = req.operation;
    var message = req.message;

    switch (operation) {
        case "add":
            addOverviewDetails(message, callback);
            break;
        case "show":
            showOverviewDetails(message, callback);
            break;
        case "showall":
            showOverview(message, callback);
            break;
        default:
            callback({ status: 400, message: "Invalid Request" });
    }
};

function addOverviewDetails(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("overview");
        coll.insert({ username: msg.username, ovid: msg.ovid, info: msg.info, timestamp: new Date() }, function(err, result) {
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

function showOverviewDetails(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("overview");
        coll.find({ username: msg.username, ovid: msg.ovid }).sort({ 'timestamp': -1 }).toArray(function(err, result) {
            if (err) {
                console.log("Error");
            } else {
                console.log("value of result in showOverview line 59: " + JSON.stringify(result, null, 4));
                res.value = "Success";
                var summaryList = [];
                for (var i = 0; i < result.length; i++) {
                    summaryList.push({
                        "list": {
                            "ovid": result[i].ovid,
                            "info": result[i].info
                        }
                    });
                }
                res.data = summaryList;
            }
            callback(null, res);
        });
    });
}

function showOverview(msg, callback) {
    var res = {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection("overview");
        coll.find({ username: msg.username }).sort({ 'timestamp': -1 }).toArray(function(err, result) {
            if (err) {
                console.log("Error");
            } else {
                res.value = "Success";
                console.log("value of result in showOverview line 79: " + JSON.stringify(result, null, 4));
                var summaryList = [];
                for (var i = 0; i < result.length; i++) {
                    summaryList.push({
                        "list": {
                            "ovid": result[i].ovid,
                            "info": result[i].info
                        }
                    });
                }
                res.data = summaryList;
            }
            console.log("Success");
            console.log("Results : " + JSON.stringify(result, null, 4));
            callback(null, res);
        });
    });
}