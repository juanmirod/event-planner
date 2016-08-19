(function (angular) { 
'use strict';

  angular.module('planner.signup', ['ngRoute', 'planner.validators', 'firebaseAPI'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signup', {
      templateUrl: 'js/views/signup/signup.html',
      controller: 'SignupCtrl'
    });
  }])

  .controller('SignupCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Users',
    function($rootScope, $scope, $location, Auth, Users) {

    $scope.submitHandler = function(form) {

      if(form.$valid) {
        Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
          .then(function(firebaseUser) {
            
            // keep the reference to remove if the next step fails
            $scope.firebaseUser = firebaseUser;
            // Store the user name and bio as a new object
            return Users.newUser(firebaseUser.uid)
              .set({
                name: $scope.user.name,
                bio: $scope.user.bio || '' 
              });

          })
          .then(function(userData) {

            $location.path('/');

          })
          .catch(function(error) {
            
            $scope.authError = "There was an error trying to create the user: " + error.message;

            if(typeof($scope.firebaseUser) != 'undefined') {

              // there was an error, rollback so the user can use the same email
              $scope.firebaseUser.delete()
                .catch(function(error) {
                  //console.log('Removing the user with errors failed, time to go home...');
                  $scope.authError += error;
                });

            }
          
          });
      }
      
    };

  }]);

})(window.angular);