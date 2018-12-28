require('./recent-activity.css');
const DateUtilities = require('../../services/utilities/date-utilities');
const CollectionUtilities = require('../../services/utilities/collection-utilities');

module.exports = function(app) {
    app.controller('recentActivityCtrl', function($scope, AuthService, RecentActivityService) {
        $scope.activityData = [];
        $scope.sortType = 'mostRecent';
        $scope.sortReverse = true;

        $scope.init = async function() {
            $scope.loadingState = 'Loading';
            const todaysDate = new Date();
            const locationData = (await RecentActivityService.getLocationDetails()).data;
            const recentLogs = (await RecentActivityService.getMostRecentLogs()).data;
            const menuCounts = (await RecentActivityService.getMenuCounts(DateUtilities.isoToYYYYMMDD(todaysDate))).data;

            const locationMenuData = CollectionUtilities.capitalizeFirstLetterOfArrayKeys(menuCounts);
            $scope.activityData = processActivityData(locationData, recentLogs, locationMenuData);
            $scope.loadingState = 'Ready';
            $scope.updateScope();
        };

        $scope.updateScope = function() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.sortBy = (newSortType) => {
            if (newSortType === $scope.sortType) {
                $scope.sortReverse = !$scope.sortReverse;
            }

            $scope.sortType = newSortType;
        };

        function processActivityData(locationData, recentLogs, menuCounts) {
            const activityData = [];

            locationData.filter(loc => loc.locActive === 1 && loc.orgActive === 1)
                .forEach((loc) => {
                    const entry = {
                        name: loc.locName,
                        organization: loc.orgName,
                    };

                    const hasRecentLogs = recentLogs.find(d => d.locationId === loc.locId);
                    if (hasRecentLogs) {
                        const { mostRecent } = hasRecentLogs;
                        entry.loggedTime = DateUtilities.reorderTime(new Date(mostRecent));
                        entry.logHighlight = computeHighlightingClass(mostRecent);
                        entry.mostRecent = mostRecent;
                    } else {
                        entry.loggedTime = 'None';
                        entry.logHighlight = 'oldLog';
                        entry.mostRecent = 'None';

                    }

                    const hasMenuCounts = menuCounts.find(d => d.locationId === loc.locId);

                    if (hasMenuCounts) {
                        entry.numBreakfastItems = (hasMenuCounts.Breakfast) ? hasMenuCounts.Breakfast : 0;
                        entry.numLunchItems = (hasMenuCounts.Lunch) ? hasMenuCounts.Lunch : 0;
                        entry.numDinnerItems = (hasMenuCounts.Dinner) ? hasMenuCounts.Dinner : 0;
                    } else {
                        entry.numBreakfastItems = 0;
                        entry.numLunchItems = 0;
                        entry.numDinnerItems = 0;
                    }

                    activityData.push(entry);
                });

            return activityData;
        }

        // Determine logged time highlighting class based on elapsed time since most recent log.
        function computeHighlightingClass(recentLog) {
            if (recentLog) {
                const today = new Date();
                const logTime = new Date(recentLog);
                const elapsedMilliseconds = today.getTime() - logTime.getTime();
                const elapsedDays = elapsedMilliseconds / (1000 * 60 * 60 * 24);

                if (elapsedDays < 3.0) {
                    return 'newLog';
                } else if (elapsedDays >= 3.0 && elapsedDays < 7.0) {
                    return 'warningLog';
                }
            }

            return 'oldLog';
        }
    });
};