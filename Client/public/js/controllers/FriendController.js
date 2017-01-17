/**
 * Controller for the friend.html file
 */
recipeApp.controller('FriendController',function($scope,$rootScope,dataService,$location,$window){
	
	//initializing function that is called every time the template is called
	$scope.initFunction = function(){
		$rootScope.userName = $window.localStorage.userName;
		getFriendsList();
		getPendingFriendsList();
	};
	
	//function to add an user as a friend
	$scope.addFriend=function(pfName){
		var pfdetails={
				userName : $rootScope.userName,
				withUser : pfName				
		};

		dataService.postData('confirmFriend',pfdetails,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.initFunction();
			}
		});
	};
	
	// function to get the list of friends for the user logged in
	function getFriendsList(){
		$scope.friendsFName = [];
		$scope.friendsLName = [];
		$scope.friends=[];
		var fullName = "";
		var url = 'getFriendList/'+ $rootScope.userName;
		dataService.getData(url,function(err,res){
			if(err){
				console.log(err);
			}else{
				/*for(var i=0;i<res.data.length;i++){
					$scope.friendsFName = res.data[i].fname;
					$scope.friendsLName = res.data[i].lname;
					fullName = res.data[i].fname+" "+res.data[i].lname;
					$scope.friends[i] = fullName;
				}*/
				$scope.friends=res.data;
			}
		});
	}

	// function to get the list of pending friend requests
	function getPendingFriendsList(){
		$scope.pendingFriends=[];
		var url = 'getPendingFriendsList/'+ $rootScope.userName;
		dataService.getData(url,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.pendingFriends = res.data;
			}
		});
	}
});