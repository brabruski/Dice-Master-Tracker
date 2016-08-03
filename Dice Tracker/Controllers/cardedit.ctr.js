logApp.controller('EditCardController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', '$routeParams',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, $routeParams) {
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

                $scope.dice = collectionInfo;
                $scope.whichItem = $routeParams.itemId;

                //display existing information
                $scope.dice.$loaded().then(function () {
                    $scope.cardname = collectionInfo[$scope.whichItem].name;
                    $scope.cardcost = collectionInfo[$scope.whichItem].cost;
                    $scope.cardenergy = collectionInfo[$scope.whichItem].energy;
                    $scope.cardimage = "None";
                    $scope.cardaffiliation = collectionInfo[$scope.whichItem].affiliation;
                    $scope.cardtype = collectionInfo[$scope.whichItem].cardtype;
                    $scope.carddescription = collectionInfo[$scope.whichItem].description;
                    $scope.cardcolour = collectionInfo[$scope.whichItem].colour;
                    $scope.rarity = collectionInfo[$scope.whichItem].rarity;
                    $scope.cardseries = collectionInfo[$scope.whichItem].series;
                    $scope.dicequantity = collectionInfo[$scope.whichItem].quantity;
                });

                $scope.editCard = function () {
                    //$save firebase method for saving existing to database
                    var cardSave = {
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
                        id: collectionInfo[$scope.whichItem].id,
                        date: Firebase.ServerValue.TIMESTAMP
                    };

                    collectionInfo.$remove(collectionInfo[$scope.whichItem]).then(function () {
                        collectionInfo.$add(cardSave).then(function () {
                            $scope.successMessage = "Card Updated Successfully!";
                        });
                    });

                    
                };


            }
        });
    }]);