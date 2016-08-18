(function () {
'use strict';
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBLdzEKg3XtsvI0JaXL1wTiW7hdxDkrzWU",
    authDomain: "udacity-event-planner-7ce8e.firebaseapp.com",
    databaseURL: "https://udacity-event-planner-7ce8e.firebaseio.com",
    storageBucket: "udacity-event-planner-7ce8e.appspot.com",
  };
  
  firebase.initializeApp(config);
  
  /*
  Firebase constants and service initialization
  */
  angular.module('firebaseAPI', [])

    .constant('FirebaseUrl', 'https://udacity-event-planner-7ce8e.firebaseio.com')
    
    .service('RootRef', function RootRef() {
  
      return firebase.database().ref();
    
    })

    .service('Users', ['RootRef', '$firebaseArray', '$firebaseObject', 
      function Users(RootRef, $firebaseArray, $firebaseObject) {

        var usersRef = RootRef.child('users');

        this.list = $firebaseArray(usersRef);

        this.get = function get(id) {
          return $firebaseObject(usersRef.child(id));
        };

        this.newUser = function newUser(id) {
          return  usersRef.child(id);
        }

      }])

    .service('Events', ['RootRef', '$firebaseArray', '$firebaseObject', 
      function Events(RootRef, $firebaseArray,  $firebaseObject) {

        var eventsRef = RootRef.child('events');
        
        this.list = $firebaseArray(eventsRef);

        this.get = function get(id) {
          return $firebaseObject(eventsRef.child(id));
        };

      }])
    
    .factory("Auth", ['$firebaseAuth', function FirebaseAuth($firebaseAuth) {
    
      return $firebaseAuth();
  
    }]);

})();