logApp.constant('Config', {
    FIREBASE_URL: 'https://dicetracker18052016.firebaseio.com/',
    FIREBASE_IMG_URL: 'gs://dicetracker18052016.appspot.com/'
});

//Define Theme defaults
/*
logApp.config(function ($mdThemingProvider, palettes) {
    var customPrimary = {
        '50': '#575e86',
        '100': '#4d5377',
        '200': '#434967',
        '300': '#393e58',
        '400': '#2f3348',
        '500': '#252839',
        '600': '#1b1d2a',
        '700': '#11121a',
        '800': '#07070b',
        '900': '#000000',
        'A100': '#616996',
        'A200': '#6f77a2',
        'A400': '#7e85ac',
        'A700': '#000000'
    };
    $mdThemingProvider
        .definePalette('customPrimary',
                        customPrimary);

    var customAccent = {
        '50': '#98602f',
        '100': '#ac6c35',
        '200': '#bf783b',
        '300': '#c8854b',
        '400': '#ce935f',
        '500': '#d4a072',
        '600': '#e0ba99',
        '700': '#e6c7ad',
        '800': '#ecd5c1',
        '900': '#f2e2d4',
        'A100': '#e0ba99',
        'A200': '#daad86',
        'A400': '#d4a072',
        'A700': '#f8efe8'
    };
    $mdThemingProvider
        .definePalette('customAccent',
                        customAccent);

    var customWarn = {
        '50': '#fae1aa',
        '100': '#f8d892',
        '200': '#f7d07a',
        '300': '#f5c762',
        '400': '#f4bf4a',
        '500': '#f2b632',
        '600': '#f0ad1a',
        '700': '#e3a00e',
        '800': '#cb8f0d',
        '900': '#b37e0b',
        'A100': '#fbe9c2',
        'A200': '#fdf2da',
        'A400': '#fefaf2',
        'A700': '#9b6d0a'
    };
    $mdThemingProvider
        .definePalette('customWarn',
                        customWarn);

    var customBackground = {
        '50': '#f6f6f6',
        '100': '#e9e9e9',
        '200': '#dcdcdd',
        '300': '#cfcfd0',
        '400': '#c2c2c4',
        '500': '#b5b5b7',
        '600': '#a8a8aa',
        '700': '#9b9b9e',
        '800': '#8e8e91',
        '900': '#818185',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#757578'
    };
    $mdThemingProvider
        .definePalette('customBackground',
                        customBackground);

    $mdThemingProvider.theme('default')
        .primaryPalette('customPrimary')
        .accentPalette('customAccent')
        .warnPalette('customWarn')
        .backgroundPalette('customBackground')
});
*/


logApp.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-purple')
      .accentPalette('lime')
    .warnPalette('blue');
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
        .icon('save', '../fonts/icons/harddisk.svg', 24)
});