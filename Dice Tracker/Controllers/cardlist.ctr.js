/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('CardListController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', 'DBServices', 'CollectionFactory', 'MaterialFunc', '$timeout',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, DBServices, CollectionFactory, MaterialFunc, $timeout) {

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
                    var isAction = CollectionFactory.hideActionVersion(typeOfCard);
                    return isAction;
                };

                $scope.getRarity = function (item) {
                    var rarity = CollectionFactory.getRarity(item);
                    return rarity;
                }

                //remove card from database
                var deleteCard = function (idKey) {
                    var deleteKey = CollectionFactory.checkItemKey(collectionDetails, idKey);
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
                        var deckCardContent = CollectionFactory.createContents(deckContentDetails);

                        //set all success attributes to false
                        for (k = 0; k < $scope.dice.length; k++) {
                            $scope.dice[k].success = false;
                        }

                        //check if card is already added
                        var isAdded = CollectionFactory.checkContents(deckCardContent, contentsData.name);
                        var addSuccessMsg;
                        if (!isAdded) {
                            addSuccessMsg = 'Card Added Successfully to ' + deckName.deckname + '!';
                            deckContentDetails.$add(contentsData);
                            $scope.showSimpleToast(addSuccessMsg);
                        } else {
                            addSuccessMsg = 'A Version of This Card Already Exists in the "' + deckName.deckname + '" Deck!';
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
                $scope.deleteItem = function (ev, idKey) {
                    MaterialFunc.confirmDelete(ev, idKey).then(function () {
                        //remove card from database
                        deleteCard(idKey);
                        addSuccessMsg = 'Item Deleted Successfully';
                        $scope.showSimpleToast(addSuccessMsg);
                    }, function () {
                        addSuccessMsg = 'Item Delete Cancelled';
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

            } // End auth If Statement
        }); //End Authorisation Function
    }]);