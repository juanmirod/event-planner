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

.config(['$locationProvider', '$routeProvider', 'localStorageServiceProvider',
  function($locationProvider, $routeProvider, localStorageServiceProvider) {
    
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/'});

    localStorageServiceProvider
      .setPrefix('planner');

  }])

.controller('AppController', ['$rootScope', '$scope', '$location', 'Auth', 'Users',
  function($rootsScope, $scope, $location, Auth, Users) {
    
    $scope.auth = Auth;

    $scope.$location = $location;
    $scope.isCollapsed = true;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      //get the user info
      Users.get(firebaseUser.uid).$loaded(function(userInfo){
        $scope.firebaseUser.name = userInfo.name;
        $scope.firebaseUser.bio = userInfo.bio;
      })

    });

    // Every time the user changes the view, we must collapse the menu
    $scope.$on('$routeChangeStart', function(){
      $scope.isCollapsed = true;
    });

  }]);

})();
(function () {
'use strict';
  
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
    .factory("Auth", FirebaseAuth);

  function FirebaseAuth($firebaseAuth) {
    
    return $firebaseAuth();
  
  }

  function RootRef() {
  
    return firebase.database().ref();
  
  }

  function Users(RootRef, $firebaseArray, $firebaseObject) {

    var usersRef = RootRef.child('users');

    this.list = $firebaseArray(usersRef);

    this.get = function get(id) {
      return $firebaseObject(usersRef.child(id));
    };

    this.newUser = function newUser(id) {
      return  usersRef.child(id);
    }

  }

  function Events(RootRef, $firebaseArray,  $firebaseObject) {

    var eventsRef = RootRef.child('events');
    
    this.list = $firebaseArray(eventsRef);

    this.get = function get(id) {
      return $firebaseObject(eventsRef.child(id));
    };

  }
})();
(function () {
'use strict';

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
            };

            if(ctrl.$isEmpty(modelValue)) {
              addErrorMessage('This field is required');
              return false;
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
          };
        }  
      };
   }); 

})();
(function () { 
'use strict';

  angular.module('planner.event', ['ngRoute', 'firebase', 'firebaseAPI'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/create', {
      templateUrl: 'js/views/event/event_form.html',
      controller: 'CreateCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    });

    $routeProvider.when('/edit/:ref', {
      templateUrl: 'js/views/event/event_form.html',
      controller: 'CreateCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    });
  }])

  .controller('CreateCtrl', ['$scope', 'Events', '$route', '$timeout', 'currentAuth', 'NgMap',
    function($scope, Events, $route, $timeout, currentAuth, NgMap) {

      // Initialization
      $scope.event = {};
      $scope.triedLocation = false;
      NgMap.getMap().then(function(map) {
        $scope.map = map;
      });
    
      // If we get the ref in the route, get the event
      if(typeof($route.current.params.ref) != 'undefined') {
        
        $scope.ref = $route.current.params.ref;
        loadEvent($scope.ref);

      }

      /*
        Stores the event in firebase
      */
      $scope.submitHandler = function(form) {

        if(form.$valid) {

          // Get the UNIX time of the dates
          $scope.event.start_date = new Date($scope.event._start_date_form).getTime();
          $scope.event.end_date = new Date($scope.event._end_date_form).getTime();

          // If the event has already been created, update it
          if(typeof($scope.ref) != 'undefined') {

            updateEvent();

          } else {

            createEvent();

          }

        } else {
          
          $scope.errorMessage = "Please check that all required fields are filled and dates are correctly formatted.";
        
        }

      };

      /*
        Get the user current location through the browser service
       */
      $scope.getLocation = function askForLocation() {
        if(navigator.geolocation && !$scope.triedLocation) {
          $scope.triedLocation = true;
          navigator.geolocation.getCurrentPosition(
            function(location){
              $scope.event.location = '(' + location.coords.latitude + ', ' + location.coords.longitude +')';
              $scope.located = true;
              $scope.$apply();
              $scope.map.setCenter({lat: location.coords.latitude, lng: location.coords.longitude});
            },
            function(error){
              $scope.event.location = "Sorry, but we couldn't get your location";
              $scope.$apply();
              console.log("There was an error trying to get the user location: ", error);
            });
        }
      };

      /*
        Center the map on the entered location, called when location is changed
      */
      $scope.locationChangedHandler = function() {
        
        // The user moved the marker
        if(this.position) {
        
          $scope.map.setCenter(this.position);
          $scope.event.location = this.position.toString();
          $scope.$apply();
        
        } else { // The user typed an address
        
          $scope.place = this.getPlace();
          $scope.map.setCenter($scope.place.geometry.location);
        
        }

      }
      
      /*
        Load an event from firebase and sets the date format to show it on the form
      */
      function loadEvent(id) {

        var event = Events.get(id);
        $scope.event = event;
        $scope.saveDisabled = true;

        // Format the dates when loaded
        event.$loaded().then(function(ref){
          $scope.saveDisabled = false;
          $scope.event._start_date_form = new Date($scope.event.start_date);
          $scope.event._end_date_form = new Date($scope.event.end_date);            
        });

      }

      /*
        Create a new event and shows the result from firebase.
      */
      function createEvent() {

        $scope.event.created_at = Date.now();
        $scope.event.created_by = currentAuth.uid;
        
        Events.list.$add($scope.event)
          .then(function(ref) {
            
            $scope.saveDisabled = true;
            $scope.infoMessage = "Event saved successfully! You can see it on the events list now.";

            $scope.ref = ref.key;
            loadEvent(ref.key);

            $timeout($scope.continueEditing, 1000);

          }).catch(function(error) {

            $scope.errorMessage = "There was an error trying to create the event: " + error.message;
          
          });
      
      }

      /*
        Save the current event
      */
      function updateEvent() {

        $scope.event.$save()
          .then(function(ref) {
            
            $scope.saveDisabled = true;
            $scope.infoMessage = "Event saved successfully!";
            $timeout($scope.continueEditing, 1000);

          })
          .catch(function(error) {

            $scope.errorMessage = "There was an error trying to update the event: " + error.message;
            
          });

      }

      // Remove the info message to show the save button again 
      // (but now it will be disabled because the event is bind to 
      // the firebase object)
      $scope.continueEditing = function() {
        
        $scope.saveDisabled = false;
        $scope.infoMessage = undefined;
      
      }

  }]);

})();
(function () {
'use strict';
   
  angular.module('planner.home', ['firebaseAPI', 'ngRoute', 'ngMap'])

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

  .controller('HomeCtrl', ['$rootScope', '$scope', 'Events', 'currentAuth', function($rootScope, $scope, Events, currentAuth) {

    $rootScope.authUser = currentAuth;
    $scope.events = Events.list;

  }]);

})();
(function () { 
'use strict';

  angular.module('planner.login', ['ngRoute', 'firebaseAPI'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'js/views/login/login.html',
      controller: 'LoginCtrl',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$waitForSignIn();
        }]
      }
    });
  }])

  .controller('LoginCtrl', ['$rootScope', '$scope', 'Auth', '$location',
    function($rootScope, $scope, Auth, $location) {
      $scope.email = '';
      $scope.password = '';

      $scope.submitHandler = function(form) {

        if(form.$valid) {
          var request = Auth.$signInWithEmailAndPassword($scope.email, $scope.password)
          
          request.then(function(firebaseUser) {
              $location.path("/");
            })
            .catch(function(error) {
              $scope.error = "Authentication failed: " + error;
            });
        }

      };

  }]);

})();
(function () { 
'use strict';

  angular.module('planner.signup', ['ngRoute', 'planner.validators', 'firebaseAPI'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signup', {
      templateUrl: 'js/views/signup/signup.html',
      controller: 'SignupCtrl'
    });
  }])

  .controller('SignupCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Users',
    function($rootScope, $scope, $location, Auth, Users) {

    $scope.submitHandler = function(form) {

      if(form.$valid) {
        Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
          .then(function(firebaseUser) {
            
            // keep the reference to remove if the next step fails
            $scope.firebaseUser = firebaseUser;
            console.log(firebaseUser);
            // Store the user name and bio as a new object
            return Users.newUser(firebaseUser.uid)
              .set({
                name: $scope.user.name,
                bio: $scope.user.bio || '' 
              });

          })
          .then(function(userData) {

            $location.path('/');

          })
          .catch(function(error) {
            
            $scope.authError = "There was an error trying to create the user: " + error.message;

            if(typeof($scope.firebaseUser) != 'undefined') {

              // there was an error, rollback so the user can use the same email
              $scope.firebaseUser.delete()
                .catch(function(error) {
                  console.log('Removing the user with errors failed, time to go home...');
                  $scope.authError += error;
                });

            }
          
          });
      }
      
    };

  }]);

})();