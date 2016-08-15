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

  .controller('CreateCtrl', ['$rootScope', '$scope', 'Events', function($rootScope, $scope, Events) {
    
    $scope.submitHandler = function(form) {

      if(form.$valid) {
        $scope.event.created_at = Date.now();
        
        Events.all().$add($scope.event)
          .then(function(event) {
            $scope.infoMessage = "Event saved successfully! You can see it on the events list now.";
          }).catch(function(error) {
            $scope.errorMessage = "There was an error trying to create the event: " + error.message;
          });
      }

    };

  }])

  .controller('EditCtrl', ['$rootScope', '$scope', '$firebaseObject', function($rootScope, $scope, $firebaseObject) {
    
    $scope.submitHandler = function() {
      

    };
    
  }]);

})();