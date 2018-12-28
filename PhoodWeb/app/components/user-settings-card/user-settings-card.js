module.exports = function(app) {
    app.component('userSettingsCard', {
        bindings: {
            lossReasonList: '<',
            currentUserSettings: '<',
        },

        templateUrl: 'app/components/user-settings-card/user-settings-card.html',

        controller: function($scope, $rootScope) {
            $scope.userSettings = {};
            $scope.actionList = [
                { id: 0, name: 'Composted' },
                { id: 1, name: 'Discarded' },
                { id: 2, name: 'Donation' },
                { id: 3, name: 'Repurposed' },
            ];

            this.$onChanges = () => {
                $scope.lossReasonList = this.lossReasonList;
                $scope.userSettings = this.currentUserSettings;
            };

            $scope.fireUpdateSettingsEvent = () => {
                // Resolve nulls before sending it up, to be True, False, or empty string
                // TODO: Refactor this hard-coded junk

                $rootScope.$broadcast('user-settings-update', {
                    userSettings: $scope.userSettings,
                });
  
                $scope.userSettings = {};
            };

            $scope.cancelUpdateSettings = () => {
                $scope.userSettings = {};

                $rootScope.$broadcast('user-settings-update-cancel', {
                    isAddUserActive: false,
                });
            };
        },
    });
};