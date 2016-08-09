logApp.constant('Config', {
    FIREBASE_URL: 'https://dicetracker18052016.firebaseio.com/',
    FIREBASE_IMG_URL: 'gs://dicetracker18052016.appspot.com/'
});

//Define Theme defaults
logApp.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
});

//Define icons in theme
logApp.config(function ($mdIconProvider) {
    // Configure URLs for icons specified by [set:]id.
    $mdIconProvider
        .defaultFontSet('fa')                   // This sets our default fontset className.
        .icon('delete', '../images/icons/delete.svg')
        .icon('add', '../images/icons/plus-circle.svg')
        .icon('show', '../images/icons/spotlight-beam.svg')
        .icon('aleft', '../images/icons/chevron-double-left.svg')
        .icon('aright', '../images/icons/chevron-double-right.svg')
        .icon('back', '../images/icons/backburger.svg')
});