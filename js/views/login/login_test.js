describe('planner.login module', function() {
'use strict';

  var $controller, $rootScope, $scope, $location, Auth;

  beforeEach(function(){
    module('planner.login');

    module(function($provide){

      $provide.factory('Auth', function($q){
        return {
          $signInWithEmailAndPassword: function(email, pass) {
            return $q.reject({error: 'ERROR'});
          }
        };
      });

      return null;
    });

  });

  beforeEach(function(){
  
    inject(function($controller, $rootScope, $location, _Auth_) {
      $scope = $rootScope.$new();
      Auth = _Auth_;
      
      $controller("LoginCtrl", {
        $scope: $scope,
        Auth: Auth,
        $stateParams: {}
      });
    });

  });

  it('should do a request for the user on submit', function() {
  
    var spy = spyOn(Auth, '$signInWithEmailAndPassword').and.callThrough();
    var form = {$valid: true};
    $scope.submitHandler(form);
    expect(spy).toHaveBeenCalled();
    
  });

});