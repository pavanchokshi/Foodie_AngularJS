/**
 * Controller for log in form in addUser.ejs
 */
'use strict';
recipeApp.controller('GetUserController', function($scope, $rootScope, dataService, $location, $window) {

    // function to log the user in to the system
    $scope.getUser = function() {
        var userDetails = {
            userName: $scope.uName,
            password: $scope.pswd
        };
        // calling the post service to get the details
        dataService.postData('/api/logIn', userDetails).success(function(response) {
            if (response.code == "200") {

                $rootScope.userName = $scope.uName;
                var currentUser = {
                    'fName': response.data.fname,
                    'lName': response.data.lname,
                    'photoURL': response.data.photoURL,
                    'timestamp': response.data.timestamp,
                    'userName': $scope.uName
                };
                $window.localStorage.currentUser = angular.toJson(currentUser);
                $rootScope.me = currentUser;
                $location.path('/home');
            } else {
                $scope.errorMessage = response.value;
            }
        }).error(function(err) {
            console.log(err);
        });
    };

    $scope.closeError = function() {
        $scope.uName = "";
        $scope.pswd = "";
    };
});