/**
 * Controller for userProfile.html template
 * which handles searched user's details
 */
recipeApp.controller('UserController', function($scope, $rootScope, dataService, $location, $window, $routeParams) {
    var uc = this;
    $scope.nameValue = true;
    $scope.followValue = false;
    $scope.userDetails = {};
    $scope.cuisineDetails = [];
    $scope.overviewDetails = [];
    $rootScope.userLoggedIn = true;
    uc.showLoadingBlock = true;
    uc.showProgress = false;
    $scope.followerList = [];
    $scope.baseURL = "http://res.cloudinary.com/cmpe280/image/upload";
    // initializing function
    $scope.initFunction = function() {

        $scope.userCuisines = [];
        uc.currentUser = angular.fromJson($window.localStorage.currentUser);
        if (!uc.currentUser) {
            $location.path('/');
            $rootScope.userLoggedIn = false;
        } else {
            uc.newFname = uc.currentUser.fName;
            uc.newLname = uc.currentUser.lName;
            uc.fName = uc.newFname;
            uc.lName = uc.newLname;
            getCuisinesList();
            getfollowerDetails();
            getfolloweeDetails();
            $scope.getOverviewDetails("Name");
            $scope.tabActive('about');
        }
    };


    // function to get the friend list of the searched user
    function getCuisinesList() {
        uc.userCuisines = [];
        dataService.getData('/api/cuisineDetails/' + uc.currentUser.userName).success(function(res) {
            for (var i = 0; i < res.data.length; i++) {
                uc.userCuisines.push(res.data[i]);
            }
            uc.showLoadingBlock = false;
        }).error(function(err) {
            console.log(err);
        });
    }

    function getfollowerDetails() {
        uc.followers = 0;
        dataService.getData('/api/followerDetails/' + uc.currentUser.userName).success(function(res) {
            uc.followers = res.data.noOfFollowers;
        }).error(function(err) {
            console.log(err);
        });
    }

    function getfolloweeDetails() {
        uc.followees = 0;
        dataService.getData('/api/followeeDetails/' + uc.currentUser.userName).success(function(res) {
            uc.followees = res.data.noOfFollowee;
        }).error(function(err) {
            console.log(err);
        });
    }
    // function to get the user's overview details
    $scope.getOverviewDetails = function(ov) {
        uc.followList = [];
        $rootScope.ovid = '0';
        if (((ov).localeCompare("Name")) == 0) {
            dataService.getData('/api/getUserDetails/' + uc.currentUser.userName).success(function(res) {
                uc.userDetails = res.data;
            }).error(function(err) {
                console.log(err);
            });
        } else {
            switch (ov) {
                case "Followers":
                    uc.showProgress = true;
                    dataService.getData('/api/getFollowerList/' + uc.currentUser.userName).success(function(res) {
                        var temp = res.data;
                        for (var i = 0; i < temp.length; i++) {
                            uc.followList.push(temp[i].list);
                        }
                        uc.showProgress = false;
                    }).error(function(err) {
                        console.log(err);
                    });
                    break;
                case "Following":
                    uc.showProgress = true;
                    dataService.getData('/api/getFollowingList/' + uc.currentUser.userName).success(function(res) {
                        var temp = res.data;
                        for (var i = 0; i < temp.length; i++) {
                            uc.followList.push(temp[i].list);
                        }
                        uc.showProgress = false;
                    }).error(function(err) {
                        console.log(err);
                    });
                    break;
            }

        }
    };

    $scope.showNamesInputBox = false;
    $scope.updateName = function() {

        $scope.showNamesInputBox = !$scope.showNamesInputBox;
        if ($scope.showNamesInputBox) {
            console.log("Show Box");
        } else {
            $scope.showNamesInputBox = true;
            console.log("Update in db");
            var userDetails = {
                fName: uc.newFname,
                lName: uc.newLname,
                userName: uc.currentUser.UserName
            };
            //call to the post service to write to the db
            dataService.postData('/api/updateUserName', userDetails).success(function(res) {
                console.log("in success");
                var currentUser = {
                    'fName': uc.newFname,
                    'lName': uc.newLname,
                    'userName': uc.currentUser.userName,
                    'photoURL': uc.currentUser.photoURL,
                    'timestamp': uc.currentUser.timestamp
                };
                $window.localStorage.clear();
                $window.localStorage.currentUser = angular.toJson(currentUser);
                uc.fName = uc.newFname;
                uc.lName = uc.newLname;
                //$scope.initFunction();
                $scope.showNamesInputBox = false;
            }).error(function(err) {
                if (err.status === 500) {
                    console.log("in error");
                }
            });
        }
    };

    // activating tabs for viewing overview, friends or interests of the user searched
    $scope.tabActive = function(tabName) {
        switch (tabName) {
            case 'about':
                $scope.about = true;
                $scope.interests = false;
                break;
            case 'interests':
                $scope.about = false;
                $scope.interests = true;
                break;
        }
    };

});