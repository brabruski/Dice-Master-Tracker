var logApp = angular.module('diceApp', ['ngRoute', 'ngAnimate', 'ngAria', 'ngMessages', 'ngMaterial', 'ngMdIcons', 'firebase', 'ngFileUpload']);

//If something doesn't resolve in the route (logApp.config.when) then run this.
logApp.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
        if (error === "AUTH_REQUIRED") {
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
    when('/home', {
        templateUrl: 'Views/home.html',
        controller: 'HomeController'
    }).
    when('/collection', {
        templateUrl: 'Views/cardlist.html',
        controller: 'CardListController',
        resolve: {
            currentAuth: function (Authentication) {
                return Authentication.requireAuth();
            }
        }
    }).
    when('/decks', {
        templateUrl: 'Views/decklist.html',
        controller: 'DeckListController',
        resolve: {
            currentAuth: function (Authentication) {
                return Authentication.requireAuth();
            }
        }
    }).
    when('/details/:itemId', {
        templateUrl: 'Views/carddetails.html',
        controller: 'CardDetailsController',
        resolve: {
            currentAuth: function (Authentication) {
                return Authentication.requireAuth();
            }
        }
    }).
    when('/deckdetails/:deckId', {
        templateUrl: 'Views/deckdetails.html',
        controller: 'DeckDetailsController',
        resolve: {
            currentAuth: function (Authentication) {
                return Authentication.requireAuth();
            }
        }
    }).
    when('/addcollection', {
        templateUrl: 'Views/addnewcard.html',
        controller: 'AddController',
        resolve: {
            currentAuth: function (Authentication) {
                return Authentication.requireAuth();
            }
        }
    }).
    when('/adddeck', {
        templateUrl: 'Views/addnewdeck.html',
        controller: 'AddDeckController',
        resolve: {
            currentAuth: function (Authentication) {
                return Authentication.requireAuth();
            }
        }
    }).
        when('/edit/:itemId', {
            templateUrl: 'Views/cardedit.html',
            controller: 'EditCardController',
            resolve: {
                currentAuth: function (Authentication) {
                    return Authentication.requireAuth();
                }
            }
        }).
   otherwise({
       redirectTo: '/home'
   });
}]);

