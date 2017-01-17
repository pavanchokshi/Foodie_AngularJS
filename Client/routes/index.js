
// rendering index page
exports.views = function(req,res){
	res.render('index',{
		title : 'Welcome!'
	});
};

// rendering sign up page
exports.signUp = function(req,res){
	res.render('templates/addUser');
};

// rendering home page after successful login
exports.logIn = function(req,res){
	console.log("*****in home******");
	res.render('templates/home');
};

// after successful logout
exports.logout = function(req,res){
	res.render('templates/addUser');
};