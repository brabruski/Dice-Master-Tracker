logApp.controller('AddController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {
        //$rootScope taken from authentication service to gain User ID. $firebaseArray for writing to database

        //get details about logged in user to get data assigned to that user
        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        //ensures whatever is done, user is authenticated
        auth.$onAuth(function (authUser) {
            //create url for user using hash key
            if (authUser) {
                //where to store new object when required if firebase sees Authenticated user
                var collectionRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                var collectionInfo = $firebaseArray(collectionRef);

                $scope.cardenergy = 'Fist';
                $scope.cardaffiliation = 'Marvel';
                $scope.dicequantity = '1';
                $scope.cardtype = 'Hero / Villain'

                $scope.addCard = function () {
                    var cardIds = [];
                    for (var i = 0; i < collectionInfo.length; i++) {
                        cardIds.push(collectionInfo[i].id);
                    }
                    var topId = 0;
                    for (var j = 0; j < cardIds.length; j++) {
                        if (cardIds[j] > topId) {
                            topId = cardIds[j];
                        }
                    }
                    topId++;

                    //$add firebase method for adding to database
                    collectionInfo.$add({
                        id: topId,
                        name: $scope.cardname,
                        cost: $scope.cardcost,
                        energy: $scope.cardenergy,
                        image: $scope.cardimage,
                        affiliation: $scope.cardaffiliation,
                        cardtype: $scope.cardtype,
                        description: $scope.carddescription,
                        colour: $scope.cardcolour,
                        rarity: $scope.rarity,
                        series: $scope.cardseries,
                        quantity: $scope.dicequantity,
                        date: Firebase.ServerValue.TIMESTAMP
                    }).then(function () {
                        //after submitting, clears the fields
                        $scope.cardname = '';
                        $scope.cardcost = '';
                        $scope.cardimage = '';
                        $scope.cardseries = '';
                        $scope.carddescription = '';
                        $scope.cardcolour = '';
                        rarity: 'Common',
                        $scope.dicequantity = '1';
                        $scope.successMessage = "Card Added Successfully!";
                    }
                    );
                };

                
            }
        });
    }]);