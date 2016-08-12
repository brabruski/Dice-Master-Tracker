/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('CardListController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', 'DBServices', '$mdToast', '$mdDialog', '$timeout', '$mdBottomSheet', '$mdMedia', 'MaterialFunc',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, DBServices, $mdToast, $mdDialog, $timeout, $mdBottomSheet, $mdMedia, MaterialFunc) {

        var ref = new Firebase(Config.FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var deckDetails = DBServices.deckCollection();
                var collectionDetails = DBServices.cardCollection();

                //initialising the filters
                $scope.dice = collectionDetails;
                $scope.diceOrder = 'name';
                $scope.imagePath = '../images/dice/placeholder_card.png';

                //Set default Selected option after deck database has downloaded fully
                deckDetails.$loaded().then(function (data) {
                    $scope.decks = deckDetails;
                    $scope.deckSelected = $scope.decks[0];
                });

                //Hide card version headings if they are action cards
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

                //remove card from database
                var deleteCard = function (idKey) {
                    var deleteKey = 0;
                    for (j = 0; j < collectionDetails.length; j++) {
                        if (idKey === collectionDetails[j].id) {
                            deleteKey = j;
                        }
                    }
                    collectionDetails.$remove(deleteKey);
                };

                //show the add to deck components
                $scope.showAddTo = function (currentItem) {
                    currentItem.show = !currentItem.show;
                };

                //create link to contents of each deck
                $scope.addToDeck = function (cardName, deckName) {
                    var currentDeck = deckName.$id;
                    var deckContentDetails = DBServices.deckCollectionContents(currentDeck);
                    $scope.deckContents = deckContentDetails;

                    var adjustedQty = 0;
                    if (cardName.cardtype === "Action") {
                        adjustedQty = 3;
                    }

                    var contentsData = {
                        name: cardName.name,
                        id: cardName.id,
                        diceQuantity: adjustedQty,
                        date: Firebase.ServerValue.TIMESTAMP
                    };

                    $scope.deckContents.$loaded().then(function () {
                        //creat array of existing items in selected deck
                        var deckCardContent = [];
                        for (j = 0; j < $scope.deckContents.length; j++) {
                            deckCardContent[j] = $scope.deckContents[j].name;
                        }

                        //set all success attributes to false
                        for (k = 0; k < $scope.dice.length; k++) {
                            $scope.dice[k].success = false;
                        }

                        //check if card is already added
                        var isAdded = false;

                        for (i = 0; i < deckCardContent.length; i++) {
                            if (contentsData.name === deckCardContent[i]) {
                                isAdded = true;
                                break;
                            }
                        }
                        var addSuccessMsg;
                        if (!isAdded) {
                            addSuccessMsg = 'Card Added Successfully to ' + deckName.deckname + '!';
                            deckContentDetails.$add(contentsData);
                            $scope.showSimpleToast(addSuccessMsg);
                        } else {
                            addSuccessMsg = 'Card Already Exists in the "' + deckName.deckname + '" Deck!';
                            $scope.showSimpleToast(addSuccessMsg);
                        }
                        $scope.dice.success = false;
                        cardName.success = true;

                    }); //end deckContents.loaded
                }; //end $scope.addToDeck

                collectionDetails.$loaded().then(function (data) {
                    $scope.howManyCards = collectionDetails.length;
                });    //count how many cards in collection

                $scope.$watch('howManyCards', function () {
                    $scope.howManyCards = collectionDetails.length;
                }); //watch for changes made to collection

                //Delete Card Modal
                $scope.deleteCard = function (ev, idKey) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                          .title('Would you like to delete this card?')
                          .textContent('This will be permanent and cannot be undone.')
                          .ariaLabel('Delete Card')
                          .targetEvent(ev)
                          .ok('Delete')
                          .cancel('Cancel');
                    $mdDialog.show(confirm).then(function () {
                        //remove card from database
                        deleteCard(idKey);
                        addSuccessMsg = 'Card Deleted Successfully';
                        $scope.showSimpleToast(addSuccessMsg);
                    }, function () {
                        addSuccessMsg = 'Card Delete Cancelled';
                        $scope.showSimpleToast(addSuccessMsg);
                    });
                }; //end delete function

                //toast functions
                var last = {
                    bottom: true,
                    top: false,
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

            } //End checking if user is logged
        });
    }]);

