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

    $scope.submitHandler = function(form) {

      if(form.$valid) {
      
        $http.post('/signup', $scope.user)
          .then(function authHandler(response) {
            $scope.id = response.data.id;
          })
          .catch(function authFailHandler(error) {
            $scope.authError = 'There was an error trying to authenticate the user ';
            $scope.error = $scope.authError + error.data;
          });
      
      }
    }

  }]);

})();