(function () {    
'use strict';

// Declare app level module which depends on views, and components
angular.module('planner', [
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap.collapse',
  'ui.bootstrap.tpls',
  'LocalStorageModule',
  'planner.login'
])

.config(['$locationProvider', '$routeProvider', 'localStorageServiceProvider',
  function($locationProvider, $routeProvider, localStorageServiceProvider) {
    
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/'});

    localStorageServiceProvider
      .setPrefix('planner');

  }])

.controller('AppController', ['$scope', 
  function($scope){
    
    $scope.isCollapsed = true;

    // Every time the user changes the view, we must collapse the menu
    $scope.$on('$routeChangeStart', function(){
      $scope.isCollapsed = true;
    });

  }]);

})();
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
        $scope.error = 'Please fill in the username and password fields';
        return false;
      }

      $http.post('/auth', {username: $scope.username, password: $scope.password})
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