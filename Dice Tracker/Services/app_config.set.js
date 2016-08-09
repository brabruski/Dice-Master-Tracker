logApp.constant('Config', {
    FIREBASE_URL: 'https://dicetracker18052016.firebaseio.com/',
    FIREBASE_IMG_URL: 'gs://dicetracker18052016.appspot.com/'
});

logApp.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
});