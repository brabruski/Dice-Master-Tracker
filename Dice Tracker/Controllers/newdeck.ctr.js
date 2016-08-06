logApp.controller('AddDeckController', ['$scope', '$rootScope', '$location', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', 'DBServices',
    function ($scope, $rootScope, $location, $firebaseAuth, $firebaseArray, FIREBASE_URL, DBServices) {
        //$rootScope taken from authentication service to gain User ID. $firebaseArray for writing to database

        //get details about logged in user to get data assigned to that user
        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        //ensures whatever is done, user is authenticated
        auth.$onAuth(function (authUser) {
            //create url for user using hash key
            if (authUser) {
                //where to store new object when required if firebase sees Authenticated user
                var deckDetails = DBServices.deckCollection();

                $scope.addDeck = function () {
                    //check existing ids
                    var deckIds = [];
                    for (var i = 0; i < deckDetails.length; i++) {
                        deckIds.push(deckDetails[i].id);                        
                    }
                    var highId = 0;
                    for (var j = 0; j < deckIds.length; j++) {
                        if (deckIds[j] > highId) {
                            highId = deckIds[j];
                        }
                    }
                    highId++;

                    //$add firebase method for adding to database
                    deckDetails.$add({
                        id: highId,
                        deckname: $scope.deckname,
                        deckdescription: $scope.deckdescription,
                        date: Firebase.ServerValue.TIMESTAMP
                    }).then(function () {
                        $location.path('/decks/');
                    }
                    );
                };


            }
        });
    }]);