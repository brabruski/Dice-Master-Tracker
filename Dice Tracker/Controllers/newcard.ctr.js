logApp.controller('AddController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', 'DBServices',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, DBServices) {
        //$rootScope taken from authentication service to gain User ID. $firebaseArray for writing to database

        //get details about logged in user to get data assigned to that user
        var ref = new Firebase(Config.FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        //ensures whatever is done, user is authenticated
        auth.$onAuth(function (authUser) {
            //create url for user using hash key
            if (authUser) {

                var collectionDetails = DBServices.cardCollection();
                var collectionImageDetails = DBServices.collectionImages();

                //Methods for uploading image using ng-file-upload directive

                //Create an Array of Option Values
                var maxDice = function (maxDice) {
                    var maxDiceInSet = [];
                    for (var i = 0; i < maxDice; i++) {
                        maxDiceInSet.push(i+1);
                    }
                    return maxDiceInSet;
                };

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

                //Initialise selection options
                $scope.cardcost = '1';
                $scope.energyOptions = ['Fist', 'Lightning', 'Mask', 'Shield', 'Generic'];
                $scope.cardenergy = 'Fist';
                $scope.cardaffiliation = 'Marvel';
                $scope.dicequantity = '1';
                $scope.cardtype = 'Hero / Villain';
                $scope.rarity = 'Common';
                //Maximum Dice Cost
                $scope.diceMax = maxDice(10);
                //Maximum Dice Quanitity
                $scope.diceQty = maxDice(5);

                $scope.$watch('cardtype', function () {
                    if ($scope.cardtype === 'Action') {
                        $scope.isAction = true;
                        $scope.cardversion = "Action";
                        $scope.dicequantity = 3;
                        $scope.cardenergy = 'Generic';
                    } else {
                        $scope.isAction = false;
                        $scope.cardversion = "";
                    }
                }); //watch for if it's action card or not

                $scope.addCard = function () {
                    var cardIds = [];
                    for (var i = 0; i < collectionDetails.length; i++) {
                        cardIds.push(collectionDetails[i].id);
                    }
                    var topId = 0;
                    for (var j = 0; j < cardIds.length; j++) {
                        if (cardIds[j] > topId) {
                            topId = cardIds[j];
                        }
                    }
                    topId++;

                    //$add firebase method for adding to database
                    collectionDetails.$add({
                        id: topId,
                        name: $scope.cardname,
                        cardversion: $scope.cardversion,
                        cost: $scope.cardcost,
                        energy: $scope.cardenergy,
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
                        $scope.cardversion = '';
                        $scope.cardcost = '';
                        $scope.cardseries = '';
                        $scope.carddescription = '';
                        $scope.cardcolour = '';
                        rarity: 'Common',
                        $scope.dicequantity = '1';
                        var addSuccessMsg = "Card Added To Collection Successfully!";
                        $scope.showSimpleToast(addSuccessMsg);
                        }
                    );
                };


            }
        });
    }]);