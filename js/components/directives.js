(function(angular){
'use strict';

  // Template directive used to encapsulate progressbars behaviour
  angular.module('planner.directives', ['ngMap'])

  .constant('GeolocationKey', 'AIzaSyA9i-zj4Bpd8cox_jkeiLiJtY5nGWxJZZ0')

  .directive('formProgressbar', [function(){
    return {
      restrict: 'E',
      scope: {
        width: '=',
        field: '='
      },
      templateUrl: 'public/js/components/progressbar.html'
    };
  }])

  // Makes autofocus works on route changes without reloading
  .directive('autofocus', [function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element[0].focus();
        }
    };
  }])

  .directive('locationinput', ['$http', 'GeolocationKey', 'NgMap',  
    function($http, GeolocationKey, NgMap){
      return {
        restrict: 'E',
        templateUrl: 'public/js/components/locationinput.html',
        controller: ['$scope', function($scope) {

          $scope.triedLocation = false;
          NgMap.getMap().then(function(map) {
            $scope.map = map;
          });
      
          /*
          Get the user current location through the browser service
           */
          $scope.getLocation = function askForLocation() {
            
            if(navigator.geolocation && !$scope.triedLocation) {
              
              $scope.triedLocation = true;
              // get the location from browser
              navigator.geolocation.getCurrentPosition(
                function(location){
                  coordinatesToLocation(location.coords.latitude, location.coords.longitude);
                },
                function(error){
                  $scope.event.location = "Sorry, but we couldn't get your location: " + error.message;
                  $scope.$apply();
                });
            
            }

          };

          /*
            Center the map on the entered location, called when location is changed
          */
          $scope.locationChangedHandler = function() {
            
            // The user moved the marker
            if(this.position) {
              var coordinateRegex = /-?\d+\.\d+/g;
              var positionArray = this.position.toString().match(coordinateRegex);
              coordinatesToLocation(positionArray[0], positionArray[1]);
            
            } else { // The user typed an address
            
              $scope.place = this.getPlace();
              $scope.map.setCenter($scope.place.geometry.location);
            
            }

          };

          function coordinatesToLocation(lat, lng) {

            $http.get('https://maps.googleapis.com/maps/api/geocode/json',{
              params: {
                latlng: [lat,lng].join(','),
                key: GeolocationKey
              }
            })
            .then(function(response){

              // Take the first result, that it is always the most accurate
              if(typeof response.data.results[0] != 'undefined') {
                $scope.event.location = response.data.results[0].formatted_address;  
                $scope.located = true;
                $scope.map.setCenter({lat: parseFloat(lat), lng: parseFloat(lng)});
              }
            
            })
            .catch(function(error){
              $scope.event.location = 'There was an error checking this location: ' + error.statusText;
            });
            
          }
        }]
    };
  }]);

})(window.angular);