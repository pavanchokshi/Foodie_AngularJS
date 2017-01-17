angular.module('recipeApp', ['angularMoment']).filter('fromNow', function() {
    return function(date) {
        return moment.utc(date).format().fromNow();
    }
});