logApp.controller('EditController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', '$routeParams',
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

/*              
                $scope.cardname = $scope.dice.name;
                $scope.cardcost = $scope.dice.cost;
                $scope.cardenergy = $scope.dice.energy;
                $scope.cardimage = "None";
                $scope.cardaffiliation = $scope.dice.affiliation;
                $scope.carddescription = $scope.dice.description;
                $scope.cardcolour = $scope.dice.colour;
                $scope.cardseries = $scope.dice.series;
                $scope.dicequantity = $scope.dice.quantity;
*/

                $scope.editCard = function () {
                    //$save firebase method for saving existing to database
                    collectionInfo.$save({
                        name: $scope.cardname,
                        cost: $scope.cardcost,
                        energy: $scope.cardenergy,
                        image: $scope.cardimage,
                        affiliation: $scope.cardaffiliation,
                        description: $scope.carddescription,
                        colour: $scope.cardcolour,
                        series: $scope.cardseries,
                        quantity: $scope.dicequantity,
                        date: Firebase.ServerValue.TIMESTAMP
                    });
                };


            }
        });
    }]);