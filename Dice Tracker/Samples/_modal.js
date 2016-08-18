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


//Bottom Panel Modal
angular.module('bottomSheetDemo1', ['ngMaterial'])
.config(function ($mdIconProvider) {
    $mdIconProvider
      .icon('share-arrow', 'img/icons/share-arrow.svg', 24)
      .icon('upload', 'img/icons/upload.svg', 24)
      .icon('copy', 'img/icons/copy.svg', 24)
      .icon('print', 'img/icons/print.svg', 24)
      .icon('hangout', 'img/icons/hangout.svg', 24)
      .icon('mail', 'img/icons/mail.svg', 24)
      .icon('message', 'img/icons/message.svg', 24)
      .icon('copy2', 'img/icons/copy2.svg', 24)
      .icon('facebook', 'img/icons/facebook.svg', 24)
      .icon('twitter', 'img/icons/twitter.svg', 24);
})
.controller('BottomSheetExample', function ($scope, $timeout, $mdBottomSheet, $mdToast) {
    $scope.alert = '';
    $scope.showListBottomSheet = function () {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'bottom-sheet-list-template.html',
            controller: 'ListBottomSheetCtrl'
        }).then(function (clickedItem) {
            $scope.alert = clickedItem['name'] + ' clicked!';
        });
    };
    $scope.showGridBottomSheet = function () {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'bottom-sheet-grid-template.html',
            controller: 'GridBottomSheetCtrl',
            clickOutsideToClose: false
        }).then(function (clickedItem) {
            $mdToast.show(
                  $mdToast.simple()
                    .textContent(clickedItem['name'] + ' clicked!')
                    .position('top right')
                    .hideDelay(1500)
                );
        });
    };
})


.controller('GridBottomSheetCtrl', function ($scope, $mdBottomSheet) {
    $scope.items = [
      { name: 'Hangout', icon: 'hangout' },
      { name: 'Mail', icon: 'mail' },
      { name: 'Message', icon: 'message' },
      { name: 'Copy', icon: 'copy2' },
      { name: 'Facebook', icon: 'facebook' },
      { name: 'Twitter', icon: 'twitter' },
    ];
    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
})
.run(function ($templateRequest) {
    var urls = [
      'img/icons/share-arrow.svg',
      'img/icons/upload.svg',
      'img/icons/copy.svg',
      'img/icons/print.svg',
      'img/icons/hangout.svg',
      'img/icons/mail.svg',
      'img/icons/message.svg',
      'img/icons/copy2.svg',
      'img/icons/facebook.svg',
      'img/icons/twitter.svg'
    ];
    angular.forEach(urls, function (url) {
        $templateRequest(url);
    });
});