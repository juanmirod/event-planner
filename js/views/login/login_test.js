describe('planner.login module', function() {
'use strict';

  beforeEach(module('planner.login'));

  var $controller, $rootScope, $scope, $httpBackend;

  beforeEach(inject(function($injector){
  
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');

    $controller('LoginCtrl', {'$scope': $scope});
  
  }));

  afterEach(function() {
  
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
  
  });

  describe('login controller', function(){

    it('should contain a model for username', function() {
    
      expect($scope.username).toBeDefined();
    
    });

    it('should contain a model for password', function() {
    
      expect($scope.password).toBeDefined();
    
    });

    it('should check that username and password exists on submit', function() {
    
      $scope.username = '';
      $scope.password = '';
      $scope.submitHandler();
      expect($scope.error).toBeDefined();
    
    });

    it('should do a http request on submit to check the user', function() {
    
      $httpBackend.expectPOST('/auth', {username: 'a', password: 'b'}).respond(200, {id: 1});
    
      $scope.username = 'a';
      $scope.password = 'b';
      $scope.submitHandler();
      $httpBackend.flush();
    
      expect($scope.id).toBe(1);
    
    });

    it('should return an error message on auth failed', function() {
      
      var error = 'User not found';

      $httpBackend.expectPOST('/auth', {username: 'a', password: 'b'}).respond(404, error);
      $scope.username = 'a';
      $scope.password = 'b';
      $scope.submitHandler();
      $httpBackend.flush();
      
      expect($scope.error).toBe($scope.authError + error);
    
    });

  });

});