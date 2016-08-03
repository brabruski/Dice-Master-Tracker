logApp.controller('DeckDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', '$routeParams',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, $routeParams) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var deckRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks');
                var deckInfo = $firebaseArray(deckRef);

                var collectionRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                var collectionInfo = $firebaseArray(collectionRef);

                $scope.decks = deckInfo;
                $scope.whichItem = $routeParams.deckId;

                $scope.decks.$loaded().then(function () {
                    var currentDeck = $scope.decks[$scope.whichItem].$id;
                    $scope.deckDice = [];
                    //load cards stored under deck
                    var deckContentRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + currentDeck + '/contents');
                    var deckContentInfo = $firebaseArray(deckContentRef);

                    $scope.diceList = deckContentInfo;
                    $scope.diceList.$loaded().then(function () {

                        for (var i = 0; i < collectionInfo.length; i++) {
                            for (var j = 0; j < $scope.diceList.length; j++) {
                                if (collectionInfo[i].name === $scope.diceList[j].name) {
                                    $scope.deckDice.push(collectionInfo[i]);
                                }
                            }
                        }

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
                    }); //end $scope.diceList.$loaded function

                }); //end $scope.decks.$loaded function

            }
        });

    }]);