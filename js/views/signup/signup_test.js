describe('planner.signup module', function() {
'use strict';

  beforeEach(module('planner.signup'));

  var $controller, $rootScope, $scope, $httpBackend;

  beforeEach(inject(function($injector){
  
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');

    $controller('SignupCtrl', {'$scope': $scope});
  
  }));

  afterEach(function() {
  
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
  
  });

  describe('signup controller', function(){

    it('should contain a model for name', function() {
    
      expect($scope.email).toBeDefined();
    
    });

    it('should contain a model for email', function() {
    
      expect($scope.email).toBeDefined();
    
    });

    it('should contain a model for password', function() {
    
      expect($scope.password).toBeDefined();
    
    });

    it('should validate the form data on submit', function() {
    
      $scope.submitHandler();
      expect($scope.error).toBeDefined();
    
    });

    it('should do a http request on submit to create the user', function() {
    
      $httpBackend
        .expectPOST('/signup', {name: 'a', email: 'a', password: 'b'})
        .respond(200, {id: 1});
    
      $scope.name = 'a';
      $scope.email = 'a';
      $scope.password = 'b';
      $scope.submitHandler();
      $httpBackend.flush();
    
      expect($scope.id).toBe(1);
    
    });

    it('should return an error message when signup failed', function() {
      
      var error = 'Server error';

      $httpBackend
        .expectPOST('/signup', {name: 'a', email: 'a', password: 'b'})
        .respond(500, error);

      $scope.name = 'a';
      $scope.email = 'a';
      $scope.password = 'b';
      $scope.submitHandler();
      $httpBackend.flush();
      
      expect($scope.error).toBe($scope.authError + error);
    
    });

  });

});