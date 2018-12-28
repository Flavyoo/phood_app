module.exports = function(app) {
  app.component('changePassword', {
    bindings: {
    },

    templateUrl: 'app/components/change-password/change-password.html',

    controller: function($scope, AlertService, AuthService, UserService, UserSettingsService) {
      const user = AuthService.getUserAuth();
      $scope.confirmOldPassword = '';
      $scope.confirmNewPassword = '';
      $scope.newPassword = '';

      $scope.passwordsMatch = true;
      $scope.showShortageLogs = false;
      $scope.showProductionDetails = false;

      $scope.checkPasswordMatch = function() {
          $scope.passwordsMatch = $scope.newPassword === $scope.confirmNewPassword;
      };

      $scope.init = async function() {
          getUserSettings();
          $scope.isAdmin = false;
          if (user.roles.find(r => r.roleName === 'PrimaryAccount')) {
              $scope.users = await getSubAccountList(user.id);
              $scope.organizations = [user.organization]; // Handle multiple organizations in the future.
              $scope.locations = user.locations;
          } else if (user.roles.find(r => r.roleName === 'ManageOrganization')) {
              $scope.users = [];
              $scope.organizations = [user.organization];
              $scope.locations = user.locations;
          } else if (user.roles.find(r => r.roleName === 'ManageLocation')) {
              $scope.users = [];
              $scope.organizations = [];
              $scope.locations = [user.location];
          } else {
              $scope.users = [];
              $scope.organizations = [];
              $scope.locations = [];
          }
      };

      async function getSubAccountList(parentId) {
          const getUsersResult = await UserService.getSubAccountList(parentId);

          if (getUsersResult.success) {
              return (getUsersResult.data) ? getUsersResult.data : [];
          } else {
              AlertService.alertError('Error retrieving sub account list.');
              return [];
          }
      }

      async function getUserSettings() {
          const result = await UserSettingsService.getUserSettingsByUserId(user.id);
          if (result.success) {
              if (result.data) {
                  $scope.showShortageLogs = result.data.showShortageLogs;
                  $scope.showProductionDetails = result.data.showProductionDetails;
              }
          } else {
              AlertService.alertError('Error retrieving user settings.');
          }
      }

      $scope.changePassword = async function() {
          const userId = Number(user.id);
          const result = await UserService.changePassword(userId, $scope.confirmOldPassword, $scope.newPassword);

          if (!result.success) {
              AlertService.alertError('Error changing user password.');
          } else {
              AlertService.alertSuccess('Password changed successfully.');
          }
      };

      $scope.changeUserSettings = async function() {
          const settingsData = {
              userId: AuthService.user.id,
              showShortageLogs: !!$scope.showShortageLogs,
              showProductionDetails: !!$scope.showProductionDetails,
          };
          const result = await UserSettingsService.upsertUserSettings(settingsData);

          if (!result.success) {
              AlertService.alertError('Error updating user settings.');
          } else {
              AlertService.alertSuccess('User Settings updated successfully.');
          }
      };
    },
  });
};