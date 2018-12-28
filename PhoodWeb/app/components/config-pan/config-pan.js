module.exports = function(app) {
    app.component('configPan', {
        bindings: {
            selectedOrganization: '<',
        },
        templateUrl: 'app/components/config-pan/config-pan.html',
        controller: function($scope, PanService, AlertService) {
            $scope.panList = [];
            $scope.loadingState = 'Ready';

            this.$onChanges = () => {
                $scope.selectedOrganization = this.selectedOrganization;
                $scope.getPansForOrganization($scope.selectedOrganization);
            };

            $scope.$on('pan-add', addPan);
            $scope.$on('pan-add-cancel', cancelAddPan);

            $scope.getPansForOrganization = async function(selectedOrganization) {
                if (selectedOrganization && selectedOrganization.id) {
                    const result = await PanService.getByOrganization(selectedOrganization.id);
                    if (result.success) {
                        $scope.panList = (result.data) ? result.data : [];
                    }

                    updateScope();
                }
            };

            $scope.showAddPanCard = () => {
                $scope.isAddPanCardEnabled = !$scope.isAddPanCardEnabled;
            };

            async function addPan(event, data) {
                if (data.panToAdd) {
                    const result = await PanService.addPan(data.panToAdd);
                
                    if (result.success) {
                        $scope.panList.push(result.data);
                        updateScope();

                        AlertService.alertSuccess('Pan added successfully')
                    } else {
                        AlertService.alertErrorWithJson('Error adding pan', result);
                    }
                }
            };

            function cancelAddPan() {
                $scope.isAddPanCardEnabled = false;
            }

            $scope.editPan = async function(pan) {
                const result = await PanService.editPan(pan);

                // handle results
            };

            $scope.deletePan = async function(pan) {
                const result = await PanService.deletePan(pan.id);

                if (result.success) {
                    const index = $scope.panList.indexOf(pan);
                    $scope.panList.splice(index, 1);
                    if ($scope.panList.length === 0 && $scope.loadingState === 'Ready') {
                        $scope.loadingState = 'NoData';
                    }
                    updateScope();
                }
            };

            function updateScope() {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    });
};