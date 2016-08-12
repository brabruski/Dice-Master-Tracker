logApp.constant('Config', {
    FIREBASE_URL: 'https://dicetracker18052016.firebaseio.com/',
    FIREBASE_IMG_URL: 'gs://dicetracker18052016.appspot.com/'
});

//Define Theme defaults
logApp.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('purple');
});

//Define icons in theme
logApp.config(function ($mdIconProvider) {
    // Configure URLs for icons specified by [set:]id.
    $mdIconProvider
        .defaultFontSet('fa')   // This sets our default fontset className.
        .icon('delete', '../fonts/icons/delete.svg', 24)
        .icon('add', '../fonts/icons/plus-circle.svg', 24)
        .icon('show', '../fonts/icons/spotlight-beam.svg', 24)
        .icon('aleft', '../fonts/icons/chevron-double-left.svg', 24)
        .icon('aright', '../fonts/icons/chevron-double-right.svg', 24)
        .icon('back', '../fonts/icons/backburger.svg', 24)
        .icon('dice6', '../fonts/icons/dice-6.svg')
        .icon('view', '../fonts/icons/eye.svg', 24)
        .icon('search', '../fonts/icons/magnify.svg', 24)
        .icon('cards', '../fonts/icons/cards-playing-outline.svg', 24)
        .icon('key', '../fonts/icons/key.svg', 24)
        .icon('email', '../fonts/icons/email.svg', 24)
        .icon('username', '../fonts/icons/account-settings-variant.svg', 24)
        .icon('user', '../fonts/icons/account.svg', 24)
});