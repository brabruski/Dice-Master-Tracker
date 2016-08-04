/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('CardListController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var collectionRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                var collectionInfo = $firebaseArray(collectionRef);

                var deckRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks');
                var deckInfo = $firebaseArray(deckRef);

                //initialising the filters
                $scope.dice = collectionInfo;
                $scope.decks = deckInfo;
                $scope.diceOrder = 'name';

                //remove card from database
                $scope.deleteCard = function (key) {
                    collectionInfo.$remove(key);
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
                    var deckContentRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + deckName.$id + '/contents');
                    var deckContentInfo = $firebaseArray(deckContentRef);
                    $scope.deckContents = deckContentInfo;

                    var contentsData = {
                        name: cardName.name,
                        id: cardName.id,
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
                            deckContentInfo.$add(contentsData);
                        }
                        $scope.dice.success = false;
                        cardName.success = true;

                    });
                };

                collectionInfo.$loaded().then(function (data) {
                    $scope.howManyCards = collectionInfo.length;
                });    //count how many cards in collection

                $scope.$watch('howManyCards', function () {
                    $scope.howManyCards = collectionInfo.length;
                }); //watch for changes made to collection

            }
        });
    }]);

