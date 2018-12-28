module.exports = (app) => {
    app.controller('kitchenCtrl', function($scope) {
        $scope.kitchenTab = 'feed';

        $scope.organizations = [{
            name: 'Brown University',
            manager: 'Bob Chase',
        }, {
            name: 'Johnson and Wales University',
            manager: '',
        }, {
            name: 'Roger Williams University',
            manager: 'Josh Hennessy',
        }, {
            name: 'RISD',
            manager: '',
        }, {
            name: 'Rhode Island College',
            manager: '',
        }, {
            name: 'University of Rhode Island',
            manager: '',
        }];

        $scope.init = () => {
        };

        $scope.openMenu = ($mdOpenMenu, ev) => {
            $mdOpenMenu(ev);
        };

        $scope.computeKitchenTabClass = (kitchenTab) => {
            return kitchenTab === $scope.kitchenTab ? 'phood-gray' : 'phood-blue';
        };

        $scope.setKitchenTabClass = (kitchenTab) => {
            $scope.kitchenTab = kitchenTab;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
    });
};