module.exports = function(app) {
    app.component('manageOrganization', {
        bindings: {
            organizations: '<',
            users: '<',
            isAdmin: '<',
        },
        templateUrl: 'app/components/manage-organization/manage-organization.html',
        controller: function($scope, LocationService, UserService, AlertService, LossReasonService, StationService) {
            this.$onChanges = () => {
                $scope.organizations = this.organizations;
                $scope.users = this.users;
                $scope.isAdmin = this.isAdmin;

                if (Array.isArray($scope.organizations)) {
                    [$scope.selectedOrganization] = $scope.organizations;
                    $scope.getLocationsByOrganization($scope.selectedOrganization);
                    $scope.getUsersByOrganization($scope.selectedOrganization);
                    $scope.getLossReasonsForOrganization($scope.selectedOrganization);
                }
            };

            $scope.$on('loss-reason-add', addLossReason);
            $scope.$on('loss-reason-delete', deleteLossReason);
            $scope.$on('station-add', addStation);
            $scope.$on('station-delete', deleteStation);
            $scope.$on('location-add', addLocation);

            $scope.onOrganizationChange = (newOrganization) => {
                $scope.getLocationsByOrganization(newOrganization);
                $scope.getUsersByOrganization(newOrganization);
                $scope.getLossReasonsForOrganization(newOrganization);
            };

            $scope.getLossReasonsForOrganization = async function(selectedOrganization) {
                if (selectedOrganization && selectedOrganization.id) {
                    const result = await LossReasonService.getLossReasons(selectedOrganization.id);
                    if (result.success) {
                        $scope.lossReasons = result.data;
                    }
                }
            };

            $scope.getLocationsByOrganization = async (selectedOrganization) => {
                if (selectedOrganization && selectedOrganization.id) {
                    const result = await LocationService.getLocationsByOrganizationId(selectedOrganization.id);
                    
                    if (result.success && result.data) {
                        $scope.locations = result.data;
                        [$scope.selectedLocation] = $scope.locations;
                    } else if(result.success) {
                        $scope.locations = [];
                        $scope.selectedLocation = {};
                    } else {
                        AlertService.alertErrorWithJson('Error retrieving location list', result);
                        $scope.selectedLocation = {};
                    }

                    $scope.getStationsByLocation($scope.selectedLocation);
                }
            };

            $scope.getStationsByLocation = async (selectedLocation) => {
                if (selectedLocation && selectedLocation.id) {
                    const result = await StationService.getStations(selectedLocation.id);
                    if (result.success) {
                        $scope.stations = (Array.isArray(result.data)) ? result.data : [];
                    } else {
                        AlertService.alertError('Error retrieving stations');
                    }
                }
            };

            $scope.getUsersByOrganization = async (selectedOrganization) => {
                if (selectedOrganization && selectedOrganization.ownerId) {
                    const subAccountFetchResult = await UserService.getSubAccountList(selectedOrganization.ownerId);
                    const primaryUser = $scope.users.find(x => x.id === selectedOrganization.ownerId);
                    let allUsers = [primaryUser];
                    
                    if (subAccountFetchResult.success) {
                        allUsers = subAccountFetchResult.data ? allUsers.concat(subAccountFetchResult.data) : allUsers;
                    } else {
                        AlertService.alertErrorWithJson('Error retrieving subaccount users', subAccountFetchResult);
                    }

                    $scope.organizationUsers = allUsers;
                }
            };

            async function addLocation(event, data) {
                const result = await LocationService.addLocation(data.locToAdd);

                if (result.success) {
                    $scope.locations.push(result.data);
                    AlertService.alertSuccess('Location added successfully');
                } else {
                    AlertService.alertErrorWithJson('Error adding location', result);
                }
            }

            async function addStation(event, data) {
                if (data.stationToAdd && data.stationToAdd.name) {
                    const result = await StationService.addStation(data.stationToAdd);
                    if (result.success) {
                        // Replace the station so that it has the ID
                        $scope.stations[$scope.stations.length-1] = result.data;
                    } else {
                        AlertService.alertErrorWithJson('Error creating station', result);
                    }
                }
            };

            async function deleteStation(event, data) {
                if (data.id) {
                    const result = await StationService.deleteStation(data.id);
                    if (!result.success) {
                        AlertService.alertErrorWithJson('Error deleting station', result);
                    }
                } else {
                    AlertService.alertError('Error deleting station');
                }
            }

            async function deleteLossReason(event, data) {
                const lossReasonObject = data.lossReason;

                if (lossReasonObject && lossReasonObject.id) {
                    const result = await LossReasonService.deleteLossReason(lossReasonObject.id);
                    
                    if (!result.success) {
                        AlertService.alertError('Error deleting loss reason.');
                    }
                } else {
                    AlertService.alertError('Error deleting loss reason.');
                }
            }

            async function addLossReason(event, data) {
                const { newLossReason } = data;

                if (newLossReason && newLossReason.name) {
                    const result = await LossReasonService.addLossReason(newLossReason);
                    if (result.success) {
                        // Replace the loss reason so that it has the ID
                        $scope.lossReasons[$scope.lossReasons.length-1] = result.data;
                    } else {
                        AlertService.alertErrorWithJson('Error creating loss reason', result);
                    }
                }
            }
        }
    });
};