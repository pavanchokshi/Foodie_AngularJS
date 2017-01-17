/**
 * Controller to handle addUser.ejs file
 */
'use strict';
recipeApp.controller('AddUserController', function($scope, $rootScope, dataService, $location, $window, cloudinary, Upload) {

    /*
     * called when the user clicks the sign up page
     */
    var userDetails = {};
    $scope.addUser = function() {
        console.log("Add User");
        //input validation 
        if ($scope.signUpForm.fName.$invalid || $scope.signUpForm.lName.$invalid ||
            $scope.signUpForm.userName.$invalid || $scope.signUpForm.reuserName.$invalid ||
            $scope.signUpForm.pwd.$invalid) {
            $scope.reqdError = true;
        } else {
            var emailPattern = /.+@.+\..+/i;
            if (!(($scope.userName).match(emailPattern))) {
                $scope.usernameInvalid = true;
            } else if ((!(($scope.userName).localeCompare($scope.reuserName)) == 0)) {
                $scope.usernameInvalid = false;
                $scope.emailNoMatch = true;
            } else {
                //proceed if inputs are correct
                userDetails.fName = $scope.fName;
                userDetails.lName = $scope.lName;
                userDetails.userName = $scope.userName;
                userDetails.password = $scope.pwd;

                //call to the post service to write to the db
                dataService.postData('/api/signUp', userDetails).success(function(res) {

                    $rootScope.userName = $scope.userName;
                    var currentUser = {
                        'fName': $scope.fName,
                        'lName': $scope.lName,
                        'userName': $scope.userName
                    };
                    $window.localStorage.currentUser = angular.toJson(currentUser);
                    $location.path('/home');
                }).error(function(err) {
                    $scope.errorMessage = "Error in user signup";
                });
            }
        }
    };

    $scope.uploadFiles = function(files) {
        var d = new Date();
        var imageSalt = d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
        angular.forEach(files, function(file) {
            if (file && !file.$error) {
                file.upload = Upload.upload({
                    url: "https://api.cloudinary.com/v1_1/cmpe280/upload",
                    data: {
                        public_id: $scope.fName + "_" + $scope.lName + imageSalt, // adding timestamp
                        upload_preset: "utoxi2sm",
                        file: file
                    }
                }).success(function(data, status, headers, config) {
                    $scope.message = file.name;
                    userDetails.photoURL = "/v" + data.version + "/" + data.public_id + "." + data.format;
                }).error(function(data, status, headers, config) {
                    $scope.message = "Error in selecting image.";
                });
            }
        });
    };
});