(function () {
'use strict';
   
  angular.module('planner.home', ['firebaseAPI', 'ngRoute', 'ngMap', 'planner.event'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'js/views/home/home.html',
      controller: 'HomeCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$waitForSignIn();
        }]
      }
    });
  }])

  .controller('HomeCtrl', ['$rootScope', '$scope', 'Events', 'currentAuth', 'EventTypes',
    function($rootScope, $scope, Events, currentAuth, EventTypes) {

    $rootScope.authUser = currentAuth;

    function byDate(eventA, eventB) {
      
      if (eventA.start_date < eventB.start_date) {
        return -1;
      }

      if (eventA.start_date > eventB.start_date) {
        return 1;
      }
      
      return 0;

    }

    $scope.toggleMap = function(event) {
      
      if(event._showMap) {
        event._showMap = false;
      } else {
        event._showMap = true;
      }

    }

    $scope.userHasCreated = function(event, user) {
    
      if(user && event.created_by) {
        return event.created_by == user.uid;
      }

      return false;
    
    }

    $scope.eventIcon = function(event) {
     
      // default icon
      var icon = 'glyphicon-map-marker';

      EventTypes.some(function(eventType){
        if(eventType.name == event.type) {
          icon = eventType.icon;
        }
      });

      return icon;
    
    }

    // sort the list of events by date
    Events.list.sort(byDate);
    $scope.events = Events.list;

    // each time the server sends records, re-sort
    Events.list.$watch(function() { Events.list.sort(byDate); });

  }]);

})();