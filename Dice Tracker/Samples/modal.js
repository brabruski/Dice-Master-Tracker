angular.module('dialogDemo1', ['ngMaterial'])
.controller('AppCtrl', function ($scope, $mdDialog, $mdMedia) {

    //Add new Modal Functions
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAddNewModal = function (ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../Views/nameOfTemplate.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
        .then(function () {
            addSuccessMsg = 'New Card Added Successfully';
            $scope.showSimpleToast(addSuccessMsg);
        }, function () {
            addSuccessMsg = 'Add New Card Cancelled';
            $scope.showSimpleToast(addSuccessMsg);
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };
});

//Create Modal Controller
function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function () {
        $mdDialog.hide();
    };
}