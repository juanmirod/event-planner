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
    $route = {
      current: {
        params: {
          ref: undefined
        }
      }
    };

    currentAuth = {uid: 1};
      
    $controller('CreateCtrl', {'$scope': $scope, 'currentAuth': currentAuth, '$route': $route});
    form = {$valid: true};
    $scope.event = event;

  }));
  
  it('should check that the form is valid on submit', function() {
    
    form.$valid = false;
    $scope.submitHandler(form);
    expect($scope.errorMessage).toBeDefined();
    
  });

  it('should show an error when the start date is in the past', function() {
     
    $scope.event._start_date_form = (new Date(Date.now()-1000)).toISOString();
    $scope.checkDates();
    expect($scope.startdateError).toBe(true);

  });


  it('should show an error when the end date is less than 5 minutes after the start date', function(){

    $scope.event._start_date_form = (new Date(Date.now() + 1000)).toISOString();
    $scope.event._end_date_form = (new Date(Date.now() + 2000)).toISOString();
    $scope.checkDates();
    expect($scope.enddateError).toBe(true);

  });

  it('should consider valid the dates if the start date is in the future and the end date is at least 5 minutes after the start date', function(){

    $scope.event._start_date_form = (new Date(Date.now() + 1000)).toISOString();
    $scope.event._end_date_form = (new Date(Date.now() + 1000*60*5 + 1000)).toISOString();
    $scope.checkDates();
    expect($scope.startdateError).toBe(false);
    expect($scope.enddateError).toBe(false);

  })

  it('should add created_at value to the event on submit', function(){
  
    $scope.submitHandler(form);
    expect($scope.event.created_at).toBeDefined();
  
  });

  it('should add the current user uid to the event object on submit', function(){
  
    $scope.submitHandler(form);
    expect($scope.event.created_by).toBeDefined();
  
  });


});
