//Create Password Matching Validation Directive
logApp.directive('passwValidation', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctl) {
            scope.$watch(attrs['passwValidation'], function (errorMsg) {
                elm[0].setCustomValidity(errorMsg);
                ctl.$setValidity('passwValidation', errorMsg ? false : true);
            });
        }
    };
});