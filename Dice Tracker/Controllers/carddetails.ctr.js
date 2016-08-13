logApp.controller('CardDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', '$routeParams', 'DBServices',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, $routeParams, DBServices) {

        var ref = new Firebase(Config.FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var collectionDetails = DBServices.cardCollection();

                $scope.dice = collectionDetails;
                $scope.whichItem = $routeParams.itemId;
                $scope.imagePath = '../images/dice/placeholder_card.png';

                //Hide card version headings if they are action cards
                $scope.hideActionVersion = function (typeOfCard) {
                    if (typeOfCard === 'Action') {
                        return true;
                    } else {
                        return false;
                    }
                };

               //create an anon function which works after database has loaded
                $scope.dice.$loaded().then(function () {
                    //rarity stripe
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

                    if ($routeParams.itemId > 0) {
                        $scope.prevItem = Number($routeParams.itemId) - 1;
                    } else {
                        $scope.prevItem = $scope.dice.length - 1;
                    }

                    if ($routeParams.itemId < $scope.dice.length - 1) {
                        $scope.nextItem = Number($routeParams.itemId) + 1;
                    } else {
                        $scope.nextItem = 0;
                    }
                }); //end loaded function
            }
        });

    }]);