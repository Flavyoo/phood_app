module.exports = function(app) {
  app.component('newOrganizationCard', {
      bindings: {
          users: '<',
      },

      templateUrl: 'app/components/new-organization-card/new-organization-card.html',

      controller: function($scope, $rootScope) {
          const emptyOrganization = {
              name: '',
              alias: '',
              active: false,
          };

          $scope.newOrganization = emptyOrganization;

          this.$onChanges = () => {
              $scope.users = this.users;
          };

          $scope.fireOrganizationAddEvent = () => {
              $rootScope.$broadcast('organization-add', {
                  newOrganization: $scope.newOrganization,
              });

              $scope.newOrganization = emptyOrganization;
          };

          $scope.filterByPrimaryAccounts = (account) => {
            // Primary accounts do not have a parentId
            return !account.parentId;
          };

          $scope.cancelAddOrganization = () => {
              $scope.newOrganization = emptyOrganization;

              $rootScope.$broadcast('organization-add-cancel', {
                  isAddOrganizationActive: false,
              });
          };
      },
  });
};