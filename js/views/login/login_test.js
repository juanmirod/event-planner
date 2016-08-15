describe('planner.login module', function() {
'use strict';

  beforeEach(module('planner.login'));

  var $controller, $rootScope, $scope, $httpBackend, $auth;

  beforeEach(inject(function($injector){
  
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');
    var $q = $injector.get('$q');

    $auth = function(){
      return {
        $signInWithEmailAndPassword: function(email, password) {
          return $q.when({uid: 1});
        }
      }
    };

    $controller('LoginCtrl', {'$scope': $scope, '$firebaseAuth': $auth});
  
    jasmine.clock().install();
  }));

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  describe('login controller', function(){

    it('should contain a model for username', function() {
    
      expect($scope.email).toBeDefined();
    
    });

    it('should contain a model for password', function() {
    
      expect($scope.password).toBeDefined();
    
    });

    it('should check that email and password exists on submit', function() {
    
      $scope.email = '';
      $scope.password = '';
      $scope.submitHandler();
      expect($scope.error).toBeDefined();
      
    });

    /*it('should do a http request on submit to check the user', function() {
        
      var spysignin = jasmine.createSpy('$firebaseAuth().$signInWithEmailAndPassword');
      $scope.email = 'a';
      $scope.password = 'b';
      $scope.submitHandler();
      setTimeout(function () {
        expect(spysignin).toHaveBeenCalled();
      }, 1000);

      jasmine.clock().tick(1001);
    
    });*/

    /*it('should return an error message on auth failed', function() {
      
      var error = 'User not found';

      $scope.email = 'a';
      $scope.password = 'b';
      $scope.submitHandler();
      setTimeout(function () {
        expect($scope.error).toBe($scope.authError + error);
      }, 0);
      
    });*/

  });

});