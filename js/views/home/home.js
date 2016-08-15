(function () {
'use strict';
   
  angular.module('planner.home', ['firebaseAPI', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'js/views/home/home.html',
      controller: 'HomeCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$waitForSignIn();
        }]
      }
    });
  }])

  .controller('HomeCtrl', ['$rootScope', 'Users', 'currentAuth', function($rootScope, Users, currentAuth) {

    $rootScope.authUser = currentAuth;

  }]);

})();