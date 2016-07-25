logApp.controller('CardDetailsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', '$routeParams',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL, $routeParams) {

        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var collectionRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                var collectionInfo = $firebaseArray(collectionRef);

               
                $scope.dice = collectionInfo;
                $scope.whichItem = $routeParams.itemId;

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
                }) //end loaded function
            }
        });

    }]);