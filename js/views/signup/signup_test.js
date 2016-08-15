describe('planner.signup module', function() {
'use strict';

  beforeEach(module('planner.signup'));

  var $controller, 
    $rootScope, 
    $scope, 
    $authAvailable,
    $q,
    testRunnerUser = {
      uid: 1, 
      name: 'testrunner', 
      email: 'testrunner@fake.com', 
      password: 'DumbBotPassword123'
    };

  beforeEach(inject(function($injector) {
  
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $q = $injector.get('$q');
  
  }));

  describe('signup controller', function(){

    var form;

    beforeEach(function(){
      form = {$valid: true};
      $controller('SignupCtrl', {'$scope': $scope});
    });

    it('should do nothing if the form is not valid', function() {
    
      form.$valid = false;  
      $scope.submitHandler(form);

    });

    /*describe('signup process success', function(){

        beforeEach(function() {
          $authAvailable = true;

          var $auth = function(){
            return {
              $createUserWithEmailAndPassword: function(email, password) {
                return $q.when(testRunnerUser);
              }
            }
          };

          // bind the controller to our scope and mocked auth service
          $controller('SignupCtrl', {'$scope': $scope, '$firebaseAuth': $auth});

          jasmine.clock().install();
        });

        afterEach(function() {
          jasmine.clock().uninstall();
        });

        it('should do a request to firebase on submit to create the user', function() {
          // simulate user input
          $scope.user = testRunnerUser;
          $scope.submitHandler(form);
          setTimeout(function(){
            expect($rootScope.authUser.uid).toBe(1);
          }, 100);
          jasmine.clock().tick(101);
        });

    });*/

    /*describe('signup process fail', function(){
      
      beforeEach(function() {


        // bind the controller to our scope and mocked auth service
        //$controller('SignupCtrl', {'$scope': $scope, '$firebaseAuth': $auth});
        $scope.user = testRunnerUser;
        $scope.submitHandler(form);
      });

      it('should return an error message when signup failed', function() {
        
        expect($scope.authError).toBe('User creation failed!');

      });
    })*/

  });

});