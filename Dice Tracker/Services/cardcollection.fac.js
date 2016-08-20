logApp.factory('CollectionFactory',
    ['$rootScope', '$firebaseAuth', '$firebaseObject', 'Config',
    function ($rootScope, $firebaseAuth, $firebaseObject, Config) {
        var cmObj = {
            //Controller Working From Currently: deckdetails
            //Controller Still to Do: decklist, newcard, newdeck, cardedit.ctr.js

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

            //Get Badge Colors Based on Quantity
            getBadgeColour: function (maxAllow, currentQty) {
                var badgeTypes = ["badgePrimary", "badgeGreen", "badgeRed"]
                if (maxAllow === currentQty) {
                    return badgeTypes[1];
                } else if (maxAllow < currentQty) {
                    return badgeTypes[2];
                } else {
                    return badgeTypes[0];
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

            //Seperate Action Cards into an Array
            cardTypeCheckAction: function (source) {
                var actionCards = [];
                //Check for Action Cards
                for (i = 0; i < source.length; i++) {
                    if (source[i].cardtype === "Action") {
                        actionCards.push(source[i].id);
                    }
                }
                return actionCards;
            },

            //Seperate Hero Cards into an Array
            cardTypeCheckHero: function (source) {
                var heroCards = [];
                //Check for Hero Cards
                for (i = 0; i < source.length; i++) {
                    if (source[i].cardtype === "Hero / Villain") {
                        heroCards.push(source[i].id);
                    }
                }
                return heroCards;
            },

            //check if cards exist
            existArray: function (cardSource, deckCardSource) {
                var doesExist = [];

                for (var i = 0; i < cardSource.length; i++) {
                    for (var j = 0; j < deckCardSource.length; j++) {
                        if (cardSource[i].id === deckCardSource[j].id) {
                            doesExist[j] = true;
                        } //end if Loop
                    }// end for loop
                }//end for loop

                for (i = 0; i < deckCardSource.length; i++) {
                    if (doesExist[i] === undefined) {
                        doesExist[i] = false;
                    }
                }

                return doesExist;
            },

            deckDiceArray: function (cardSource, deckCardSource) {
                var deckDice = [];

                for (var i = 0; i < cardSource.length; i++) {
                    for (var j = 0; j < deckCardSource.length; j++) {
                        if (cardSource[i].id === deckCardSource[j].id) {
                            deckDice.push(cardSource[i]);
                        } //end if Loop
                    }// end for loop
                }//end for loop
                return deckDice;
            },

            //create array of cards under a deck


            //Check if a card deleted from the collection is still in deck collection and remove if required

            //Count Items
            countItem: function (item, term) {
                var diceCount = 0;
                for (i = 0; i < item.length; i++) {
                    if (item[i].cardtype === term) {
                        diceCount = diceCount + item[i].diceQuantity;
                    }
                }
                return diceCount;
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
            },
            
            //Create array of existing Cards in a deck
            createContents: function (dbSource) {
                var deckCardContent = [];
                for (j = 0; j < dbSource.length; j++) {
                    deckCardContent[j] = dbSource[j].name;
                }
                return deckCardContent;
            },

            //Check if card names exist in array
            checkContents: function (arraySource, cardName) {
                var isAdded = false;
                for (i = 0; i < arraySource.length; i++) {
                    if (cardName === arraySource[i]) {
                        isAdded = true;
                        break;
                    }
                }
                return isAdded;
            }
        }
        return cmObj;
    }]);