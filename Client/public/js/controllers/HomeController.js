/**
 * Controller for the home.ejs page
 */
recipeApp.controller('HomeController', function($scope, $rootScope, dataService, $location, $window) {
    var hc = this;
    // initializing function called on ng-init
    $scope.initFunction = function() {

        hc.currentUser = angular.fromJson($window.localStorage.currentUser);
        if (!hc.currentUser) {
            $location.path('/');
            $rootScope.userLoggedIn = false;
        } else {
            $rootScope.userLoggedIn = true;
            $rootScope.userName = $window.localStorage.userName;
            $rootScope.userFName = $window.localStorage.userFName;
            $rootScope.userLName = $window.localStorage.userLName;
            $scope.templateView = {
                template: 'templates/profile.html'
            };
            $scope.searchUserNames();
            getFriendsList();
        }

    };

    // getting user.html template
    // $scope.getUserPage = function() {
    //     $scope.templateView.template = 'templates/user.html';
    // };

    // getting profile.html template
    $scope.getHomePage = function() {
        $scope.templateView.template = 'templates/profile.html';
    };

    // getting friends.html template
    $scope.getFriendsPage = function() {
        $scope.templateView.template = 'templates/friends.html';
    };

    // function to get user names and group names for typeahead search inputs
    $scope.searchUserNames = function() {
        $scope.searchInputs = {
            items: []
        };
        var url = 'getAll/' + $rootScope.userName;
        dataService.getData(url, function(err, res) {
            console.log("in getAll");
            if (err) {
                console.log(err);
            } else {
                console.log("res.data in getAll: " + res.data);
                var data1 = res.data;
                for (var i = 0; i < res.data.length; i++) {
                    $scope.searchInputs.items[i] = data1[i];
                }
            }
        });
    };

    // getting the list of friends for the chat box on the home page in the right
    function getFriendsList() {
        $scope.friendsFName = [];
        $scope.friendsLName = [];
        $scope.friends = [];
        var fullName = "";
        var url = 'getFriendList/' + $rootScope.userName;
        dataService.getData(url, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                /*for(var i=0;i<res.data.length;i++){
                	$scope.friendsFName = res.data[i].fname;
                	$scope.friendsLName = res.data[i].lname;
                	fullName = res.data[i].fname+" "+res.data[i].lname;
                	$scope.friends[i] = fullName;
                }*/
                $scope.friends = res.data;
            }
        });
    }

    // function to create a new group by the logged in user
    $scope.createNewGroup = function() {
        $scope.groupModal = false;
        if ($scope.newgroupName && $scope.newMemberName) {
            var newGroupDetails = {
                userName: $rootScope.userName,
                groupName: $scope.newgroupName
            };

            dataService.postData('addGroup', newGroupDetails, function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    $rootScope.newMember = $scope.newMemberName;
                    var addNewMemberDetail = {
                        groupName: $scope.newgroupName,
                        userName: $scope.newMemberName
                    };
                    dataService.postData('addMember', addNewMemberDetail, function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            $scope.newMemberName = "";
                            $scope.newgroupName = "";
                            $scope.getHomePage();
                        }
                    });
                }
            });
        } else {
            $scope.groupModal = true;
        }
    };

    // function to log the user out of the system
    // $scope.logOutUser = function() {
    //     var userDetails = {
    //         userName: $rootScope.userName
    //     };
    //     dataService.postData('logOut', userDetails, function(err, res) {
    //         if (err) {
    //             if (err.status === 500) {
    //                 console.log(err);
    //             } else {
    //                 if (err.status === 403) {
    //                     $location.path('/home');
    //                 }
    //             }
    //         } else {
    //             $window.localStorage.userName = "";
    //             $window.localStorage.userFName = "";
    //             $location.path('/logout');
    //         }
    //     });
    // };


});