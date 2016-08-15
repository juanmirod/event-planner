(function () { 
'use strict';

  angular.module('planner.login', ['ngRoute', 'firebase'])

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

  .controller('LoginCtrl', ['$rootScope', '$scope', '$firebaseAuth', function($rootScope, $scope, $firebaseAuth) {
    $scope.email = '';
    $scope.password = '';

    $scope.submitHandler = function() {
      if($scope.email === '' || $scope.password === '') {
        $scope.error = 'Please fill in the username and password fields';
        return false;
      }

      $firebaseAuth().$signInWithEmailAndPassword("my@email.com", "password")
        .then(function(firebaseUser) {
          $rootScope.authUser = firebaseUser;
        })
        .catch(function(error) {
          $scope.error = "Authentication failed: " + error;
        });
    };

  }]);

})();