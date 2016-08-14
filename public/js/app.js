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
  'planner.signup'
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
    $scope.email = '';
    $scope.password = '';

    $scope.submitHandler = function() {
      if($scope.email == '' || $scope.password == '') {
        $scope.error = 'Please fill in the username and password fields';
        return false;
      }

      $http.post('/auth', {email: $scope.email, password: $scope.password})
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
(function () { 
'use strict';

  angular.module('planner.signup', ['ngRoute'])

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

    var validate = function validationHandler() {
      //TODO:: do real validation, just checking that something is passed
      if($scope.name == '' || $scope.email == '' || $scope.password == '') {
        $scope.error = 'Please fill in the username and password fields';
        return false;
      }

      return true;
    };

    $scope.submitHandler = function() {
      
      if(!validate()) {
        return false;
      }

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