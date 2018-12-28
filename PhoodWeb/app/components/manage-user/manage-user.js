module.exports = function(app) {
  app.component('manageUser', {
      bindings: {
        lossReasons: '<',
        organizationUsers: '<',
        selectedOrganization: '<',
        locations: '<',
        isAdmin: '<',
      },

      templateUrl: 'app/components/manage-user/manage-user.html',
      
      controller: function($scope, $mdDialog, AlertService, UserService, OrganizationService, LocationService, UserSettingsService, RoleService) {
        $scope.isAddUserActive = false;
        $scope.showUserSettingsCard = false;
        $scope.showUserRolesCard = false;
        $scope.showPasswordResetCard = false;

        this.$onChanges = () => {
          $scope.organizationUsers = this.organizationUsers;
          $scope.selectedOrganization = this.selectedOrganization;
          $scope.locations = this.locations;
          $scope.lossReasons = this.lossReasons;
          $scope.isAdmin = this.isAdmin;
        };

        $scope.$on('admin-password-reset', adminPasswordReset);
        $scope.$on('user-settings-update', updateUserSettings);
        $scope.$on('user-settings-update-cancel', () => {
            $scope.showUserSettingsCard = false;
        });

        $scope.$on('sub-account-add', addSubAccount);
        $scope.$on('user-add-cancel', () => {
          $scope.isAddUserActive = false;
        });

        $scope.$on('user-role-add', userRoleAdd);
        $scope.$on('user-role-delete', userRoleDelete);
        $scope.$on('user-role-add-cancel', userRoleAddCancel);

        $scope.getUserRoles = getUserRoles;

        $scope.editUser = async (user) => {
          const results = await UserService.updateUserInfo(user);

          if (!results.success) {
              AlertService.alertError("Error updating user's info.")
          }
        };

        $scope.setActive = async (user) => {
          const results = await UserService.setActiveStatus(user.id, user.active);

          if (!results.success) {
              AlertService.alertError("Error changing user's active status.")
          }
        };

        $scope.toggleUserSettingsCard = async (user) => {
            // TODO: Have API return the settings so we don't have to go fetch them
            if (!$scope.showUserSettingsCard) {
                // We just toggled the card to show it, fetch the settings
                const result = await UserSettingsService.getUserSettingsByUserId(user.id);

                if (result.success) {
                    $scope.currentUserSettings = result.data;
                } else {
                    $scope.currentUserSettings = {};
                    AlertService.alertErrorWithJson('Error fetching user settings', result);
                }
            }

            $scope.showUserSettingsCard = !$scope.showUserSettingsCard;
            $scope.showUserRolesCard = false;
            $scope.showPasswordResetCard = false;

            $scope.selectedUser = ($scope.showUserSettingsCard) ? user : null;
            updateScope();
        };

        $scope.toggleUserRolesCard = async (user) => {
            if(!$scope.showUserRolesCard) {
                // We just toggled the card to show the roles, fetch the roles
                getUserRoles(user);
            }

            $scope.showUserRolesCard = !$scope.showUserRolesCard;
            $scope.showUserSettingsCard = false;
            $scope.showPasswordResetCard = false;

            $scope.selectedUser = ($scope.showUserRolesCard) ? user : null;
        };

        $scope.togglePasswordResetCard = (user) => {
          $scope.showPasswordResetCard = !$scope.showPasswordResetCard;
          $scope.showUserRolesCard = false;
          $scope.showUserSettingsCard = false;

          $scope.selectedUser = ($scope.showPasswordResetCard) ? user : null;
        };

        $scope.toggleAddUserCard = () => {
          $scope.isAddUserActive = !$scope.isAddUserActive;
        }

      async function getUserRoles(user) {
        // TODO: Refactor this, this may not be needed, this is not called yet
        const result = await RoleService.getUserRolesByUserId(user.id);
        if (result.success && result.data) {
            $scope.userRoles = await Promise.all(result.data.map(async (role) => {
                if (role.entityType === 'User') {
                    role.entityDetails = (role.userEntityId === user.id) ? 'Self' : `Other User (Id: ${role.userEntityId})`;
                } else if (role.entityType === 'Location') {
                    const loc = (await LocationService.getLocationById(role.locationEntityId)).data;
                    role.entityDetails = `Location: ${loc.name}`;
                } else if (role.entityType === 'Organization') {
                    const org = (await OrganizationService.getOrganizationById(role.organizationEntityId)).data;
                    role.entityDetails = `Organization: ${org.name}`;
                } else {
                    role.entityDetails = "N/A"
                }

                return role;
            }));
        } else {
            $scope.userRoles = [];
        }

        updateScope();
      }

      async function userRoleAdd(event, data) {

        if (data && data.roleToAdd && $scope.selectedUser && $scope.selectedUser.id) {
            data.roleToAdd.userId = $scope.selectedUser.id;
            const result = await RoleService.addRole(data.roleToAdd);

            if (result.success) {
                AlertService.alertSuccess('Role added successfully');
                $scope.userRoles.push(data.roleToAdd);
                $scope.showUserRolesCard = false;
            } else {
                AlertService.alertErrorWithJson('Error adding role', result);
            }
        }

        updateScope();
      }

      async function userRoleDelete(event, data) {
        const result = await RoleService.deleteRole(data.userRole);

        if (result) {
            const index = $scope.userRoles.indexOf(data.userRole);
            $scope.userRoles.splice(index, 1);
            AlertService.alertSuccess('Role removed successfully');
        } else {
            AlertService.alertErrorWithJson('Error deleting role', result);
        }

        updateScope();
      }

      function userRoleAddCancel() {
        $scope.showUserRolesCard = false;
      }

      async function adminPasswordReset(event, data) {
        const result = await UserService.adminResetPassword($scope.selectedUser.id, data.newPassword);
        
        if (result.success) {
            AlertService.alertSuccess('Changed user password successfully');
            $scope.showPasswordResetCard = false;
        } else {
            AlertService.alert('Error changing user password', 'Failed to change user password - make sure the new password is 10 characters or more.');
        }
      }

      async function updateUserSettings(event, data) { 
        const result = await UserSettingsService.upsertUserSettings(data.userSettings);

        if (result.success) {
            AlertService.alertSuccess('User settings updated successfully');
            $scope.showUserSettingsCard = false;
        } else {
            AlertService.alertErrorWithJson('Error updating user settings', result);
        }
      }

      async function addSubAccount(event, data) {
        const result = await UserService.createSubAccount(data.newUser);
          
        if (result.success) {
            const addedUser = result.data;
            $scope.organizationUsers.push(addedUser);
            AlertService.alert('Account created successfully!', 'Now, select "Manage Roles" to give this new account access to View or Manage a location, and View or Manage an Organization. You can also edit their user settings to modify their default options, such as whether their Action defaults to Composted or Discarded.');
            $scope.isAddUserActive = false;
        } else {
            AlertService.alertError("Error creating new user")
        }

        updateScope();
      }

      $scope.isSelectedUser = (user) => {
        return !$scope.selectedUser || ($scope.selectedUser && (user.id === $scope.selectedUser.id));
      };

        function updateScope() {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }
      }
  });
};