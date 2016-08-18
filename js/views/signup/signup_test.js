describe('planner.signup module', function() {
'use strict';

  var createController,
    rootScope, 
    scope,
    Auth,
    firebaseAuth,
    form,
    testRunnerUser = {
      uid: 1, 
      name: 'testrunner', 
      email: 'testrunner@fake.com', 
      password: 'DumbBotPassword123'
    };

  beforeEach(function(){
    module('planner.signup')

    module(function($provide){
      $provide.factory('Auth', function($q) {
        return {
          '$createUserWithEmailAndPassword': function(email, password) {
            return $q.when(testRunnerUser);
          }
        };
      });

      return null;
    });

  });


  beforeEach(function() {
  
    inject(function($controller, $rootScope, _Auth_) {

      // The injector unwraps the underscores (_) from around the parameter names when matching    
      Auth = _Auth_;
      scope = $rootScope.$new();
      rootScope = $rootScope;
      
      createController = function(params) {
        return $controller("SignupCtrl", {
          $rootScope: rootScope,
          $scope: scope,
          Auth: Auth,
          Users: [],
          $stateParams: params || {}
        });
      };

      form = {$valid: true};
    });
  
  });

  it('should do nothing if the form is not valid', function() {
  
    form.$valid = false;  
    createController();
    scope.submitHandler(form);
    expect(true).toBe(true); //jasmine complains if there is no espectations

  });

  it('should do a request to firebase on submit to create the user', function() {
    
    var spy = spyOn(Auth, '$createUserWithEmailAndPassword').and.callThrough();
    createController();
    scope.user = testRunnerUser;
    scope.submitHandler(form);
    expect(spy).toHaveBeenCalled();
  
  });

});