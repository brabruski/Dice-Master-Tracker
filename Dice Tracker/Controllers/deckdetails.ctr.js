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
                    var heroCards = [];
                    var actionCards = [];

                    //load cards stored under deck
                    var deckContentRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + currentDeck + '/contents');
                    var deckContentInfo = $firebaseArray(deckContentRef);

                    deckContentInfo.$loaded().then(function () {

                        for (var i = 0; i < collectionInfo.length; i++) {
                            for (var j = 0; j < deckContentInfo.length; j++) {
                                if (collectionInfo[i].id === deckContentInfo[j].id) {
                                    $scope.deckDice.push(collectionInfo[i]);
                                } //end if Loop                                
                            }// end for loop
                        }//end for loop

                        for (i = 0; i < collectionInfo.length; i++) {
                            for (j = 0; j < $scope.deckDice.length; j++) {
                                if (collectionInfo[i].name === $scope.deckDice[j].name) {
                                    //set indexOf to get correct key value for card detail navigation
                                    $scope.deckDice[j].navKey = collectionInfo.indexOf(collectionInfo[i]);
                                }
                            }
                        }

                        for (i = 0; i < $scope.deckDice.length; i++) {
                            //Check for Action or Hero Cards
                            if ($scope.deckDice[i].cardtype === "Action") {
                                actionCards.push($scope.deckDice[i].id);
                            } else {
                                heroCards.push($scope.deckDice[i].id);

                            }
                        }

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

                        //watch for changes made to collection
                        $scope.howManyHeroes = heroCards.length;
                        $scope.howManyActions = actionCards.length;
                        $scope.$watch('howManyHeroes', function () {
                            $scope.howManyHeroes = heroCards.length;
                        });

                        $scope.$watch('howManyActions', function () {
                            $scope.howManyActions = actionCards.length;
                        });

                        //remove card from deck
                        $scope.removeItem = function (key) {
                            for (j = 0; j < heroCards.length; j++) {
                                if ($scope.deckDice[key].id === heroCards[j]) {
                                    heroCards.splice(j, 1);
                                }
                            }
                            for (j = 0; j < actionCards.length; j++) {
                                if ($scope.deckDice[key].id === actionCards[j]) {
                                    actionCards.splice(j, 1);
                                }
                            }

                            for (i = 0; i < deckContentInfo.length; i++) {
                                if ($scope.deckDice[key].id === deckContentInfo[i].id) {
                                    deckContentInfo.$remove(i);
                                }
                            }
                            $scope.deckDice.splice(key, 1);

                        }; //End Remove funtion

                    }); //end $scope.diceList.$loaded function

                }); //end $scope.decks.$loaded function

            } // End auth If Statement
        }); //End Authorisation Function
    }]); //End controller Statement