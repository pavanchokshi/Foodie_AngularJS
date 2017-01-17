recipeApp.controller('ReceipeController', function($scope, $rootScope, $routeParams, dataService, $window) {
    var rc = this;
    $scope.baseURL = "http://res.cloudinary.com/cmpe280/image/upload";
    $scope.initFunction = function() {
        rc.currentUser = angular.fromJson($window.localStorage.currentUser);
        if (!rc.currentUser) {
            $location.path('/');
            $rootScope.userLoggedIn = false;
        } else {
            $rootScope.userLoggedIn = true;
            getReceipe();
        }
    };

    $scope.likePost = function($event, feed) {
        var message = {};
        message.receipeID = feed.id;
        message.likesFullName = rc.currentUser.fName + " " + rc.currentUser.lName;
        message.likesUserId = rc.currentUser.userName;
        console.log(message);
        if (feed.isLiked) {
            feed.totalLikes = feed.totalLikes - 1;
            message.isLike = false;
        } else {
            feed.totalLikes = feed.totalLikes + 1;
            message.isLike = true;
        }
        feed.isLiked = !feed.isLiked;
        dataService.postData('/api/likeReceipe', message).success(function(response) {
            console.log(response);
        }).error(function(err) {
            console.log(err);
        });
    }

    function getReceipe() {

        var url = "/api/getReceipe/" + $routeParams.receipeId;
        dataService.getData(url, []).success(function(res) {
            $scope.receipe = res.data[0];
            $scope.receipe.totalLikes = $scope.receipe.likes.length;
            $scope.receipe.isLiked = false;
            for (var i = 0; i < $scope.receipe.totalLikes; i++) {
                if (rc.currentUser.userName == $scope.receipe.likes[i].username) {
                    $scope.receipe.isLiked = true;
                }
            }
        }).error(function(err) {
            console.log(err);
        });
    }
});