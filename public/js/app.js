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
])

.config(['$locationProvider', '$routeProvider', 'localStorageServiceProvider',
  function($locationProvider, $routeProvider, localStorageServiceProvider) {
    
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/'});

    localStorageServiceProvider
      .setPrefix('planner');

  }])

.controller('AppController', ['$scope', 
  function($scope) {
    
    $scope.isCollapsed = true;

    // Every time the user changes the view, we must collapse the menu
    $scope.$on('$routeChangeStart', function(){
      $scope.isCollapsed = true;
    });

  }]);

})();
(function () {
   
   angular.module('planner.validators', [])

   .directive('password', function(){
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {

          scope.valid = true;
          

          ctrl.$validators.password = function(modelValue, viewValue) {
            
            scope.passwordErrorMessages = [];

            var addErrorMessage = function(message) {
              scope.passwordErrorMessages.push(message);
            }

            if(ctrl.$isEmpty(modelValue)) {
              return true;
            }
                        
            if(viewValue.match(/[^A-z0-9\\!\\@\\#\\$\\%\\^\\&\\*]/)) {
              addErrorMessage('The password constains illegal characters.');
              scope.valid = false;
            }

            if(viewValue.length < 10 || viewValue.length > 100) {
              addErrorMessage('The password must be between 10 and 100 characters long.');
              scope.valid = false;
            }

            // Check for characters that the password must contain, 
            // this could be written like the other conditions above,
            // but this way is shorter
            var mustContain = [
              ['[\\!\\@\\#\\$\\%\\^\\&\\*]', 'It must contain at least one of this symbols: !@#$%^&*'],
              ['\\d', 'It must contain a number'],
              ['[a-z]', 'It must contain a lowercase character'],
              ['[A-Z]', 'It must contain an uppercase character'],
            ];

            mustContain.forEach(function(constraint) {

              var regex = new RegExp(constraint[0],"g");
              if (!regex.test(viewValue)) {
                addErrorMessage(constraint[1]);
                scope.valid = false;
              }

            });
            
            return scope.valid;
          }
        }  
      }
   }); 

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

  angular.module('planner.signup', ['ngRoute', 'planner.validators'])

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

    console.log($scope);

    /*var validate = function validationHandler() {
      //TODO:: do real validation, just checking that something is passed
      if($scope.name == '' || $scope.email == '' || $scope.password == '') {
        $scope.error = 'Please fill in the username and password fields';
        return false;
      }

      return true;
    };*/

    $scope.submitHandler = function() {
      
      /*if(!validate()) {
        return false;
      }*/

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