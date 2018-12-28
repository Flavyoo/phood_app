require('./main.css');

module.exports = function (app) {
    app.controller('mainCtrl', function ($scope, $state, AuthService) {
        $scope.setTracker = () => {
            AuthService.setNavState('Tracker');
            $state.go('tracker');
        };

        $scope.setDashboard = () => {
            AuthService.setNavState('Manager');
            $state.go('dashboard');
        };
    });
};