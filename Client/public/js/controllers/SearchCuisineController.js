/**
 * Controller for searchCuisine.html template
 */

recipeApp.controller('SearchCuisineController', function($scope, $rootScope, dataService, $location, $window, cloudinary, Upload, $routeParams) {
	var sc = this;

	$scope.baseURL = "http://res.cloudinary.com/cmpe280/image/upload";
	// initializing function
	sc.initFunction = function() {
		sc.currentUser = angular.fromJson($window.localStorage.currentUser);
		sc.isfollower="";
		getRecipes();
		sc.viewErrorModal=false;
	};    

	// function to get all the news feeds
	function getRecipes() {
		var url = "/api/searchCuisine/" + $routeParams.cuisineName;
		$scope.newsfeedDetails = [];
		var likes = {};
		var temp = [];
		likes.name = sc.currentUser.fName + " " + sc.currentUser.lName;
		likes.username = sc.currentUser.userName;
		dataService.getData(url).success(function(res) {
			var data1 = res.data;
			for (var i = 0; i < data1.length; i++) {
				data1[i].list.isLiked = false;
				data1[i].list.totalLikes = 0;
				temp[i] = data1[i].list;
				if (data1[i].list.likes.length > 0) {
					data1[i].list.totalLikes = data1[i].list.likes.length;
					var likesArray = [];
					likesArray.push(data1[i].list.likes);
					for (var j = 0; j < data1[i].list.totalLikes; j++) {
						if (data1[i].list.likes[j].username == sc.currentUser.userName) {
							data1[i].list.isLiked = true;
						}
					}
					// if (likesArray.indexOf(likes)) {
						//     data1[i].list.isLiked = true;
						// }
				}
			}
			console.log(res.data);
			$scope.newsfeedDetails = temp;
		}).error(function(err) {
			console.log(err);
		});
	}

	sc.viewReceipe = function(id,username) {
		if(sc.currentUser.userName == username){
			$location.path("receipe/" + id);
		}else{
			var url = "/api/checkFollowRequest/"+sc.currentUser.userName+"/"+username;
			dataService.getData(url).success(function(res){
				if(res.data){
					data1 = res.data;
				}
				console.log(res.data);
				if(res.data.length==0){
					sc.isfollower="no";
					$('#recipeModal').modal('show');
					sc.viewErrorModal = true;
				}else if(data1[0].list.username==sc.currentUser.userName && data1[0].list.status==1){
					sc.isfollower="pendingByUser";
					sc.viewErrorModal = true;
				}else if(data1[0].list.username==username && data1[0].list.status==1){
					sc.isfollower="pending";
					sc.viewErrorModal = true;
				}else if(data1[0].list.status==2){
					sc.isfollower="yes";
					$location.path("receipe/" + id);
				}
			}).error(function(err){
				console.log(err);
			});
		}
	};
});