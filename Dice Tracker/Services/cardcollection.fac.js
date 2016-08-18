logApp.factory('CollectionFactory',
    ['$rootScope', '$firebaseAuth', '$firebaseObject', 'Config',
    function ($rootScope, $firebaseAuth, $firebaseObject, Config) {
        var cmObj = {
            //Controller Working From Currently: carddetails.ctr.js
            getRarity: function (item) {
                var rarity = ["common", "uncommon", "rare", "srare"]
                switch (item.rarity) {
                    case "Uncommon":
                        return rarity[1];
                    case "Rare":
                        return rarity[2];
                    case "Super Rare":
                        return rarity[3];
                    default:
                        return rarity[0];
                }
            },

            hideActionVersion: function (typeOfCard) {
                if (typeOfCard === 'Action') {
                    return true;
                } else {
                    return false;
                }
            },


        }
        return cmObj;
    }]);