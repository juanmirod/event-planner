(function () { 
'use strict';

  angular.module('planner.signup', ['ngRoute', 'planner.validators', 'firebaseAPI'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signup', {
      templateUrl: 'js/views/signup/signup.html',
      controller: 'SignupCtrl'
    });
  }])

  .controller('SignupCtrl', ['$rootScope', '$scope', 'Auth', function($rootScope, $scope, Auth) {

    $scope.submitHandler = function(form) {

      if(form.$valid) {
        Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
          .then(function(firebaseUser) {
            $rootScope.authUser = firebaseUser;
          }).catch(function(error) {
            $scope.authError = "There was an error trying to create the user: " + error.message;
          });
      }
      
    };

  }]);

})();