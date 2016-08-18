// Usage: Add attributes: ng-really-click="takeAction()" function
logApp.directive('ngReallyClick', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var message = "Are You Sure You Would Like to Permanently Delete this Item? ";
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    };
}]);