(function () { 
'use strict';

  angular.module('planner.login', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'js/views/login/login.html',
      controller: 'LoginCtrl'
    });
  }])

  .controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.username = '';
    $scope.password = '';

    $scope.submitHandler = function() {
      if($scope.username == '' || $scope.password == '') {
        $scope.error = 'Please fill in the username and password';
        return false;
      }

      $http.post('/auth', {username: $scope.username, password: $scope.password})
        .then(function authHandler(response) {
          $scope.id = response.data.id;
        })
        .catch(function authFailHandler(error) {
          $scope.error = error.data.message;
        });
    }
  }]);

})();