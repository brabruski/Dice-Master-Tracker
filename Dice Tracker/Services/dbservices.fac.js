logApp.factory('DBServices',
    ['$rootScope', '$firebaseAuth', '$firebaseArray', 'Config',
    function ($rootScope, $firebaseAuth, $firebaseArray, Config) {

        //create db access object & methods
        var dbObj = {
            cardCollection: function () {
                var collectionRef = new Firebase(Config.FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                var collectionInfo = $firebaseArray(collectionRef);
                return collectionInfo;
            },
            
            deckCollection: function () {
                var deckRef = new Firebase(Config.FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks');
                var deckInfo = $firebaseArray(deckRef);
                return deckInfo;
            },

            deckCollectionContents: function (currentDeck) {
                var deckContentRef = new Firebase(Config.FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + currentDeck + '/contents');
                var deckContentInfo = $firebaseArray(deckContentRef);
                return deckContentInfo;
            },

            deckCollectionContentQty: function (currentDeck, currentCard) {
                var deckContentQtyRef = new Firebase(Config.FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/decks/' + currentDeck + '/contents/' + currentCard);
                var deckContentQtyInfo = $firebaseArray(deckContentQtyRef);
                return deckContentQtyInfo;
            },

            collectionImages: function () {
                var contentImgRef = new Firebase(Config.FIREBASE_IMG_URL + 'cardimages/');
                var contentImgInfo = $firebaseArray(contentImgRef);
                return contentImgInfo;                
            }

        };

        return dbObj;

    }]);