logApp.controller('DeckDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', '$routeParams', 'DBServices', 'CollectionFactory', 'MaterialFunc',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, $routeParams, DBServices, CollectionFactory, MaterialFunc) {

        var ref = new Firebase(Config.FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {

                var deckDetails = DBServices.deckCollection();
                var collectionDetails = DBServices.cardCollection();

                $scope.decks = deckDetails;
                $scope.whichItem = $routeParams.deckId;

                $scope.decks.$loaded().then(function () {
                    var currentDeck = $scope.decks[$scope.whichItem].$id;

                    var heroCards = [];
                    var actionCards = [];

                    //load cards stored under deck
                    var deckContentDetails = DBServices.deckCollectionContents(currentDeck);

                    deckContentDetails.$loaded().then(function () {
                        var doesExist = CollectionFactory.existArray(collectionDetails, deckContentDetails);
                        $scope.deckDice = CollectionFactory.deckDiceArray(collectionDetails, deckContentDetails);

                        //add in dice quantities to the correct card objects
                        for (i = 0; i < deckContentDetails.length; i++) {
                            for (j = 0; j < $scope.deckDice.length; j++) {
                                if ($scope.deckDice[j].id === deckContentDetails[i].id) {
                                    $scope.deckDice[j].diceQuantity = deckContentDetails[i].diceQuantity;
                                }
                            }
                        } //end dice quantity add

                        //remove cards deleted originally from collection from the deck content db
                        for (i = 0; i < doesExist.length; i++) {
                            if (doesExist[i] === false) {
                                deckContentDetails.$remove(deckContentDetails[i]);
                            }
                        }

                        //Get correct key for navigating to card details
                        for (i = 0; i < collectionDetails.length; i++) {
                            for (j = 0; j < $scope.deckDice.length; j++) {
                                if (collectionDetails[i].id === $scope.deckDice[j].id) {
                                    //set indexOf to get correct key value for card detail navigation
                                    $scope.deckDice[j].navKey = collectionDetails.indexOf(collectionDetails[i]);
                                }
                            }
                        }

                        //show the add to deck components
                        $scope.showAddTo = function (currentItem) {
                            currentItem.show = !currentItem.show;
                        };


                        var cardTypeCheckAction = function () {
                            var tempScope = $scope.deckDice;
                            actionCards = CollectionFactory.cardTypeCheckAction(tempScope);
                            return actionCards;
                        };

                        var cardTypeCheckHero = function () {
                            var tempScope = $scope.deckDice;
                            heroCards = CollectionFactory.cardTypeCheckHero(tempScope);
                            return heroCards;
                        };

                        //Check how many dice and cards in a deck
                        var countHeroDice = function () {
                            var tempDb = $scope.deckDice;
                            var heroCount = CollectionFactory.countItem(tempDb, "Hero / Villain");
                            return heroCount;
                        };

                        var countActionCard = function () {
                            var actionCount = actionCards.length;
                            return actionCount;
                        };

                        var countHeroCard = function () {
                            var heroCount = heroCards.length;
                            return heroCount;
                        };

                        //Hide card details if they are action cards
                        $scope.hideActionVersion = function (typeOfCard) {
                            var isAction = CollectionFactory.hideActionVersion(typeOfCard);
                            return isAction;
                        };

                        $scope.getRarity = function (item) {
                            var rarity = CollectionFactory.getRarity(item);
                            return rarity;
                        }

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
                                                var addSuccessMsg = 'Quantity Updated Successfully';
                                                $scope.showSimpleToast(addSuccessMsg);
                                                $scope.deckDice.success = false;
                                                cardName.success = true;
                                                $scope.howManyHeroDice = countHeroDice();
                                            });
                                        });
                                    }
                                }

                            }); //end deckContents.loaded

                        }; // End submitNewQuanity

                        //Navigation Buttons
                        $scope.prevItem = CollectionFactory.prevBtn($routeParams.deckId, $scope.decks);
                        $scope.nextItem = CollectionFactory.nextBtn($routeParams.deckId, $scope.decks);

                        //remove card from deck
                        removeCard = function (idKey) {
                            var deleteDeckIndex = CollectionFactory.checkItemKey(deckContentDetails, idKey);

                            var scopeDeckIndex = 0;
                            for (j = 0; j < $scope.deckDice.length; j++) {
                                if (idKey === $scope.deckDice[j].id) {
                                    scopeDeckIndex = j;
                                }
                            }
                            deckContentDetails.$remove(deleteDeckIndex);
                            $scope.deckDice.splice(scopeDeckIndex, 1);
                            actionCards = cardTypeCheckAction();
                            heroCards = cardTypeCheckHero();
                            $scope.howManyActions = countActionCard();
                            $scope.howManyHeroes = countHeroCard();

                        }; //End Remove funtion

                        //Delete Card Modal
                        $scope.removeItem = function (ev, idKey) {
                            MaterialFunc.confirmDelete(ev, idKey).then(function () {
                                //remove card from database
                                removeCard(idKey);
                                addSuccessMsg = 'Card Removed Successfully';
                                $scope.showSimpleToast(addSuccessMsg);
                            }, function () {
                                addSuccessMsg = 'Card Removal Cancelled';
                                $scope.showSimpleToast(addSuccessMsg);
                            });
                        }; //end delete function

                        //toast functions
                        $scope.toastPosition = MaterialFunc.toastDetails();

                        $scope.getToastPosition = function () {
                            return MaterialFunc.getToastPos(MaterialFunc.toastDetails());
                        };

                        $scope.showSimpleToast = function (message) {
                            var pinTo = $scope.getToastPosition();
                            return MaterialFunc.showToast(pinTo, message);
                        };

                        $scope.diceBadge = function (maxAllow, currentQty) {
                            return CollectionFactory.getBadgeColour(maxAllow, currentQty);
                        };

                        //Run type functions
                        actionCards = cardTypeCheckAction();
                        heroCards = cardTypeCheckHero();
                        $scope.howManyHeroes = countHeroCard();
                        $scope.howManyActions = countActionCard();
                        $scope.howManyHeroDice = countHeroDice();

                    }); //end $scope.diceList.$loaded function
                }); //end $scope.decks.$loaded function

            } // End auth If Statement
        }); //End Authorisation Function
    }]); //End controller Statement