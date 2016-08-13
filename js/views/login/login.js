(function () { 
'use strict';

angular.module('planner.login', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'js/views/login/login.html',
      controller: 'LoginCtrl'
    });
  }])

  .controller('LoginCtrl', ['$scope', function($scope) {
    $scope.username = '';
    $scope.password = '';
  }]);

})();