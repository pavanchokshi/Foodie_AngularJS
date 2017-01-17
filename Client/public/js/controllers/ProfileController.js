/**
 * Controller for profile.html template
 */

recipeApp.controller('ProfileController', function($scope, $rootScope, dataService, $location, $window, cloudinary, Upload) {
    var pc = this;
    $scope.baseURL = "http://res.cloudinary.com/cmpe280/image/upload";
    pc.loadingBlock = false;
    // initializing function
    $scope.initFunction = function() {
        pc.currentUser = angular.fromJson($window.localStorage.currentUser);
        getRecipes();
        $scope.newPost = "";
        $scope.steps = [{ desc: '' }, { desc: '' }];
        $scope.ingredients = [{ id: '' }, { id: '' }];
        pc.receipe = {};
        $scope.isAutoScroll();
    };

    $scope.selectedIndex = -1;
    $scope.likePost = function($event, feed) {
        var message = {};
        message.receipeID = feed.id;
        message.likesFullName = pc.currentUser.fName + " " + pc.currentUser.lName;
        message.likesUserId = pc.currentUser.userName;
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

    $scope.isAutoScroll = function() {
        $scope.autoScroll = ($scope.autoScroll) ? false : true;
        return $scope.autoScroll;
    }

    //function for adding/removing steps in Post Receipe Card
    $scope.steps = [{ desc: '' }, { desc: '' }];
    $scope.addNewStep = function(check) {
        if (check) {
            var newItemNo = $scope.steps.length + 1;
            $scope.steps.push({ 'desc': '' });
        }

    };

    $scope.removeStep = function() {
        var index = $(this)[0].$index;
        var lastItem = $scope.steps.length - 1;
        $scope.steps.splice(index, 1);
    };

    //function for adding/removing ingredients in Post Receipe Card

    $scope.ingredients = [{ id: '' }, { id: '' }];
    $scope.addNewIngredient = function(check) {
        if (check) {
            var newItemNo = $scope.ingredients.length + 1;
            $scope.ingredients.push({ 'id': '' });
        }

    };
    $scope.removeIngredient = function() {
        var index = $(this)[0].$index;
        var lastItem = $scope.ingredients.length - 1;
        $scope.ingredients.splice(index, 1);
    };


    // function to get the list of groups
    function getGroupsList() {
        var url = 'showGroupList/' + $rootScope.userName;
        $scope.groups = [];
        dataService.getData(url, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                for (var i = 0; i < res.data.length; i++) {
                    $scope.groups[i] = res.data[i];
                }
            }
        });
    }

    // function to get the groups.html template
    $scope.getTemplate = function(groupName) {
        $window.localStorage.groupName = groupName;
        $rootScope.groupName = groupName;
        $scope.templateView.template = 'templates/groups.html';
    };

    //Post receipe to database
    $scope.postReceipe = function() {
        var url = "/api/postRecipe";
        var steps = [];
        var ingredients = [];
        var tempArray = $scope.steps;
        for (i in tempArray) {
            if (tempArray[i].desc != "") {
                steps.push(tempArray[i].desc);
            }
        }
        var tempArray = $scope.ingredients;
        for (i in tempArray) {
            if (tempArray[i].desc) {
                ingredients.push({
                    'qty': tempArray[i].qty,
                    'qtyUnit': tempArray[i].qtyUnit,
                    'desc': tempArray[i].desc
                });
            }
        }

        pc.receipe.ingredients = ingredients;
        pc.receipe.steps = steps;
        pc.receipe.username = pc.currentUser.userName;
        pc.receipe.name = pc.currentUser.fName + " " + pc.currentUser.lName;
        console.log(pc.receipe);
        dataService.postData(url, pc.receipe).success(function(res) {
            console.log("Success");
            $scope.initFunction();
        }).error(function(err) {
            console.log(err);
        });
    }

    // function to get all the news feeds
    function getRecipes() {
        var url = "/api/getRecipes/" + pc.currentUser.userName;
        $scope.newsfeedDetails = [];
        var likes = {};
        var temp = [];
        likes.name = pc.currentUser.fName + " " + pc.currentUser.lName;
        likes.username = pc.currentUser.userName;
        dataService.getData(url, []).success(function(res) {
            var data1 = res.data;
            for (var i = 0; i < data1.length; i++) {
                data1[i].list.isLiked = false;
                data1[i].list.totalLikes = 0;
                temp[i] = data1[i].list;
                if (data1[i].list.likes.length > 0) {
                    data1[i].list.totalLikes = data1[i].list.likes.length;
                    var likesArray = [];
                    likesArray.push(data1[i].list.likes);
                    for (var j = 0; j < data1[i].list.totalLikes; j++) {
                        if (data1[i].list.likes[j].username == pc.currentUser.userName) {
                            data1[i].list.isLiked = true;
                        }
                    }
                    // if (likesArray.indexOf(likes)) {
                    //     data1[i].list.isLiked = true;
                    // }
                }
            }
            console.log(res.data);
            $scope.newsfeedDetails = temp;
            pc.loadingBlock = true;
        }).error(function(err) {
            console.log(err);
        });
    }

    //view receipe button
    $scope.viewReceipe = function(id) {
        $location.path("receipe/" + id);
    }


    $scope.uploadFiles = function(files) {
        var d = new Date();
        var imageSalt = d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
        angular.forEach(files, function(file) {
            if (file && !file.$error) {
                file.upload = Upload.upload({
                    url: "https://api.cloudinary.com/v1_1/cmpe280/upload",
                    data: {
                        public_id: pc.currentUser.fName + "_" + pc.currentUser.lName + imageSalt, // adding timestamp
                        upload_preset: "utoxi2sm",
                        file: file
                    }
                }).success(function(data, status, headers, config) {
                    $scope.message = file.name;
                    pc.receipe.photoURL = "/v" + data.version + "/" + data.public_id + "." + data.format;
                }).error(function(data, status, headers, config) {
                    $scope.message = "Error in selecting image.";
                });
            }
        });
    };

});