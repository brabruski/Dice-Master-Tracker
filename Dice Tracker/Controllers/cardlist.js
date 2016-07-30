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

                $scope.dice = collectionInfo;
                $scope.decks = deckInfo;
                $scope.diceOrder = 'name';

                $scope.deleteCard = function (key) {
                    collectionInfo.$remove(key);
                };

                $scope.showAddToDeck = function (currentCard) {
                    currentCard.show = !currentCard.show;
                    if (currentCard.currentState == 'expanded') {
                        currentCard.currentState = '';
                    } else {
                        currentCard.currentState = 'expanded';
                    }
                };

                //create link to contents of each deck
                $scope.addtoDeck = function (cardName, deckName) {
                    var deckContentRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + deckName.$id + '/contents');
                    var deckContentInfo = $firebaseArray(deckContentRef);
                    $scope.deckContents = deckContentInfo;

                    var contentsData = {
                        name: cardName.name,
                        date: Firebase.ServerValue.TIMESTAMP
                    };
                    debugger;
                    $scope.deckContents.$loaded().then(function () {
                        //creat array of existing items in selected deck
                        var deckCardContent = [];
                        for (j = 0; j < $scope.deckContents.length; j++) {
                            deckCardContent[j] = $scope.deckContents[j].name;
                            console.log(deckCardContent[j]);
                            console.log(deckContentInfo[j].name);
                        };

                        
                        //check if card is already added
                        $scope.successMessage = "Card Already Added!";
                        var isAdded = false;

                        for (i = 0; i < deckCardContent.length; i++) {
                            if (contentsData.name === deckCardContent[i]) {
                                isAdded = true;
                                break;
                            }
                        };

                        if (!isAdded) {
                            $scope.successMessage = "Card Added Successfully!";
                            deckContentInfo.$add(contentsData);
                        } 
                        

                    });
                };

                collectionInfo.$loaded().then(function (data) {
                    $rootScope.howManyCards = collectionInfo.length;
                });    //count how many cards in collection

                collectionInfo.$watch(function (data) {
                    $rootScope.howManyCards = collectionInfo.length;
                }); //watch for changes made to collection

            }
        });
    }]);

