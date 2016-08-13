describe('planner.login module', function() {
'use strict';

  beforeEach(module('planner.login'));

  var $controller, $rootScope, $scope;

  beforeEach(inject(function(_$rootScope_, _$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;

    $controller('LoginCtrl', {'$scope': $scope});
  }));

  describe('login controller', function(){

    it('should contain a model for username', function() {
      expect($scope.username).toBeDefined();
    });

    it('should contain a model for password', function() {
      expect($scope.password).toBeDefined();
    });

  });

});