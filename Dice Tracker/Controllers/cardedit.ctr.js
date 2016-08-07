logApp.controller('EditCardController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', '$routeParams', 'DBServices',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, $routeParams, DBServices) {
        //$rootScope taken from authentication service to gain User ID. $firebaseArray for writing to database

        //get details about logged in user to get data assigned to that user
        var ref = new Firebase(Config.FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        //ensures whatever is done, user is authenticated
        auth.$onAuth(function (authUser) {
            //create url for user using hash key
            if (authUser) {
                //where to store new object when required if firebase sees Authenticated user
                var collectionDetails = DBServices.cardCollection();

                $scope.dice = collectionDetails;
                $scope.whichItem = $routeParams.itemId;

                //display existing information
                $scope.dice.$loaded().then(function () {
                    $scope.cardname = collectionDetails[$scope.whichItem].name;
                    $scope.cardversion = collectionDetails[$scope.whichItem].cardversion;
                    $scope.cardcost = collectionDetails[$scope.whichItem].cost;
                    $scope.cardenergy = collectionDetails[$scope.whichItem].energy;
                    $scope.cardimage = "None";
                    $scope.cardaffiliation = collectionDetails[$scope.whichItem].affiliation;
                    $scope.cardtype = collectionDetails[$scope.whichItem].cardtype;
                    $scope.carddescription = collectionDetails[$scope.whichItem].description;
                    $scope.cardcolour = collectionDetails[$scope.whichItem].colour;
                    $scope.rarity = collectionDetails[$scope.whichItem].rarity;
                    $scope.cardseries = collectionDetails[$scope.whichItem].series;
                    $scope.dicequantity = collectionDetails[$scope.whichItem].quantity;

                    $scope.$watch('cardtype', function () {
                        if ($scope.cardtype === 'Action') {
                            $scope.isAction = true;
                            $scope.cardversion = "Action";
                            $scope.dicequantity = 3;
                        } else {
                            $scope.isAction = false;
                            $scope.cardversion = "";
                            $scope.dicequantity = collectionDetails[$scope.whichItem].quantity;
                        }
                    }); //watch for if it's action card or not

                });

                $scope.editCard = function () {
                    //$save firebase method for saving existing to database
                    var cardSave = {
                        name: $scope.cardname,
                        cardversion:  $scope.cardversion,
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
                        id: collectionDetails[$scope.whichItem].id,
                        date: Firebase.ServerValue.TIMESTAMP
                    };

                    collectionDetails.$remove(collectionDetails[$scope.whichItem]).then(function () {
                        collectionDetails.$add(cardSave).then(function () {
                            $scope.successMessage = "Card Updated Successfully!";
                        });
                    });

                    
                };


            }
        });
    }]);