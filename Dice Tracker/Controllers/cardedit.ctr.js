logApp.controller('EditCardController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', '$routeParams', 'DBServices', '$mdToast', '$mdDialog',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, $routeParams, DBServices, $mdToast, $mdDialog) {
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

                //Create an Array of Option Values
                var maxDice = function (maxDice) {
                    var maxDiceInSet = [];
                    for (var i = 0; i < maxDice; i++) {
                        maxDiceInSet.push(i + 1);
                    }
                    return maxDiceInSet;
                };

                $scope.diceMax = maxDice(10);
                $scope.diceQty = maxDice(5);
                $scope.energyOptions = ['Fist', 'Lightning', 'Mask', 'Shield', 'Generic'];

                //display existing information
                $scope.dice.$loaded().then(function () {
                    $scope.cardname = collectionDetails[$scope.whichItem].name;
                    $scope.cardversion = collectionDetails[$scope.whichItem].cardversion;
                    $scope.cardcost = collectionDetails[$scope.whichItem].cost;
                    $scope.cardenergy = collectionDetails[$scope.whichItem].energy;
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
                            $scope.cardenergy = 'Generic';
                        } else {
                            $scope.isAction = false;
                            $scope.cardversion = collectionDetails[$scope.whichItem].cardversion;
                            $scope.dicequantity = collectionDetails[$scope.whichItem].quantity;
                            $scope.cardenergy = collectionDetails[$scope.whichItem].energy;
                        }
                    }); //watch for if it's action card or not

                }); //end $scope.loaded

                $scope.editCard = function () {
                    //$save firebase method for saving existing to database
                    var cardSave = {
                        name: $scope.cardname,
                        cardversion:  $scope.cardversion,
                        cost: $scope.cardcost,
                        energy: $scope.cardenergy,
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
                            var addSuccessMsg = "Card Saved Successfully!";
                            $scope.showSimpleToast(addSuccessMsg);
                        });
                    });

                    
                }; //end Edit card

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

            }
        });
    }]);