(function () { 
'use strict';

  angular.module('planner.signup', ['ngRoute', 'planner.validators'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signup', {
      templateUrl: 'js/views/signup/signup.html',
      controller: 'SignupCtrl'
    });
  }])

  .controller('SignupCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.name = '';
    $scope.email = '';
    $scope.password = '';

    console.log($scope);

    /*var validate = function validationHandler() {
      //TODO:: do real validation, just checking that something is passed
      if($scope.name == '' || $scope.email == '' || $scope.password == '') {
        $scope.error = 'Please fill in the username and password fields';
        return false;
      }

      return true;
    };*/

    $scope.submitHandler = function() {
      
      /*if(!validate()) {
        return false;
      }*/

      var userdata = {
        name: $scope.name,
        email: $scope.email,
        password: $scope.password
      };

      $http.post('/signup', userdata)
        .then(function authHandler(response) {
          $scope.id = response.data.id;
        })
        .catch(function authFailHandler(error) {
          $scope.authError = 'There was an error trying to authenticate the user ';
          $scope.error = $scope.authError + error.data;
        });
    }

  }]);

})();