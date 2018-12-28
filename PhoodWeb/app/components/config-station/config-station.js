module.exports = function(app) {
    app.component('configStation', {
        bindings: {
            selectedLocation: '<',
            stations: '<',
        },
        templateUrl: 'app/components/config-station/config-station.html',
        controller: function($scope, $rootScope) {
            $scope.selectedLocation = {};
            $scope.stations = [];

            this.$onChanges = () => {
                $scope.selectedLocation = this.selectedLocation;
                $scope.stations = this.stations;
            };

            $scope.addStation = (stationToAdd) => {
                $rootScope.$broadcast('station-add', {
                    stationToAdd,
                });
            };

            $scope.deleteStation = (id) => {
                $rootScope.$broadcast('station-delete', {
                    id,
                });
            };

            $scope.newStation = (stationName) => {
                return {
                    name: stationName,
                    locationId: $scope.selectedLocation.id,
                };
            };

            function updateScope() {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    });
};