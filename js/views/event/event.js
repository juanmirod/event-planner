(function () { 
'use strict';

  angular.module('planner.event', ['ngRoute', 'firebase', 'firebaseAPI'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/create', {
      templateUrl: 'js/views/event/create.html',
      controller: 'CreateCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    });

    $routeProvider.when('/edit', {
      templateUrl: 'js/views/event/edit.html',
      controller: 'EditCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    });
  }])

  .controller('CreateCtrl', ['$rootScope', '$scope', 'Events', 'currentAuth', function($rootScope, $scope, Events, currentAuth) {
    
    $scope.submitHandler = function(form) {

      if(form.$valid) {
        $scope.event.created_at = Date.now();
        $scope.event.created_by = currentAuth.uid;
        $scope.event.start_date = new Date($scope.event.start_date).getTime();
        $scope.event.end_date = new Date($scope.event.end_date).getTime();
        
        Events.all().$add($scope.event)
          .then(function(event) {
            $scope.infoMessage = "Event saved successfully! You can see it on the events list now.";
          }).catch(function(error) {
            $scope.errorMessage = "There was an error trying to create the event: " + error.message;
          });
      } else {
        $scope.errorMessage = "Please check that all required fields are filled and dates are correctly formatted.";
      }

    };

  }])

  .controller('EditCtrl', ['$rootScope', '$scope', '$firebaseObject', function($rootScope, $scope, $firebaseObject) {
    
    $scope.submitHandler = function() {
      

    };
    
  }]);

})();