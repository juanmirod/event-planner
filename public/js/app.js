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
(function () {
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBLdzEKg3XtsvI0JaXL1wTiW7hdxDkrzWU",
    authDomain: "udacity-event-planner-7ce8e.firebaseapp.com",
    databaseURL: "https://udacity-event-planner-7ce8e.firebaseio.com",
    storageBucket: "udacity-event-planner-7ce8e.appspot.com",
  };
  
  firebase.initializeApp(config);
  
  /*
  Firebase constants and service initialization
  */
  angular.module('firebaseAPI', [])

    .constant('FirebaseUrl', 'https://udacity-event-planner-7ce8e.firebaseio.com')
    .service('RootRef', RootRef)
    .service('Users', Users)
    .service('Events', Events)

    .factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
        return $firebaseAuth();
      }
    ]);

  function RootRef() {
    return firebase.database().ref();
  }

  function Users(RootRef, $firebaseObject) {

    var usersRef = RootRef.child('users');

    this.get = function get(id) {
      return $firebaseObject(usersRef.child(id));
    };

  }

  function Events(RootRef, $firebaseArray) {

    var eventsRef = RootRef.child('events');

    this.all = function all() {
      return $firebaseArray(eventsRef);    
    };

  }
})();
(function () {
   
   angular.module('planner.validators', [])

   .directive('password', function(){
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {

          ctrl.$validators.password = function(modelValue, viewValue) {
            
            scope.passwordErrorMessages = [];
            scope.valid = true;

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
(function () { 
'use strict';

  angular.module('planner.login', ['ngRoute', 'firebase'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'js/views/login/login.html',
      controller: 'LoginCtrl'
    });
  }])

  .controller('LoginCtrl', ['$rootScope', '$scope', '$firebaseAuth', function($rootScope, $scope, $firebaseAuth) {
    $scope.email = '';
    $scope.password = '';

    $scope.submitHandler = function() {
      if($scope.email == '' || $scope.password == '') {
        $scope.error = 'Please fill in the username and password fields';
        return false;
      }

      $firebaseAuth().$signInWithEmailAndPassword("my@email.com", "password")
        .then(function(firebaseUser) {
          $rootScope.authUser = firebaseUser;
        })
        .catch(function(error) {
          $scope.error = "Authentication failed: " + error;
        });
    }
  }]);

})();
(function () { 
'use strict';

  angular.module('planner.signup', ['ngRoute', 'planner.validators', 'firebase'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signup', {
      templateUrl: 'js/views/signup/signup.html',
      controller: 'SignupCtrl'
    });
  }])

  .controller('SignupCtrl', ['$rootScope', '$scope', '$firebaseAuth', function($rootScope, $scope, $firebaseAuth) {

    $scope.submitHandler = function(form) {

      if(form.$valid) {
        $firebaseAuth().$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
          .then(function(firebaseUser) {
            $rootScope.authUser = firebaseUser;
          }).catch(function(error) {
            $scope.authError = "There was an error trying to create the user: " + error.message;
          })
      }
    }

  }]);

})();