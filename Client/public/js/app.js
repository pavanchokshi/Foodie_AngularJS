/**
 * angular app module
 */

var recipeApp = angular.module("recipeApp", ['ngRoute', 'ui.bootstrap', 'angularMoment', 'cloudinary', 'ngFileUpload'])
    .config(function($routeProvider, $locationProvider) {

        // route handlers to redirect to desired templates
        $routeProvider.when('/', {
            templateUrl: 'addUser',
            controller: 'AddUserController'
        }).when('/home', {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        }).when("/userProfile/:userName", {
            templateUrl: '/templates/userProfile.html',
            controller: 'UserProfileController'
        }).when("/searchRecipes/:cuisineName",{
        	templateUrl: '/templates/searchCuisine.html',
        	controller: 'SearchCuisineController'
        }).when('/me', {
            templateUrl: 'templates/user.html',
            controller: 'UserController'
        }).when("/receipe/:receipeId", {
            templateUrl: '/templates/receipe.html',
            controller: 'ReceipeController'
        }).when('/logout', {
            templateUrl: 'templates/logout.html',
            controller: 'LogoutController'
        }).
        when('/invalid', {
            templateUrl: 'templates/invalid.html',
            //controller : 'GetUserController'
        }).otherwise({
            redirectTo: '/'
        });


        /**
         * to remove hash in the URL
         */
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });