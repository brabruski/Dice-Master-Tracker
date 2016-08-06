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

                    $scope.deckDice = [];
                    var heroCards = [];
                    var actionCards = [];

                    //load cards stored under deck
                    var deckContentDetails = DBServices.deckCollectionContents(currentDeck);

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

                        var cardTypeCheckAction = function () {
                            //Check for Action Cards
                            for (i = 0; i < $scope.deckDice.length; i++) {
                                if ($scope.deckDice[i].cardtype === "Action") {
                                    actionCards.push($scope.deckDice[i].id);
                                }
                            }
                            return actionCards;
                        };

                        var cardTypeCheckHero = function () {
                            //Check for Hero Cards
                            for (i = 0; i < $scope.deckDice.length; i++) {
                                if ($scope.deckDice[i].cardtype === "Hero / Villain") {
                                    heroCards.push($scope.deckDice[i].id);
                                }
                            }
                            return heroCards;
                        };



                        //Check how many hero dice altogether
                        var countHeroDice = function () {
                            var diceCount = 0;

                            for (i = 0; i < $scope.deckDice.length; i++) {
                                if ($scope.deckDice[i].cardtype === "Hero / Villain") {
                                    diceCount = diceCount + $scope.deckDice[i].diceQuantity;
                                }
                            }
                            return diceCount;
                        };

                        //Hide card details if they are action cards
                        $scope.hideActionVersion = function (typeOfCard) {
                            if (typeOfCard === 'Action') {
                                return true;
                            } else {
                                return false;
                            }
                        };

                        //show the add to deck components
                        $scope.showAddTo = function (currentItem) {
                            currentItem.show = !currentItem.show;
                            if (currentItem.currentState === 'expanded') {
                                currentItem.currentState = '';
                            } else {
                                currentItem.currentState = 'expanded';
                            }
                        };

                        //Adjust Dice Quantity in Deck
                        $scope.submitNewQuantity = function (cardName, newQuantity) {
                            var editThisDeck = currentDeck;
                            var deckContentDetails = DBServices.deckCollectionContents(editThisDeck);
                            $scope.deckContents = deckContentDetails;

                            var newContentsData = {
                                name: cardName.name,
                                id: cardName.id,
                                diceQuantity: newQuantity,
                                date: Firebase.ServerValue.TIMESTAMP
                            };

                            $scope.deckContents.$loaded().then(function () {

                                //set all success attributes to false
                                for (k = 0; k < $scope.deckDice.length; k++) {
                                    $scope.deckDice[k].success = false;
                                }

                                //Remove and add new quantity
                                for (i = 0; i < deckContentDetails.length; i++) {
                                    if (deckContentDetails[i].id === cardName.id) {
                                        deckContentDetails.$remove(deckContentDetails[i]).then(function () {
                                            deckContentDetails.$add(newContentsData).then(function () {
                                                $scope.successQuantityMessage = 'Quantity Updated Successfully';
                                                $scope.deckDice.success = false;
                                                cardName.success = true;
                                            });
                                        });
                                    }
                                }

                            }); //end deckContents.loaded

                        }; // End submitNewQuanity

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


                        //Run type functions
                        actionCards = cardTypeCheckAction();
                        heroCards = cardTypeCheckHero();
                                             
                        $scope.howManyHeroes = heroCards.length;
                        $scope.howManyActions = actionCards.length;
                        $scope.howManyHeroDice = countHeroDice();

                        //watch for changes made to collection
                        $scope.$watch('howManyHeroes', function () {
                            $scope.howManyHeroes = heroCards.length;
                        });

                        $scope.$watch('howManyActions', function () {
                            $scope.howManyActions = actionCards.length;
                        });

                        $scope.$watch('howManyHeroDice', function () {
                            $scope.howManyHeroDice = countHeroDice();
                        });

                    }); //end $scope.diceList.$loaded function

                }); //end $scope.decks.$loaded function

            } // End auth If Statement
        }); //End Authorisation Function
    }]); //End controller Statement