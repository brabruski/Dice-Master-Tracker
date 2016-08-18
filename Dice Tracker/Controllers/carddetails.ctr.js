logApp.controller('CardDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', '$routeParams', 'DBServices', 'CollectionFactory',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, $routeParams, DBServices, CollectionFactory) {

        var ref = new Firebase(Config.FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var collectionDetails = DBServices.cardCollection();
                $scope.dice = collectionDetails;

                //Displaying information for current card requires it's index from the link
                $scope.whichItem = $routeParams.itemId;

                //change when I figure out uploading custom images
                $scope.imagePath = '../images/dice/placeholder_card.png';

                //Hide card version headings if they are action cards
                $scope.hideActionVersion = function (typeOfCard) {
                    var isAction = CollectionFactory.hideActionVersion(typeOfCard);
                    return isAction;
                };

               //create an anon function which works after database has loaded
                $scope.dice.$loaded().then(function () {

                    //Set Rarity Stripe CSS Class
                    $scope.getRarity = function (item) {
                        var rarity = CollectionFactory.getRarity(item);
                        return rarity;
                    }

                    //Navigation Buttons
                    $scope.prevItem =  CollectionFactory.prevBtn($routeParams.itemId, $scope.dice);
                    $scope.nextItem = CollectionFactory.nextBtn($routeParams.itemId, $scope.dice);

                }); //end loaded function
            }
        });

    }]);