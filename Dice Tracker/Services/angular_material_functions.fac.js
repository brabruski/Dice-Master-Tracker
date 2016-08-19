logApp.factory('MaterialFunc',
	['$mdToast', '$mdDialog',
function ($mdToast, $mdDialog) {
    var matObj = {
        //Toast Position on Screen
        toastDetails: function () {
            var last = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };
            var toastPosition = angular.extend({}, last);

            return toastPosition;
        },

        getToastPos: function (details) {
            return Object.keys(details)
                      .filter(function (pos) { return details[pos]; })
                      .join(' ');
        },

        showToast: function (pinTo, message) {
            $mdToast.show(
                      $mdToast.simple()
                        .textContent(message)
                        .position(pinTo)
                        .hideDelay(3000)
                    );
        },

        confirmDelete: function (ev, idKey) {
            var confirm = $mdDialog.confirm()
          .title('Would you like to delete this?')
          .textContent('This will be permanent and cannot be undone.')
          .ariaLabel('Delete Item')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

            return confirm;
        }
    }
    return matObj;
}]); //end factory
