(function () { 
'use strict';

  angular.module('planner.login', ['ngRoute', 'firebaseAPI'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'js/views/login/login.html',
      controller: 'LoginCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$waitForSignIn();
        }]
      }
    });
  }])

  .controller('LoginCtrl', ['$rootScope', '$scope', 'Auth', '$location',
    function($rootScope, $scope, Auth, $location) {
      
      $scope.email = '';
      $scope.password = '';

      $scope.submitHandler = function(form) {

        $scope.error = "";

        if(form.$valid) {
          var request = Auth.$signInWithEmailAndPassword($scope.email, $scope.password)
          
          request.then(function(firebaseUser) {
              $location.path("/");
            })
            .catch(function(error) {
              $scope.error = "Authentication failed: " + error;
            });
        }

      };

  }]);

})();