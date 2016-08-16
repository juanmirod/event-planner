describe('planner.event module', function() {
'use strict';

  beforeEach(module('planner.event'));

  var $controller, $rootScope, $scope, form;
  
  beforeEach(inject(function($injector){
  
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
      
    $controller('CreateCtrl', {'$scope': $scope});
    form = {$valid: true};

  }));

  describe('CreateEvent controller', function(){

    it('should check that the form is valid on submit', function() {
    
      form.$valid = false;
      $scope.submitHandler(form);
      expect($scope.errorMessage).toBeDefined();
      
    });

    it('should check that the dates are correctly formatted', function(){

    });

    it('should add created_at value to the event on submit', function(){
    
      $scope.submitHandler(form);
      expect($scope.event.created_at).toBeDefined();
    
    });

    it('should add the current user uid to the event object on submit', function(){
    
      $scope.submitHandler(form);
      expect($scope.event.created_by).toBeDefined();
    
    });

  });

});
