(function () {
'use strict';
   
  angular.module('planner.home', ['firebaseAPI', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'js/views/home/home.html',
      controller: 'HomeCtrl'
    });
  }])

  .controller('HomeCtrl', ['$scope', 'Users', function($scope, Users) {

    $scope.user = Users.get('juanmi');

  }]);

})();