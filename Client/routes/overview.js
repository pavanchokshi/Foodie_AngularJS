/**
 * Overview related API's
 */

var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.addOverviewDetails=function(req,res){
	var msg_payload={
			operation : "add",
			message : {
				ovid : req.body.ovid,
				username : req.body.userName,
				info : req.body.info
			}
	};
	
	mq_client.make_request('overview_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in overview.js add");
			res.status(200).json({
				message : "success"
			});
		} 
	});
};

exports.showOverview=function(req,res){
	var msg_payload={
			operation : "showall",
			message : {
				username : req.params.userName
			}
	};
	mq_client.make_request('overview_queue',msg_payload,function(err,results){
		console.log("in show overview client"+results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in overview.js showOverview line 106: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
	
};

exports.showOverviewDetails=function(req,res){
	var msg_payload={
			operation : "show",
			message : {
				ovid : req.params.ovid,
				username : req.params.userName
			}
	};
	mq_client.make_request('overview_queue',msg_payload,function(err,results){
		console.log("in show overview Details client"+results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in overview.js showOverviewDetails line no:131"+ results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
	
};