module.exports = function(app) {
    app.component('configLossReason', {
        bindings: {
            lossReasons: '<',
            selectedOrganization: '<',
        },

        templateUrl: 'app/components/config-loss-reason/config-loss-reason.html',

        controller: function($scope, $rootScope, $mdDialog, LossReasonService, AlertService) {
            $scope.lossReasons = [];

            this.$onChanges = () => {
                $scope.lossReasons = this.lossReasons;
                $scope.selectedOrganization = this.selectedOrganization;
            };

            $scope.addLossReason = (newLossReason) => {
                $rootScope.$broadcast('loss-reason-add', {
                    newLossReason,
                });
            };

            $scope.deleteLossReason = (lossReason) => {
                $rootScope.$broadcast('loss-reason-delete', {
                    lossReason,
                });
            };

            $scope.newLossReason = (lossReason) => {
                return {
                    name: lossReason,
                    organizationId: $scope.selectedOrganization.id,
                };
            };
        }
    });
};