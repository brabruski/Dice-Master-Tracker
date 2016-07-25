logApp.controller('DeckDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', '$routeParams',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, $routeParams) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var deckRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks');
                var deckInfo = $firebaseArray(deckRef);

                $scope.decks = deckInfo;
                $scope.whichItem = $routeParams.deckId;

                $scope.decks.$loaded().then(function () {
                    var currentDeck = $scope.decks[$scope.whichItem].$id;
                    //load cards stored under deck
                    var deckContentRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + currentDeck + '/contents');
                    var deckContentInfo = $firebaseArray(deckContentRef);
                    $scope.dice = deckContentInfo;

                    //remove card from deck
                    $scope.removeCard = function (key) {
                        deckContentInfo.$remove(key);
                    };

                    //create an anon function which works after database has loaded
                    if ($routeParams.deckId > 0) {
                        $scope.prevItem = Number($routeParams.deckId) - 1;
                    } else {
                        $scope.prevItem = $scope.decks.length - 1;
                    }

                    if ($routeParams.deckId < $scope.decks.length - 1) {
                        $scope.nextItem = Number($routeParams.deckId) + 1;
                    } else {
                        $scope.nextItem = 0;
                    }
                }) //end loaded function
            }
        });

    }]);