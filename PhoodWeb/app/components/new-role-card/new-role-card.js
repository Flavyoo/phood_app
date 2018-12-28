module.exports = function(app) {
  app.component('newRoleCard', {
      bindings: {
        locations: '<',
        selectedOrganization: '<',
      },

      templateUrl: 'app/components/new-role-card/new-role-card.html',

      controller: function($scope, $rootScope, RoleService, AlertService) {
          this.$onChanges = () => {
            $scope.locations = this.locations;
            $scope.selectedOrganization = this.selectedOrganization;
          };

          $scope.createRole = async function(role) {
              let roleToAdd = undefined;
              if (role && (role.selectLocation || role.selectOrganization)) {
                  const isLocation = (role.type === "ViewLocation" || role.type === "ManageLocation") && role.selectLocation;
                  const isOrganization = (role.type === "ViewOrganization" || role.type === "ManageOrganization") && role.selectOrganization;

                  roleToAdd = {
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

              $rootScope.$broadcast('user-role-add', {
                roleToAdd,
              });
          };

          $scope.isSelf = (role) => {
            return (role.roleName === 'ManageUser') && (role.entityDetails === 'Self');
          }

          $scope.cancelAddRole = () => {
            $rootScope.$broadcast('user-role-add-cancel');
        };
      },
  });
}