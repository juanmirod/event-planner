(function () { 
'use strict';

  angular.module('planner.event', ['ngRoute', 'firebase'])

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

  .controller('CreateCtrl', ['$rootScope', '$scope', '$firebaseObject', function($rootScope, $scope, $firebaseObject) {
    
    $scope.submitHandler = function() {
      
    };

  }])

  .controller('EditCtrl', ['$rootScope', '$scope', '$firebaseObject', function($rootScope, $scope, $firebaseObject) {
    
    $scope.submitHandler = function() {
      
    };
    
  }]);

})();