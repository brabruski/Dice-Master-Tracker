logApp.factory('DBServices',
    ['$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
    function ($rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

        //create db access object & methods
        var dbObj = {
            cardCollection: function () {
                var collectionRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                var collectionInfo = $firebaseArray(collectionRef);
                return collectionInfo;
            },
            
            deckCollection: function () {
                var deckRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks');
                var deckInfo = $firebaseArray(deckRef);
                return deckInfo;
            },

            deckCollectionContents: function (currentDeck) {
                var deckContentRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + currentDeck + '/contents');
                var deckContentInfo = $firebaseArray(deckContentRef);
                return deckContentInfo;
            },

            deckCollectionContentQty: function (currentDeck, currentCard) {
                var deckContentQtyRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + currentDeck + '/contents/' + currentCard);
                var deckContentQtyInfo = $firebaseArray(deckContentQtyRef);
                return deckContentQtyInfo;
            }

        };

        return dbObj;

    }]);