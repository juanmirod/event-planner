describe('planner.signup module', function() {
'use strict';

  var createController,
    rootScope, 
    scope, 
    $q,
    firebaseAuth,
    testRunnerUser = {
      uid: 1, 
      name: 'testrunner', 
      email: 'testrunner@fake.com', 
      password: 'DumbBotPassword123'
    };

  beforeEach(function(){
    module('planner.signup')

    module(function($provide){
      $provide.factory('$firebaseAuth', function($q) {
        return function() {
          return {
            '$createUserWithEmailAndPassword': function(email, password) {
              return $q.when(testRunnerUser);
            }
          };
        };
      });

      return null;
    });

  });


  beforeEach(function() {
  
    inject(function($controller, $rootScope, _$firebaseAuth_, _$q_) {

      // The injector unwraps the underscores (_) from around the parameter names when matching    
      firebaseAuth = _$firebaseAuth_;
      scope = $rootScope.$new();
      rootScope = $rootScope;
      $q = _$q_;
      
      createController = function(params) {
        return $controller("SignupCtrl", {
          $rootScope: rootScope,
          $scope: scope,
          $firebaseAuth: firebaseAuth,
          $stateParams: params || {}
        });
      };

    });
  
  });

  describe('signup controller', function(){

    var form;

    beforeEach(function(){
      form = {$valid: true};
    });

    it('should do nothing if the form is not valid', function() {
    
      form.$valid = false;  
      createController();
      scope.submitHandler(form);

    });

    /*describe('signup process success', function(){

        it('should do a request to firebase on submit to create the user', function() {
          // simulate user input
          var spy = spyOn(firebaseAuth(), '$createUserWithEmailAndPassword');
          createController();
          scope.user = testRunnerUser;
          //scope.submitHandler(form);
          firebaseAuth().$createUserWithEmailAndPassword('a', 'b');
          expect(spy).toHaveBeenCalled();
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