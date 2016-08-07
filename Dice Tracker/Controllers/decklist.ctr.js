/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('DeckListController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Config', 'DBServices',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Config, DBServices) {

        var ref = new Firebase(Config.FIREBASE_URL);
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

