recipeApp.controller('LogoutController', function($scope, $rootScope, $location, $window) {

    $scope.initFunction = function() {

        $window.localStorage.clear();
        delete $rootScope.userLoggedIn;
        delete $rootScope.userLName;
        delete $rootScope.userFName;
        $location.path('/');

    };
});