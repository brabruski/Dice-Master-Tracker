logApp.controller('CardDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', '$routeParams', 'DBServices',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, $routeParams, DBServices) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var collectionDetails = DBServices.cardCollection();

                $scope.dice = collectionDetails;
                $scope.whichItem = $routeParams.itemId;

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