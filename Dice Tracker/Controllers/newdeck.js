logApp.controller('AddDeckController', ['$scope', '$rootScope', '$location', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
    function ($scope, $rootScope, $location, $firebaseAuth, $firebaseArray, FIREBASE_URL) {
        //$rootScope taken from authentication service to gain User ID. $firebaseArray for writing to database

        //get details about logged in user to get data assigned to that user
        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        //ensures whatever is done, user is authenticated
        auth.$onAuth(function (authUser) {
            //create url for user using hash key
            if (authUser) {
                //where to store new object when required if firebase sees Authenticated user
                var deckRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks');
                var deckInfo = $firebaseArray(deckRef);

                $scope.addDeck = function () {
                    //$add firebase method for adding to database
                    deckInfo.$add({
                        deckname: $scope.deckname,
                        deckdescription: $scope.deckdescription,
                        date: Firebase.ServerValue.TIMESTAMP
                    }).then(function () {
                       $location.path('/decks/')
                    }
                    );
                };


            }
        });
    }]);