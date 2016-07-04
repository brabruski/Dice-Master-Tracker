﻿logApp.controller('AddController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
    function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {
        //$rootScope taken from authentication service to gain User ID. $firebaseArray for writing to database

        //get details about logged in user to get data assigned to that user
        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseAuth(ref);

        //ensures whatever is done, user is authenticated
        auth.$onAuth(function (authUser) {
            //create url for user using hash key
            if (authUser) {
                //where to store new object when required if firebase sees Authenticated user
                var collectionRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/collection');
                var collectionInfo = $firebaseArray(collectionRef);

                $scope.cardenergy = 'Fist';
                $scope.cardaffiliation = 'Marvel';
                $scope.dicequantity = '1';

                $scope.addCard = function () {
                    //$add firebase method for adding to database
                    collectionInfo.$add({
                        name: $scope.cardname,
                        cost: $scope.cardcost,
                        energy: $scope.cardenergy,
                        image: $scope.cardimage,
                        affiliation: $scope.cardaffiliation,
                        description: $scope.carddescription,
                        colour: $scope.cardcolour,
                        series: $scope.cardseries,
                        quantity: $scope.dicequantity,
                        date: Firebase.ServerValue.TIMESTAMP
                    }).then(function () {
                        //after submitting, clears the fields
                        $scope.cardname = '';
                        $scope.cardcost = '';
                        $scope.cardimage = '';
                        $scope.cardseries = '';
                        $scope.carddescription = '';
                        $scope.cardcolour = '';
                        $scope.dicequantity = '1';
                    }
                    );
                };

                
            }
        });
    }]);