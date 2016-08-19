(function(){
'use strict';

  // Template directive used to encapsulate progressbars behaviour
  angular.module('planner.directives', [])

  .directive('formProgressbar', function(){
    return {
      restrict: 'E',
      scope: {
        width: '=',
        field: '='
      },
      templateUrl: 'js/components/progressbar.html'
    };
  })

  // Makes autofocus works on route changes without reloading
  .directive('autofocus', [function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element[0].focus();
        }
    };
  }]);

})();