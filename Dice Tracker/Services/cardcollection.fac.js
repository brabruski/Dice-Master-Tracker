logApp.factory('CollectionFactory',
    ['$rootScope', '$firebaseAuth', '$firebaseObject', 'Config',
    function ($rootScope, $firebaseAuth, $firebaseObject, Config) {
        var cmObj = {
            //Controller Working From Currently: cardlist
            //Controller Still to Do: deckdetails, decklist, newcard, newdeck, cardedit.ctr.js

            //Check the ID of Item to Delete
            checkItemKey: function (dbArrayName, idKey) {
                var deleteKey = 0;
                for (j = 0; j < dbArrayName.length; j++) {
                    if (idKey === dbArrayName[j].id) {
                        deleteKey = j;
                    }
                }
                return deleteKey;
            },

            //Add rarity stripe CSS class to cards
            getRarity: function (item) {
                var rarity = ["common", "uncommon", "rare", "srare"];
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

            //Return Boolean if card is action Card or Not
            hideActionVersion: function (typeOfCard) {
                if (typeOfCard === 'Action') {
                    return true;
                } else {
                    return false;
                }
            },
            //Navigation Buttons
            prevBtn: function (itemId, item) {
                var prevItem;
                if (itemId > 0) {
                    prevItem = Number(itemId) - 1;
                } else {
                    prevItem = item.length - 1;
                };
                return prevItem;
            },

            nextBtn: function (itemId, item) {
                var nextItem;
                if (itemId < item.length - 1) {
                    nextItem = Number(itemId) + 1;
                } else {
                    nextItem = 0;
                };
                return nextItem;
            },

            //Set all Energy Types Available
            energyOptions: function () {
                var energyTypes = ['Fist', 'Lightning', 'Mask', 'Shield', 'Generic'];
                return energyTypes;
            },

            maxDice: function (maxDice) {
                //Create an Array of Option Values
                var maxDiceInSet = [];
                for (var i = 0; i < maxDice; i++) {
                    maxDiceInSet.push(i + 1);
                }
                return maxDiceInSet;
            }

            //
        };
        return cmObj;
    }]);