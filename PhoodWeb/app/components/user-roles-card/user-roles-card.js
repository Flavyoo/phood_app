module.exports = function(app) {
    app.component('userRolesCard', {
        bindings: {
            userRoles: '<',
            selectedOrganization: '<',
            locations: '<',
        },

        templateUrl: 'app/components/user-roles-card/user-roles-card.html',

        controller: function($scope, $rootScope) {
            this.$onChanges = () => {
                $scope.userRoles = this.userRoles;
                $scope.selectedOrganization = this.selectedOrganization;
                $scope.locations = this.locations;
            };

            $scope.toggleAddRoleCard = () => {
                $scope.showAddRoleCard = !$scope.showAddRoleCard;
            };

            $scope.createRole = async function(role) {
                let roleToAdd = undefined;
                if (role) {
                    const isLocation = (role.type === "ViewLocation" || role.type === "ManageLocation") && role.selectLocation;
                    const isOrganization = (role.type === "ViewOrganization" || role.type === "ManageOrganization") && role.selectOrganization;

                    roleToAdd = {
                        userId: $scope.user.id,
                        roleName: role.type,
                        entityType: isLocation ? 'Location' : 'Organization',
                        entityId: isLocation ? role.selectLocation.id : role.selectOrganization.id,
                    };
                }

                if (roleToAdd) {
                    const result = await RoleService.addRole(roleToAdd);
                    if (result.success) {
                        const addedRole = result.data;
                        if (addedRole.entityType === 'Location') {
                            const loc = $scope.parentLocations.find(l => l.id === addedRole.locationEntityId);
                            addedRole.entityDetails = `Location: ${loc.name}`;
                        } else if (addedRole.entityType === 'Organization') {
                            addedRole.entityDetails = `Organization: ${$scope.parentOrganization.name}`;
                        } else {
                            addedRole.entityDetails = "N/A"
                        }

                        $scope.roles.push(addedRole);
                        $scope.newRole = {};
                        updateScope();
                    } else {
                        AlertService.alertError("Error adding role to user.")
                    }
                }

                $rootScope.$broadcast('user-role-add');
            };

            $scope.deleteUserRole = function(userRole) {
                $rootScope.$broadcast('user-role-delete', {
                    userRole,
                });
            };
        },
    });
}