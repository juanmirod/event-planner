(function () {    
'use strict';

// Declare app level module which depends on views, and components
angular.module('planner', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap.collapse',
    'ui.bootstrap.tpls',
    'LocalStorageModule',
    'planner.login',
    'planner.signup',
    'planner.home',
    'firebase'
  ])

.run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $location.path("/");
      }
    });
  }])

.config(['$locationProvider', '$routeProvider', 'localStorageServiceProvider',
  function($locationProvider, $routeProvider, localStorageServiceProvider) {
    
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/'});

    localStorageServiceProvider
      .setPrefix('planner');

  }])

.controller('AppController', ['$rootScope', '$scope', 
  function($rootsScope, $scope) {
    
    $scope.isCollapsed = true;

    // Every time the user changes the view, we must collapse the menu
    $scope.$on('$routeChangeStart', function(){
      $scope.isCollapsed = true;
    });

  }]);

})();