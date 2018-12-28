require('./phood-navbar.css');
// require('../../../../node_modules/angular-material-badge/angular-material-badge.min.css');

module.exports = function (app) {
    app.component('phoodNavbar', {
        templateUrl: 'app/components/phood-navbar/phood-navbar.html',
        controller: function ($scope, $rootScope, $state, AuthService) {
            $scope.isTrackerPage2 = false;
            $scope.isTracker = AuthService.isTracker() && !AuthService.isManager() && !AuthService.isAdmin();
            $scope.isManager = !AuthService.isTracker() && AuthService.isManager() && !AuthService.isAdmin();
            $scope.isDirector = AuthService.isDirector();
            $scope.isAdmin = AuthService.isAdmin();
            $scope.currentState = '';
            $scope.completed = true;

            function updateRoles(state) {
                if (state === '/main') {
                    $scope.isTracker = false;
                    $scope.isManager = false;
                    $scope.isDirector = false;
                    $scope.isAdmin = false;
                } else {
                    $scope.isTracker = AuthService.isTracker();
                    $scope.isManager = AuthService.isManager();
                    $scope.isDirector = AuthService.isDirector();
                    $scope.isAdmin = AuthService.isAdmin();
                    $scope.user = AuthService.getUserAuth();
                }
            }

            $rootScope.$on(
                '$stateChangeSuccess',
                (event, toState, toParams, fromState) => {
                    $scope.currentState = toState.url;
                    updateRoles(toState.url);

                    if (fromState && fromState.name && (fromState.name === 'tracker')) {
                        $scope.goToTrackerPage1();
                    }
                }
            );

            $scope.init = () => {
                $scope.completed = true;
            };

            $scope.logout = () => {
                AuthService.logout(true);
            };

            $scope.isStateActive = (state) => {
                if ($scope.currentState && $scope.currentState.includes(state)) {
                    return 'md-fab phood-blue';
                }

                return 'md-fab phood-gray';
            };

            $scope.goToTrackerPage1 = () => {
                $scope.isTrackerPage2 = false;
                $rootScope.$broadcast('goToTrackerPage1', {});
            };

            $scope.showBackButton = () => {
                $scope.isTrackerPage2 = true;
            };

            $scope.$on('goToTrackerPage2', () => {
                $scope.showBackButton();
            });
        },
    });
};