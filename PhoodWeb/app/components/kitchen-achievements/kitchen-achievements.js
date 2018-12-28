require('./kitchen-achievements.css');

module.exports = (app) => {
    app.component('kitchenAchievements', {
        templateUrl: 'app/components/kitchen-achievements/kitchen-achievements.html',
        controller: function($scope) {
            $scope.tiers = [
                {
                    name: 'Gold',
                    points: '15',
                    color: 'phood-yellow-no-hover',
                },
                {
                    name: 'Silver',
                    points: '10',
                    color: 'phood-gray',
                },
                {
                    name: 'Blue',
                    points: '5',
                    color: 'phood-blue',
                },
            ];

            $scope.achievementTypes = [
                {
                    name: 'Engagement',
                    tiers: $scope.tiers,
                    icon: 'fa fa-users',
                },
                {
                    name: 'Waste Reduction',
                    tiers: $scope.tiers,
                    icon: 'fa fa-level-down',
                },
                {
                    name: 'Donation',
                    tiers: $scope.tiers,
                    icon: 'fa fa-truck',
                },
            ];

            $scope.miscBadges = [
                {
                    name: 'Achievement',
                    points: 5,
                    icon: '/app/assets/img/badges/achievement-raster.svg',
                },
                {
                    name: 'Divert',
                    points: 5,
                    icon: '/app/assets/img/badges/divert-raster.svg',
                },
                {
                    name: 'Engage',
                    points: 5,
                    icon: '/app/assets/img/badges/engage-raster.svg',
                },
                {
                    name: 'Reduce',
                    points: 5,
                    icon: '/app/assets/img/badges/reduce-raster.svg',
                },
                {
                    name: 'Track',
                    points: 5,
                    icon: '/app/assets/img/badges/track-raster.svg',
                },
            ];
        },
    });
};