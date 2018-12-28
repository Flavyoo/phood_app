module.exports = function(app) {
    app.component('organizationList', {
        bindings: {
            organizations: '<',
            users: '<',
        },
        templateUrl: 'app/components/organization-list/organization-list.html',
        controller: function($scope, OrganizationService) {
            $scope.loadingState = 'Ready';

            this.$onChanges = () => {
                $scope.users = this.users;
                $scope.organizations = addOwnerNames(this.organizations);
            };

            $scope.editOrganization = async (org) => {
                if (org.alias.length === 0) {
                    org.alias = undefined;
                }
                const result = await OrganizationService.updateOrganization(org);

                // handle result
            };

            $scope.setActiveStatus = async (org) => {
                const result = await OrganizationService.setActiveStatus({
                    organizationId: org.id,
                    active: org.active,
                });

                // handle result
            };

            function addOwnerNames(organizations) {
                if (Array.isArray(organizations)) {
                    return organizations.map((org) => {
                        const user = $scope.users.find(u => u.id === org.ownerId);

                        if (user) {
                            org.ownerName = user.name;
                        }

                        return org;
                    });
                };

                return [];
            }

            function updateScope() {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    });
};