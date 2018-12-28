module.exports = function(app) {
  app.component('newLocationCard', {
      bindings: {
        organizationId: '<',
      },

      templateUrl: 'app/components/new-location-card/new-location-card.html',

      controller: function($scope, $rootScope) {
        const emptyLocationObject = {
            name: '',
            alias: '',
            active: false,
            timezoneOffset: 0,
            organizationId: '',
        };

        $scope.newLocation = emptyLocationObject;

        this.$onChanges = () => {
          emptyLocationObject.organizationId = this.organizationId;
          $scope.newLocation.organizationId = this.organizationId;
        };

        $scope.addLocation = function() {
          $rootScope.$broadcast('location-add', {
            locToAdd: $scope.newLocation,
          });

          $scope.newLocation = emptyLocationObject;
        };

        $scope.cancelAddLocation = () => {
          $rootScope.$broadcast('location-add-cancel');
          $scope.newLocation = emptyLocationObject;
        };
      }
  });
};