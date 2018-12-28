module.exports = function(app) {
    app.component('configLocation', {
        bindings: {
            selectedOrganization: '<',
            locations: '<',
        },
        templateUrl: 'app/components/config-location/config-location.html',
        controller: function($scope, LocationService) {
            $scope.locations = [];
            $scope.loadingState = 'Ready';

            $scope.$on('location-add', closeNewLocationCard);
            $scope.$on('location-add-cancel', closeNewLocationCard);

            this.$onChanges = () => {
                $scope.selectedOrganization = this.selectedOrganization;
                $scope.locations = this.locations;
            };

            $scope.toggleNewLocationCard = () => {
                $scope.showNewLocationCard = !$scope.showNewLocationCard;
            };

            $scope.editLocation = async function(loc) {
                if (loc.alias.length === 0) {
                    loc.alias = undefined
                }
                const result = await LocationService.updateLocationInfo(loc);

                // handle results
            };

            $scope.setActiveStatus = async function(loc) {
                const result = await LocationService.setActiveStatus({
                    locationId: loc.id,
                    active: loc.active
                })

                // handle results
            };

            function closeNewLocationCard() {
                $scope.showNewLocationCard = false;
            }
        }
    });
};