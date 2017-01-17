/**
 * Controller for userProfile.html template
 * which handles searched user's details
 */
recipeApp.controller('UserProfileController', function($scope, $rootScope, dataService, $location, $window, $routeParams) {
    var upc = this;
    $scope.baseURL = "http://res.cloudinary.com/cmpe280/image/upload";
    $scope.overviewDetails = [];
    $scope.name = [];
    $scope.followerList = [];
    $rootScope.userLoggedIn = true;
    // initializing function
    $scope.initFunction = function() {
        var currentUser = angular.fromJson($window.localStorage.currentUser);
        if (!currentUser) {
            $location.path('/');
            $rootScope.userLoggedIn = false;
        } else {
            $scope.searchedUserName = $routeParams.userName;
            $scope.overview = ["Name", "Followers", "Following"];
            // service call to check the status of the friend request sent
            var url = '/api/checkFollowRequest/' + currentUser.userName + '/' + $scope.searchedUserName;
            dataService.getData(url).success(function(res) {
                var data1;
                if (res.data.length) {
                    data1 = res.data;
                }
                if (!res.data.length)
                    upc.isFriend = "no";
                else if (data1[0].list.username == currentUser.userName && data1[0].list.status == 1)
                    upc.isFriend = "pendingByUser";
                else if (data1[0].list.username == $scope.searchedUserName && data1[0].list.status == 1)
                    upc.isFriend = "pending";
                else if (data1[0].list.status == 2)
                    upc.isFriend = "yes";

            }).error(function(err, res) {
                console.log(err);
            });
            getCuisinesList();
            getfollowerDetails();
            getfolloweeDetails();
            $scope.getOverviewDetails("Name");
            $scope.tabActive('about');
        }


    };


    // function to get the friend list of the searched user
    function getCuisinesList() {
        upc.userCuisines = [];
        dataService.getData('/api/cuisineDetails/' + $scope.searchedUserName).success(function(res) {
            for (var i = 0; i < res.data.length; i++) {
                upc.userCuisines.push(res.data[i]);
            }
        }).error(function(err) {
            console.log(err);
        });
    }

    function getfollowerDetails() {
        upc.followers = 0;
        dataService.getData('/api/followerDetails/' + $scope.searchedUserName).success(function(res) {
            upc.followers = res.data.noOfFollowers;
        }).error(function(err) {
            console.log(err);
        });
    }

    function getfolloweeDetails() {
        upc.followees = 0;
        dataService.getData('/api/followeeDetails/' + $scope.searchedUserName).success(function(res) {
            upc.followees = res.data.noOfFollowee;
        }).error(function(err) {
            console.log(err);
        });
    }
    // function to get the user's overview details
    $scope.getOverviewDetails = function(ov) {
        upc.followList = [];
        $rootScope.ovid = '0';
        if (((ov).localeCompare("Name")) == 0) {
            dataService.getData('/api/getUserDetails/' + $scope.searchedUserName).success(function(res) {
                upc.userDetails = res.data;
            }).error(function(err) {
                console.log(err);
            });
        } else {
            switch (ov) {
                case "Followers":
                    dataService.getData('/api/getFollowerList/' + $scope.searchedUserName).success(function(res) {
                        var temp = res.data;
                        for (var i = 0; i < temp.length; i++) {
                            upc.followList.push(temp[i].list);
                        }
                        console.log(res.data);
                    }).error(function(err) {
                        console.log(err);
                    });
                    break;
                case "Following":
                    dataService.getData('/api/getFollowingList/' + $scope.searchedUserName).success(function(res) {
                        var temp = res.data;
                        for (var i = 0; i < temp.length; i++) {
                            upc.followList.push(temp[i].list);
                        }
                    }).error(function(err) {
                        console.log(err);
                    });
                    break;
            }

        }
    };
});