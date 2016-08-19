(function(angular) { 
'use strict';

  angular.module('planner.event', ['ngRoute', 'firebase', 'firebaseAPI'])

  .constant('EventTypes', [
    {name: 'Conference',      icon: 'glyphicon-user'},
    {name: 'Company Meet-up', icon: 'glyphicon-user'},
    {name: 'Sport event',     icon: 'glyphicon-flag'},
    {name: 'Birthday Party',  icon: 'glyphicon-gift'},
    {name: 'Wedding',         icon: 'glyphicon-heart'},
    {name: 'Newborn party',         icon: 'glyphicon-baby-formula'},
    {name: 'Pokemon Championship',  icon: 'glyphicon-star'},
  ])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/create', {
      templateUrl: 'public/js/views/event/event_form.html',
      controller: 'CreateCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    });

    $routeProvider.when('/edit/:ref', {
      templateUrl: 'public/js/views/event/event_form.html',
      controller: 'CreateCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    });
  }])

  .controller('CreateCtrl', ['$scope', 'Events', '$route', '$timeout', 'currentAuth', 'EventTypes',
    function($scope, Events, $route, $timeout, currentAuth, EventTypes) {

      // Initialization
      $scope.event = {};
      
      // If we get the ref in the route, get the event
      if(typeof($route.current.params.ref) != 'undefined') {
        
        $scope.ref = $route.current.params.ref;
        loadEvent($scope.ref);

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
      
      };

      /*
        Stores the event in firebase
      */
      $scope.submitHandler = function(form) {

        if(form.$valid) {

          // Get the UNIX time of the dates
          $scope.event.start_date = new Date($scope.event._start_date_form).getTime();
          $scope.event.end_date = new Date($scope.event._end_date_form).getTime();

          // If the event has already been created, update it
          if(typeof($scope.ref) != 'undefined') {

            updateEvent();

          } else {

            createEvent();

          }

        } else {
          
          $scope.errorMessage = "Please check that all required fields are filled and dates are correctly formatted.";
        
        }

      };
      
      /*
        Load an event from firebase and sets the date format to show it on the form
      */
      function loadEvent(id) {

        var event = Events.get(id);
        $scope.event = event;
        $scope.saveDisabled = true;

        // Format the dates when loaded
        event.$loaded().then(function(ref){
          $scope.saveDisabled = false;
          $scope.event._start_date_form = new Date($scope.event.start_date);
          $scope.event._end_date_form = new Date($scope.event.end_date);            
        });

      }

      /*
        Create a new event and shows the result from firebase.
      */
      function createEvent() {

        $scope.event.created_at = Date.now();
        $scope.event.created_by = currentAuth.uid;
        
        Events.list.$add($scope.event)
          .then(function(ref) {
            
            $scope.saveDisabled = true;
            $scope.infoMessage = "Event saved successfully! You can see it on the events list now.";

            $scope.ref = ref.key;
            loadEvent(ref.key);

            $timeout($scope.continueEditing, 2000);

          }).catch(function(error) {

            $scope.errorMessage = "There was an error trying to create the event: " + error.message;
          
          });
      
      }

      /*
        Save the current event
      */
      function updateEvent() {

        $scope.event.$save()
          .then(function(ref) {
            
            $scope.saveDisabled = true;
            $scope.infoMessage = "Event saved successfully!";
            $timeout($scope.continueEditing, 1000);

          })
          .catch(function(error) {

            $scope.errorMessage = "There was an error trying to update the event: " + error.message;
            
          });

      }

      // Remove the info message to show the save button again 
      // (but now it will be disabled because the event is bind to 
      // the firebase object)
      $scope.continueEditing = function() {
        
        $scope.saveDisabled = false;
        $scope.infoMessage = undefined;
      
      };

  }]);

})(window.angular);