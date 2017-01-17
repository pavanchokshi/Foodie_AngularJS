/**
 * New node file
 */
recipeApp.controller('IndexController', function($scope, $rootScope, dataService, $location, $window, $routeParams) {
    var currentUser = angular.fromJson($window.localStorage.currentUser);

    $rootScope.searchUserCuisine = function() {
        $scope.searchInputs = {
            items: []
        };
        var url = '/api/getAll/' + currentUser.userName;
        dataService.getData(url).success(function(res) {
            console.log("in getAll");

            console.log("res.data in getAll: ");
            console.log(res.data);
            var data1 = res.data;
            for (var i = 0; i < res.data.length; i++) {
                $scope.searchInputs.items[i] = data1[i];
            }
        }).error(function(err) {
            console.log(err);
        });
    };

    // opening an appropriate group page or user profile upon search
    $rootScope.showSearchResult = function() {
        var emailPattern = /.+@.+\..+/i;
        if (($scope.selectedInput).match(emailPattern)) {
            $window.localStorage.searchedUserName = $scope.selectedInput;
            $location.path('/userProfile/' + $scope.selectedInput);
        } else {
            $window.localStorage.cuisineName = $scope.selectedInput;
            console.log($scope.selectedInput);
            $location.path('/searchRecipes/' + $scope.selectedInput);
        }
    };

});