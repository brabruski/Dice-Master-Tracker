var logApp = angular.module('diceApp', ['ngRoute', 'ngAnimate', 'firebase']).constant('FIREBASE_URL', 'https://dicetracker18052016.firebaseio.com/');

//If something doesn't resolve in the route (logApp.config.when) then run this.
logApp.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
        if (error == "AUTH_REQUIRED") {
            $rootScope.message = 'You need to log in to access that page';
            $location.path('/login');
        }
    });
}]);

logApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/login', {
        templateUrl: 'Views/login.html',
        controller: 'RegistrationController'
    }).
    when('/register', {
        templateUrl: 'Views/register.html',
        controller: 'RegistrationController'
    }).
    when('/list', {
        templateUrl: 'partials/list.html',
        controller: 'ListController',
        resolve: {
            currentAuth: function (Authentication) {
                return Authentication.requireAuth();
            }
        }
    }).
    when('/details/:itemId', {
        templateUrl: '/partials/details.html',
        controller: 'DetailsController',
        resolve: {
            currentAuth: function (Authentication) {
                return Authentication.requireAuth();
            }
        }
    }).
    otherwise({
        redirectTo: '/login',
    })
}]);

