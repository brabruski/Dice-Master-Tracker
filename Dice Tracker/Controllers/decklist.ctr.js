/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('DeckListController', ['$scope', '$rootScope', '$location', '$firebaseAuth', '$firebaseArray', 'Config', 'DBServices', '$mdToast', '$mdDialog',
    function ($scope, $rootScope, $location, $firebaseAuth, $firebaseArray, Config, DBServices, $mdToast, $mdDialog) {

        var ref = new Firebase(Config.FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var deckItems = DBServices.deckCollection();
                $scope.decks = deckItems;

                var deleteDeck = function (idKey) {
                    var deleteKey = 0;
                    for (j = 0; j < deckItems.length; j++) {
                        if (idKey === deckItems[j].id) {
                            deleteKey = j;
                        }
                    }
                    deckItems.$remove(deleteKey);
                };

                //Delete Card Modal
                $scope.deleteItem = function (ev, idKey) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                          .title('Would you like to delete this?')
                          .textContent('This will be permanent and cannot be undone.')
                          .ariaLabel('Delete Item')
                          .targetEvent(ev)
                          .ok('Delete')
                          .cancel('Cancel');
                    $mdDialog.show(confirm).then(function () {
                        //remove card from database
                        deleteDeck(idKey);
                        addSuccessMsg = 'Item Deleted Successfully';
                        $scope.showSimpleToast(addSuccessMsg);
                    }, function () {
                        addSuccessMsg = 'Item Delete Cancelled';
                        $scope.showSimpleToast(addSuccessMsg);
                    });
                }; //end delete function

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

