logApp.controller('DeckDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', '$routeParams', 'DBServices',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, $routeParams, DBServices) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {

                var deckDetails = DBServices.deckCollection();
                var collectionDetails = DBServices.cardCollection();

                $scope.decks = deckDetails;
                $scope.whichItem = $routeParams.deckId;

                $scope.decks.$loaded().then(function () {
                    var currentDeck = $scope.decks[$scope.whichItem].$id;
                    //!!!!                    var currentCard = $scope.decks[$scope.whichItem].contents[$scope.whichCard].$id;

                    $scope.deckDice = [];
                    var heroCards = [];
                    var actionCards = [];

                    //load cards stored under deck
                    var deckContentDetails = DBServices.deckCollectionContents(currentDeck);
                    //    !!!!               var deckContentQtyDetails = DBServices.deckCollectionContentQty(currentDeck, currentCard);

                    deckContentDetails.$loaded().then(function () {
                        var doesExist = [];
                        for (var i = 0; i < collectionDetails.length; i++) {
                            for (var j = 0; j < deckContentDetails.length; j++) {
                                if (collectionDetails[i].id === deckContentDetails[j].id) {
                                    $scope.deckDice.push(collectionDetails[i]);
                                    doesExist[j] = true;
                                } //end if Loop

                            }// end for loop
                        }//end for loop

                        //add in dice quantities to the correct objects
                        for (i = 0; i < deckContentDetails.length; i++) {
                            for (j = 0; j < deckContentDetails.length; j++) {
                                if ($scope.deckDice[j].id === deckContentDetails[i].id) {
                                    $scope.deckDice[j].diceQuantity = deckContentDetails[i].diceQuantity;
                                }
                            }
                        } //end dice quantity add

                        //remove cards deleted originally from collection from the deck content db
                        for (i = 0; i < deckContentDetails.length; i++) {
                            if (doesExist[i] === undefined) {
                                doesExist[i] = false;
                            }
                        }

                        for (i = 0; i < doesExist.length; i++) {
                            if (doesExist[i] === false) {
                                deckContentDetails.$remove(deckContentDetails[i]);
                            }
                        }

                        //Get correct key for navigating to card details
                        for (i = 0; i < collectionDetails.length; i++) {
                            for (j = 0; j < $scope.deckDice.length; j++) {
                                if (collectionDetails[i].name === $scope.deckDice[j].name) {
                                    //set indexOf to get correct key value for card detail navigation
                                    $scope.deckDice[j].navKey = collectionDetails.indexOf(collectionDetails[i]);
                                }
                            }
                        }

                        //Check for Action or Hero Cards
                        for (i = 0; i < $scope.deckDice.length; i++) {
                            if ($scope.deckDice[i].cardtype === "Action") {
                                actionCards.push($scope.deckDice[i].id);
                            } else {
                                heroCards.push($scope.deckDice[i].id);

                            }
                        }

                        //Hide card version headings if they are action cards
                        $scope.hideActionVersion = function (typeOfCard) {
                            if (typeOfCard === 'Action') {
                                return true;
                            } else {
                                return false;
                            }
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

                            for (i = 0; i < deckContentDetails.length; i++) {
                                if ($scope.deckDice[key].id === deckContentDetails[i].id) {
                                    deckContentDetails.$remove(i);
                                }
                            }
                            $scope.deckDice.splice(key, 1);

                        }; //End Remove funtion

                        //watch for changes made to collection
                        $scope.howManyHeroes = heroCards.length;
                        $scope.howManyActions = actionCards.length;
                        $scope.$watch('howManyHeroes', function () {
                            $scope.howManyHeroes = heroCards.length;
                        });

                        $scope.$watch('howManyActions', function () {
                            $scope.howManyActions = actionCards.length;
                        });

                    }); //end $scope.diceList.$loaded function

                }); //end $scope.decks.$loaded function

            } // End auth If Statement
        }); //End Authorisation Function
    }]); //End controller Statement