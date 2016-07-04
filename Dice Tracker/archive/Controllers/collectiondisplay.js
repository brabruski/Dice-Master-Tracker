/*Declare Scope etc. so on minification it doesn't get converted*/
logApp.controller('ListController', ['$scope', '$http', function ($scope, $http) {
    $http.get('js/data.json').success(function (data) {
        $scope.diceOrder = 'name';
        $scope.dice = data;
    });

}]);

logApp.controller('DetailsController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $http.get('js/data.json').success(function (data) {
        $scope.dice = data;
        $scope.whichItem = $routeParams.itemId;

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
    });

}]);