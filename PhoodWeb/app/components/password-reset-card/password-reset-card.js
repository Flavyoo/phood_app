module.exports = function(app) {
  app.component('passwordResetCard', {
      bindings: {
          isAdmin: '<',
      },

      templateUrl: 'app/components/password-reset-card/password-reset-card.html',

      controller: function($scope, $rootScope, UserService, AlertService) {

        this.$onChanges = () => {
            $scope.isAdmin = this.isAdmin;
        };

        $scope.resetPassword = async function(newPassword) {
            const action = $scope.isAdmin ? 'admin-password-reset' : 'password-reset';

            $rootScope.$broadcast(action, {
                newPassword,
            });
        };

        $scope.doPasswordsNotMatch = (newPassword, confirmPassword) => {
            return newPassword !== confirmPassword;
        };
      },
  });
}