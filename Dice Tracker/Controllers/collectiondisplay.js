/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('ListController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var collectionRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                $scope.dice = $firebaseArray(collectionRef);

                $scope.dice.$loaded().then(function() {
                    $scope.diceOrder = 'name';

                    $scope.deleteCard = function (key) {
                        $scope.dice.$remove(key);
                    };
                });
                
            }
        });

    }]);

logApp.controller('DetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', '$routeParams',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, $routeParams) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var collectionRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                $scope.dice = $firebaseArray(collectionRef);

                $scope.dice.$loaded().then(function() {
                    $scope.whichItem = $routeParams.itemId;

                    if ($routeParams.itemId > 0) {
                        $scope.prevItem = Number($routeParams.itemId) - 1;
                    } else {
                        $scope.prevItem = $scope.dice.length - 1;
                    }

                    if ($routeParams.itemId < $scope.dice.length - 1) {
                        $scope.nextItem = Number($routeParams.itemId) + 1;
                    } else {
                        $scope.nextItem = 0;
                    }
                });
            }
        });

    }]);