(function () {    
'use strict';

// Declare app level module which depends on views, and components
angular.module('planner', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap.collapse',
    'ui.bootstrap.tpls',
    'planner.login',
    'planner.signup',
    'planner.home',
    'planner.event',
    'firebase',
    'firebaseAPI'
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

.config(['$locationProvider', '$routeProvider', 
  function($locationProvider, $routeProvider) {
    
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/'});

  }])

.controller('AppController', ['$rootScope', '$scope', '$location', 'Auth', 'Users',
  function($rootsScope, $scope, $location, Auth, Users) {
    
    $scope.auth = Auth;

    $scope.$location = $location;
    $scope.isCollapsed = true;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      
      if(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
        //get the user info
        Users.get(firebaseUser.uid).$loaded(function(userInfo){
          $scope.firebaseUser.name = userInfo.name;
          $scope.firebaseUser.bio = userInfo.bio;
        });
      } else {
        $scope.firebaseUser = undefined;
      }

    });

    // Every time the user changes the view, we must collapse the menu
    $scope.$on('$routeChangeStart', function(){
      $scope.isCollapsed = true;
    });

  }]);

})();