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

    var form;

    beforeEach(function(){
      form = {$valid: true};
    });

    it('should do nothing if the form is not valid', function() {
    
      form.$valid = false;  
      $scope.submitHandler(form);

    });

    it('should do a http request on submit to create the user', function() {
    
      $scope.user = {name: 'a', email: 'a', password: 'b'};

      $httpBackend
        .expectPOST('/signup', $scope.user)
        .respond(200, {id: 1});
    
      $scope.submitHandler(form);
      $httpBackend.flush();
    
      expect($scope.id).toBe(1);
    
    });

    it('should return an error message when signup failed', function() {
      
      var error = 'Server error';
      $scope.user = {name: 'a', email: 'a', password: 'b'};

      $httpBackend
        .expectPOST('/signup', $scope.user)
        .respond(500, error);

      $scope.submitHandler(form);
      $httpBackend.flush();
      
      expect($scope.error).toBe($scope.authError + error);
    
    });

  });

});