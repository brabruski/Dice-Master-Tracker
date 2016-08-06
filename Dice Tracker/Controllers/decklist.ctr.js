/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('DeckListController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', 'DBServices',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, DBServices) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                $scope.decks = DBServices.deckCollection();

                $scope.deleteDeck = function (key) {
                    DBServices.deckCollection().$remove(key);
                };
            }
        });
    }]);

