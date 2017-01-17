/**
 * New node file
 */
var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.addFollower=function(req,res){
	var msg_payload={
			operation:"add",
			message :{
				username : req.body.userName,
				toUser : req.body.toUser
			}
	};

	mq_client.make_request('followers_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in followers.js addFollower line 21: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
};

exports.confirmFollower=function(req,res){
	var msg_payload={
			operation:"confirm",
			message :{
				username : req.body.userName,
				withUser : req.body.withUser
			}
	};
	mq_client.make_request('followers_queue',msg_payload,function(err,results){
		console.log("in confirm follower"+results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in followers.js confirmFollower line 47: "+results.value);
			res.status(200).json({
				message : "success"
			});
		} 
	});
};

exports.getFollowerList=function(req,res){
	var msg_payload={
			operation:"getFollowerList",
			message :{
				username : req.params.userName
			}
	};

	mq_client.make_request('followers_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("results.data : "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});
};


exports.getFollowingList=function(req,res){
	var msg_payload={
			operation:"getFollowingList",
			message :{
				username : req.params.userName
			}
	};

	mq_client.make_request('followers_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("results.data : "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});
};

exports.getPendingFollowerList=function(req,res){
	var msg_payload={
			operation:"getPendingList",
			message:{
				username : req.params.userName
			}
	};
	mq_client.make_request('followers_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});
};

exports.checkFollowRequest=function(req,res){
	var msg_payload={
			operation:"checkFollowRequest",
			message:{
				user1 : req.params.user1,
				user2 : req.params.user2
			}
	};
	mq_client.make_request('followers_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log(results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});	
};
