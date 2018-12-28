const angular = require('angular');

// Register Angular App
const app = angular.module('PhoodWeb', [
    require('angular-animate'),
    require('angular-aria'),
    require('angular-local-storage'),
    require('angular-material'),
    require('angular-messages'),
    require('angular-sanitize'),
    require('angular-ui-router'),
    require('angular-ui-bootstrap'),
    require('angulartics'),
    require('angulartics-google-analytics'),
    'chart.js',
    'xeditable',
    'ui.bootstrap'
]);

// Register Services
require('./services/services')(app);
// Register Components
require('./components/components')(app);
// Register Modules
require('./modules/modules')(app);
// Import Application Assets
require('./assets/assets');

app.controller('appCtrl', function($scope, $rootScope, $state, AuthService) {
    $scope.isLogin = false;

    $scope.init = function() {
        const isLoggedIn = AuthService.isLoggedIn();

        $scope.isLogin = !isLoggedIn;

        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
        $scope.init();
    });

    $rootScope.$on('$stateChangeSuccess', () => {
        const restrictState = AuthService.restrict($state.current.name);

        if (restrictState) {
            $state.go(restrictState);
        }
    });
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, localStorageServiceProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('account', {
            url: '/account',
            templateUrl: 'app/modules/account/account.html',
            controller: 'accountCtrl',
            controllerAs: 'account',
        })

        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/modules/dashboard/dashboard.html',
            controller: 'dashboardCtrl',
        })

        .state('donation', {
            url: '/donation',
            templateUrl: 'app/modules/donation/donation.html',
            controller: 'donationCtrl',
        })

        .state('kitchen', {
            url: '/kitchen',
            templateUrl: 'app/modules/kitchen/kitchen.html',
            controller: 'kitchenCtrl',
        })

        .state('login', {
            url: '/login',
            templateUrl: 'app/modules/login/login.html',
            controller: 'loginCtrl',
        })

        .state('logs', {
            url: '/logs',
            templateUrl: 'app/modules/logs/logs.html',
            controller: 'logsCtrl',
        })

        .state('main', {
            url: '/main',
            templateUrl: 'app/modules/main/main.html',
            controller: 'mainCtrl',
        })

        .state('recentActivity', {
            url: '/recentActivity',
            templateUrl: 'app/modules/recent-activity/recent-activity.html',
            controller: 'recentActivityCtrl',
        })

        .state('reports', {
            url: '/reports',
            templateUrl: 'app/modules/reports/reports.html',
            controller: 'reportsCtrl',
        })

        .state('tracker', {
            url: '/tracker',
            templateUrl: 'app/modules/tracker/tracker.html',
            controller: 'trackerCtrl',
        });

    localStorageServiceProvider
        .setPrefix('PhoodWeb')
        .setStorageType('sessionStorage');

    $locationProvider.html5Mode(true);
});

app.run(function($rootScope, $state, editableOptions, $window, $location) {
    // Handle 404 errors - this doesn't work yet
    $rootScope.$on('$stateChangeError', () => {
        $state.go('login');
    });

    // initialise google analytics
    $window.ga('create', 'UA-64092406-2', 'auto');

    // track pageview on state change
    $rootScope.$on('$stateChangeSuccess', () => {
        $window.ga('send', 'pageview', $location.path());
    });

    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});