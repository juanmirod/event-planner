'use strict';

// Declare app level module which depends on views, and components
angular.module('planner', [
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap.collapse',
  'ui.bootstrap.tpls',
  'login'
]).

config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
    
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/'});

  }]).

controller('AppController', ['$scope', 
  function($scope){
    
    $scope.isCollapsed = true;

    // Every time the user changes the view, we must collapse the menu
    $scope.$on('$routeChangeStart', function(){
      $scope.isCollapsed = true;
    });

  }]);
'use strict';

angular.module('login', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'js/views/login/login.html',
      controller: 'LoginCtrl'
    });
  }])

  .controller('LoginCtrl', ['$scope', function($scope){

  }]);