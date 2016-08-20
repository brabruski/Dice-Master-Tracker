logApp.factory('MaterialFunc',
	['$mdToast', '$mdDialog', '$mdMedia',
function ($mdToast, $mdDialog, $mdMedia) {
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

        //Pop Up Dialogue for Delete / // Appending dialog to document.body to cover sidenav in docs app
        confirmDelete: function (ev, idKey) {
            var confirm = $mdDialog.confirm()
          .title('Would you like to delete this?')
          .textContent('This will be permanent and cannot be undone.')
          .ariaLabel('Delete Item')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');
            var dialogue = $mdDialog.show(confirm);
            return dialogue;
        }
    }
    return matObj;
}]); //end factory
