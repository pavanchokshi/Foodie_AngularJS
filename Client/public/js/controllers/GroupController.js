/**
 * Controller for the group.html template
 */
recipeApp.controller('GroupController',function($scope,$rootScope,dataService,$location,$window){

	// initialization function called on ng-init
	$scope.initFunction = function(){
		$rootScope.userName = $window.localStorage.userName;
		$scope.groupName = $window.localStorage.groupName;
		getGroupInfo($scope);
		getGroupAdmin($scope);
		getPendingRequests($scope);
	};
	
	// function to get the group admin
	function getGroupAdmin($scope){
		var userName = $rootScope.userName;
		var groupName = $scope.groupName;
		$scope.isAdmin=false;
		$scope.isAdminDelete=true;

		var url = "getGroupAdmin/"+groupName;
		dataService.getData(url,function(err,res){
			if(err){
				console.log(err);
			}else{
				console.log(res.data);
				$scope.groupAdmin = res.data[0].created_by;
				if((($scope.groupAdmin).localeCompare(userName))==0){
					$scope.isAdmin = true;
					$scope.isAdminDelete=false;
				}
			}
		});
	}
	
	// function to get the group information
	function getGroupInfo($scope){
		var groupName = $scope.groupName;
		var userName = $rootScope.userName;
		$scope.joinGroup=false;
		$scope.isMember=true;
		$scope.members=[];
		var url = "showMembers/"+ groupName;
		dataService.getData(url,function(err,res){
			if(err){
				console.log(err);
			}else{
				for(var i=0;i<res.data.length;i++){
					$scope.members[i] = res.data[i];
					if((($scope.members[i]).localeCompare(userName))==0){
						$scope.isMember=false;
					}
				}
			}
		});
	}
	
	// function to get the pending requests for an admin
	function getPendingRequests($scope){
		$scope.pendingRequests=[];
		var groupName = $scope.groupName;
		var url = "getPendingRequests/"+groupName;
		dataService.getData(url,function(err,res){
			console.log("in dataService.getData");
			if(err){
				console.log(err);
			}else{
				for(var i=0;i<res.data.length;i++){
					$scope.pendingRequests[i] = res.data[i];
				}
			}
		});
	}
	
	// function to delete a group by the admin
	$scope.deleteGroup = function(){
		var details = {
			groupName: $scope.groupName
		};

		dataService.postData('deleteGroup',details,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.templateView.template='templates/profile.html';
			}
		});
	};
	
	// function to delete a member by the admin
	$scope.deleteMember = function(memberName){
		var memberDetails = {
				groupName : $scope.groupName,
				userName : memberName
		};
		dataService.postData('deleteMember',memberDetails,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.initFunction();
			}
		});
	};
	
	// function to add a member into the group
	$scope.addMember = function(){
		$scope.joinGroup=false;
		$scope.requestSent=true;
		var details={
				groupName: $scope.groupName,
				userName: $rootScope.userName
		};

		dataService.postData('addMember',details,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.initFunction();
			}
		});
	};
	
	// function to confirm a member into the group
	$scope.confirmMember = function(memberName){
		var details = {
				groupName: $scope.groupName,
				userName: memberName
		};
		dataService.postData('confirmMember',details,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.initFunction();
			}
		});

	};
});