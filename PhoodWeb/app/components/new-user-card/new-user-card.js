module.exports = function(app) {
    app.component('newUserCard', {
        bindings: {
            accountList: '<',
            isPrimary: '<',
        },

        templateUrl: 'app/components/new-user-card/new-user-card.html',

        controller: function($scope, $rootScope) {
            const emptyNewUser = {
                name: '',
                contactName: '',
                password: '',
                confirmPassword: '',
                email: '',
                active: false,
            };

            $scope.newUser = emptyNewUser;

            this.$onChanges = () => {
                $scope.accountList = this.accountList;
                $scope.isPrimary = this.isPrimary;
            };

            $scope.fireUserAddEvent = () => {
                let action = 'primary-account-add';
                delete $scope.newUser.confirmPassword;

                if (!$scope.isPrimary) {
                    // Only need a parentId if we're on a subaccount
                    const accountWithParent = $scope.accountList.find(x => x.parentId);
                    const accountWithId = $scope.accountList.find(x => x.id);

                    $scope.newUser.parentId = accountWithParent ? accountWithParent.parentId : accountWithId.id;
                    action = 'sub-account-add';
                }

                $rootScope.$broadcast(action, {
                    newUser: $scope.newUser,
                });

                $scope.newUser = emptyNewUser;
            };

            $scope.cancelAddUser = () => {
                $scope.newUser = emptyNewUser;

                $rootScope.$broadcast('user-add-cancel', {
                    isAddUserActive: false,
                });
            };
        },
    });
};