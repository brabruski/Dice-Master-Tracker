logApp.controller('DeckDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', '$routeParams', 'DBServices', '$mdToast', '$mdDialog',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, $routeParams, DBServices, $mdToast, $mdDialog) {

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
                            for (j = 0; j < $scope.deckDice.length; j++) {
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

                        //show the add to deck components
                        $scope.showAddTo = function (currentItem) {
                            currentItem.show = !currentItem.show;
                        };

                        var cardTypeCheckAction = function () {
                            actionCards = [];
                            //Check for Action Cards
                            for (i = 0; i < $scope.deckDice.length; i++) {
                                if ($scope.deckDice[i].cardtype === "Action") {
                                    actionCards.push($scope.deckDice[i].id);
                                }
                            }
                            return actionCards;
                        };

                        var cardTypeCheckHero = function () {
                            heroCards = [];
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
                            if (typeOfCard === 'Action') {
                                return true;
                            } else {
                                return false;
                            }
                        };

                        $scope.getRarity = function (item) {
                            var rarity = ["common", "uncommon", "rare", "srare"]
                            switch (item.rarity) {
                                case "Uncommon":
                                    return rarity[1];
                                case "Rare":
                                    return rarity[2];
                                case "Super Rare":
                                    return rarity[3];
                                default:
                                    return rarity[0];
                            }
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
                        removeCard = function (idKey) {
                            var deleteDeckIndex = 0;
                            for (i = 0; i < deckContentDetails.length; i++) {
                                if (idKey === deckContentDetails[i].id) {
                                    deleteDeckIndex = i;
                                }
                            }
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
                            // Appending dialog to document.body to cover sidenav in docs app
                            var confirm = $mdDialog.confirm()
                                  .title('Would you like to Remove this?')
                                  .textContent('You Can Add This Card Back to the Deck in the Card List.')
                                  .ariaLabel('Delete Item')
                                  .targetEvent(ev)
                                  .ok('Delete')
                                  .cancel('Cancel');
                            $mdDialog.show(confirm).then(function () {
                                //remove card from database
                                removeCard(idKey);
                                addSuccessMsg = 'Item Removed Successfully';
                                $scope.showSimpleToast(addSuccessMsg);
                            }, function () {
                                addSuccessMsg = 'Item Delete Cancelled';
                                $scope.showSimpleToast(addSuccessMsg);
                            });
                        }; //end delete function

                        //toast functions
                        var last = {
                            bottom: false,
                            top: true,
                            left: false,
                            right: true
                        };

                        $scope.toastPosition = angular.extend({}, last);

                        $scope.getToastPosition = function () {
                            return Object.keys($scope.toastPosition)
                              .filter(function (pos) { return $scope.toastPosition[pos]; })
                              .join(' ');
                        };

                        $scope.showSimpleToast = function (message) {
                            var pinTo = $scope.getToastPosition();
                            $mdToast.show(
                              $mdToast.simple()
                                .textContent(message)
                                .position(pinTo)
                                .hideDelay(3000)
                            );
                        };

                        $scope.diceBadge = function (maxAllow, currentQty) {
                            var badgeTypes = ["badgePrimary", "badgeGreen", "badgeRed"]
                            if (maxAllow === currentQty) {
                                return badgeTypes[1];
                            } else if (maxAllow < currentQty) {
                                return badgeTypes[2];
                            } else {
                                return badgeTypes[0];
                            }
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