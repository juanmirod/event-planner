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
    .service('RootRef', RootRef)
    .service('Users', Users)
    .service('Events', Events)
    .factory("Auth", FirebaseAuth);

  function FirebaseAuth($firebaseAuth) {
    
    return $firebaseAuth();
  
  }

  function RootRef() {
  
    return firebase.database().ref();
  
  }

  function Users(RootRef, $firebaseObject) {

    var usersRef = RootRef.child('users');

    this.get = function get(id) {
      return $firebaseObject(usersRef.child(id));
    };

  }

  function Events(RootRef, $firebaseArray) {

    var eventsRef = RootRef.child('events');

    this.all = function all() {
      return $firebaseArray(eventsRef);    
    };

    this.add = function add() {
      return $firebaseArray(eventsRef).$add;
    }

  }
})();