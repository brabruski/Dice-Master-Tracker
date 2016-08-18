logApp.factory('MaterialFunc',
	['$mdToast', '$mdDialog',
function ($mdToast, $mdDialog) {
    var matObj = {
        //Toast Position on Screen
        showSimpleToast: function (message) {
            var last = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };
            var toastPosition = angular.extend({}, last);

            var getToastPosition = function () {
                return Object.keys(toastPosition)
                      .filter(function (pos) { return toastPosition[pos]; })
                      .join(' ');
            }

            var showSimpleToast = function (message) {
                var pinTo = getToastPosition();
                $mdToast.show(
                  $mdToast.simple()
                    .textContent(message)
                    .position(pinTo)
                    .hideDelay(3000)
                );                
            }

            return showSimpleToast;
        } //End entire Function
    }
    return matObj;
}]); //end factory
