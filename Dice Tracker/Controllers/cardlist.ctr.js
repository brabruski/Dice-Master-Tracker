/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('CardListController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', 'DBServices',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, DBServices) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var deckDetails = DBServices.deckCollection();
                var collectionDetails = DBServices.cardCollection();

                //initialising the filters
                $scope.dice = collectionDetails;
                $scope.diceOrder = 'name';

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
                    
                //remove card from database
                $scope.deleteCard = function (key) {
                    collectionDetails.$remove(key);
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

                //create link to contents of each deck
                $scope.addtoDeck = function (cardName, deckName) {
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
                        $scope.successMessage = 'Card Already Exists in the "' + deckName.deckname + '" Deck!';
                        var isAdded = false;

                        for (i = 0; i < deckCardContent.length; i++) {
                            if (contentsData.name === deckCardContent[i]) {
                                isAdded = true;
                                break;
                            }
                        }

                        if (!isAdded) {
                            $scope.successMessage = 'Card Added Successfully to ' + deckName.deckname + '!';
                            deckContentDetails.$add(contentsData);
                        }
                        $scope.dice.success = false;
                        cardName.success = true;

                    });
                };

                collectionDetails.$loaded().then(function (data) {
                    $scope.howManyCards = collectionDetails.length;
                });    //count how many cards in collection

                $scope.$watch('howManyCards', function () {
                    $scope.howManyCards = collectionDetails.length;
                }); //watch for changes made to collection

            } //End checking if user is logged
        });
    }]);

