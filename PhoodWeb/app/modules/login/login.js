"use strict";
require('./login.css');

module.exports = function(app) {
    app.controller("loginCtrl", function($scope, $state, AuthService) {
        $scope.loginFailed = false;
        $scope.loginAttempt = "None";
        $scope.loadingState = "Ready";

        $scope.checkCredentials = async function(username, password) {
            if (username && password) {
                $scope.loadingState = "Loading";
                const loginAttempt = await AuthService.login(username, password);

                if (loginAttempt.success) {
                    if (AuthService.isAdmin()) {
                        $state.go('account');
                    } else if (AuthService.isDirector()) {
                        $state.go('dashboard');
                    } else {
                        $state.go('main');
                    }

                    $scope.loginAttempt = "Success";
                    $scope.loadingState = "Ready";
                } else {
                    if (loginAttempt.error === 'Unauthorized') {
                        $scope.loginAttempt = "Failed";
                        $scope.serverResponse = "Invalid username or password.";
                        $scope.loadingState = "Ready";
                    } else {
                        $scope.loginAttempt = "Failed";
                        $scope.serverResponse = "Uh oh! Either the username or password is incorrect, or there is an error on our end. Please contact us if you need assistance.";
                        $scope.loadingState = "Ready";
                    }
                }

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        };
    });
};
