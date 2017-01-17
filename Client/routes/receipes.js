/**
 * Newsfeeds related API's
 */

var ejs = require("ejs");
var mq_client = require('../rpc/client');


//post receipes
exports.postReceipes = function(req, res) {
	var likes = [];
	var msg_payload = {
			operation: "post",
			message: {
				username: req.body.username,
				name: req.body.name,
				receipename: req.body.receipename,
				ingredients: req.body.ingredients,
				desc: req.body.desc,
				cuisine: req.body.cuisine,
				photoURL: req.body.photoURL,
				steps: req.body.steps,
				likes: likes
			}
	};
	mq_client.make_request('receipeposts_queue', msg_payload, function(err, results) {
		// console.log(results);
		if (err) {
			res.status(500).json({
				message: "Error!"
			});
		} else {
			//console.log("Success in receipes.js post");
			res.status(200).json({
				message: "success"
			});
		}
	});
};

//get receipes
exports.getReceipes = function(req, res) {

	var msg_payload = {
			operation: "getReceipes",
			message: {
				username: req.params.userName
			}
	};
	mq_client.make_request('receipeposts_queue', msg_payload, function(err, results) {
		//console.log(results.data);
		if (err) {
			res.status(500).json({
				message: "Error!"
			});
		} else {
			console.log("Success in receipes.js getReceipes line 55: ");
			console.log(results.data);
			res.status(200).json({
				message: "success",
				data: results.data
			});
		}
	});
};

exports.getReceipe = function(req, res) {

	var msg_payload = {
			operation: "getReceipe",
			message: {
				id: req.params.receipeId
			}
	};
	console.log("inside right block");
	mq_client.make_request('receipeposts_queue', msg_payload, function(err, results) {
		console.log(results.data);
		if (err) {
			res.status(500).json({
				message: "Error!"
			});
		} else {
			console.log("Success in receipe.js getReceipe line 45: " + JSON.stringify(results.data));
			res.status(200).json({
				message: "success",
				data: results.data
			});
		}
	});
};

//like receipes
exports.likeReceipe = function(req, res) {
	var msg_payload = {
			operation: "likeReceipe",
			message: {
				receipeID: req.body.receipeID,
				likesFullName: req.body.likesFullName,
				likesUserId: req.body.likesUserId,
				isLike: req.body.isLike
			}
	};
	console.log(msg_payload);
	mq_client.make_request('receipeposts_queue', msg_payload, function(err, results) {
		//console.log(results.data);
		if (err) {
			res.status(500).json({
				message: "Error!"
			});
		} else {
			//console.log("Success in receipes.js getReceipes line 45: " + JSON.stringify(results.data));
			res.status(200).json({
				message: "Success"
			});
		}
	});
};

exports.searchCuisine = function(req,res){
	var msg_payload = {
			operation: "searchCuisine",
			message: {
				cuisine: req.params.cuisineName
			}
	};
	mq_client.make_request('receipeposts_queue', msg_payload, function(err, results) {
		//console.log(results.data);
		if (err) {
			res.status(500).json({
				message: "Error!"
			});
		} else {
			console.log("Success in receipes.js search cuisine ");
			console.log(results.data);
			res.status(200).json({
				message: "success",
				data: results.data
			});
		}
	});
};