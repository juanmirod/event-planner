describe('planner.event module', function() {
'use strict';

  beforeEach(module('planner.event'));

  var $controller, 
    $rootScope, 
    $scope, 
    $route, 
    currentAuth, 
    form,
    event = {
      _start_date_form: 'date',
      _end_date_form: 'date'
    };
  
  beforeEach(inject(function($injector){
  
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    var ngMap = $injector.get('NgMap');
    $route = {
      current: {
        params: {
          ref: undefined
        }
      }
    };

    currentAuth = {uid: 1};
      
    $controller('CreateCtrl', {'$scope': $scope, 'currentAuth': currentAuth, '$route': $route, 'NgMap': ngMap});
    form = {$valid: true};
    $scope.event = event;

  }));
  
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
