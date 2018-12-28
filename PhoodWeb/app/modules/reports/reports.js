require('./reports.css');
const CollectionUtilities = require('../../services/utilities/collection-utilities');
const DateUtilities = require('../../services/utilities/date-utilities');
const ReportService = require('../../services/utilities/report-service');
const CostService = require('../../services/utilities/cost-service');

module.exports = function(app) {
    app.controller('reportsCtrl', function($scope, AuthService, MenuService, FoodLogService, AlertService) {
        const user = AuthService.getUserAuth();
        $scope.authorized = false;
        $scope.objects = [];
        $scope.records = [];
        $scope.loading = true;
        $scope.curReport = 1;
        $scope.curItemReport = 1;
        $scope.showIndividualItemSummaries = false;
        $scope.items = [];
        $scope.menus = [];
        $scope.top3Items = [];

        $scope.locations = user.locations;
        $scope.selectedLocations = $scope.locations.map(location => location.name);
        $scope.organizations = user.organizations;
        $scope.organization = user.organization;

        $scope.endDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
        $scope.startDate = new Date(new Date().getTime() - (120 * 24 * 60 * 60 * 1000));
        $scope.localStartDate = null;
        $scope.localEndDate = null;
        $scope.loading = true;

        $scope.loadingState = 'Ready';

        $scope.isPreConsumer = false;
        $scope.isPostConsumer = false;

        $scope.init = () => {
            if (AuthService.isLoggedIn()) {
                $scope.user = AuthService.getUserAuth();
                $scope.isPreConsumer = $scope.user.settings.showPreConsumer;
                $scope.isPostConsumer = $scope.user.settings.showPostConsumer;
                $scope.showCost = $scope.user.settings.showCost;
                $scope.canViewMultipleOrganizations = $scope.organizations && $scope.organizations.length;

                if ($scope.isPreConsumer && $scope.showCost) {
                    $scope.curReport = 1;
                } else if ($scope.isPreConsumer) {
                    $scope.curReport = 2;
                } else {
                    $scope.curReport = 3;
                }
            }
        };

        async function updateReports() {
            await fetchMenus();
            await fetchLogs();

            $scope.refreshCharts();
        }

        async function fetchMenus() {
            if ($scope.locations && $scope.localStartDate && $scope.localEndDate && $scope.showCost) {
                const menuResponse = await MenuService.getMenusForOrganization($scope.locations, $scope.localStartDate, $scope.localEndDate);

                if (!menuResponse.success) {
                    AlertService.alertError('Failed to pull menus for costs - defaulting to average cost.');
                } else if (menuResponse.success && menuResponse.data && Array.isArray(menuResponse.data)) {
                    $scope.menus = menuResponse.data;
                }
            }
        }

        async function fetchLogs() {
            // TODO: Refactor this to provide outputs, rather than simply manipulate global scope
            if ($scope.localStartDate && $scope.localEndDate) {
                $scope.loadingState = 'Loading';

                const result = await FoodLogService.getFoodLogsForOrganization($scope.locations, $scope.localStartDate, $scope.localEndDate);
                if (result.success) {
                    const logs = CollectionUtilities.flatten(result.data);

                    $scope.objects = logs;
                    $scope.records = logs;

                    $scope.items = CollectionUtilities.unique(logs.map(log => log.itemName))
                        .sort((a, b) => {
                            return a - b;
                        });

                    [$scope.curItem] = $scope.items;
                    $scope.loadingState = 'Ready';

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                } else {
                    $scope.loadingState = 'Error';
                }
            }
        }

        $scope.setupCharts = () => {
            const curUnits = 'Pounds';

            $scope.topWastedItemByValueOptions = ReportService.getTopWastedItemValueOptions();
            $scope.topWastedItemOptions = ReportService.getTopWastedItemOptions(curUnits);
            $scope.wasteByDayOptions = ReportService.getWasteByDayOptions(curUnits);
            $scope.wasteOverTimeOptions = ReportService.getWasteOverTimeOptions(curUnits);
            $scope.reasonOptions = ReportService.getPieChartOptions(curUnits, 'Loss Reason Breakout');
            $scope.actionOptions = ReportService.getPieChartOptions(curUnits, 'Action Breakout');
            $scope.itemWasteOverTimeOptions = ReportService.getItemWasteOverTimeOptions($scope.curItem, curUnits);
            $scope.itemWasteByDayOptions = ReportService.getItemWasteByDayOptions($scope.curItem, curUnits);
            $scope.itemReasonOptions = ReportService.getPieChartOptions($scope.curUnits, `Loss Reason Breakout - ${$scope.curItem}`);
        };

        // TODO: Defect - start not filtering properly - off by a day
        $scope.filterStart = (obj) => {
            return obj.loggedTime.substring(0, 10) >= $scope.localStartDate;
        };

        // TODO: Defect - end not filtering properly - off by a day
        $scope.filterEnd = (obj) => {
            return obj.loggedTime.substring(0, 10) <= $scope.localEndDate;
        };

        $scope.$watch('startDate', () => {
            $scope.localStartDate = DateUtilities.toLocalDate($scope.startDate);
            updateReports();
        }, true);

        $scope.$watch('endDate', () => {
            const tmp = new Date($scope.endDate.getTime() + (24 * 60 * 60 * 1000));
            $scope.localEndDate = DateUtilities.toLocalDate(tmp);
            updateReports();
        }, true);

        $scope.$watch('selectedLocations', () => {
            $scope.refreshCharts();
        }, true);

        $scope.showReport = (isItem, reportToShow) => {
            if (isItem) {
                $scope.curItemReport = reportToShow;
            } else {
                $scope.curReport = reportToShow;
            }
            $scope.refreshCharts();

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.computeReportCategorySelectClass = (isIndividualItemSummary) => {
            return isIndividualItemSummary === $scope.showIndividualItemSummaries ? 'phood-gray' : 'phood-blue';
        };

        $scope.computeSelectedReportClass = (curReport) => {
            return curReport === $scope.curReport ? 'phood-gray' : 'phood-blue';
        };

        $scope.computeItemReportClass = (curReport) => {
            return curReport === $scope.curItemReport ? 'phood-gray' : 'phood-blue';
        };

        $scope.computeSelectedItemClass = (item) => {
            return item === $scope.curItem ? 'phood-blue md-2-line' : 'md-2-line';
        };

        $scope.showItemSummary = (showSummary) => {
            $scope.showIndividualItemSummaries = showSummary;
            $scope.refreshCharts();

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.refreshCharts = () => {
            $scope.setupCharts();

            if ($scope.showIndividualItemSummaries) {
                $scope.showItemWasteOverTime();
                $scope.showItemWasteByDay();
                $scope.showItemByReason();
            } else {
                $scope.showTopWasted();
                $scope.showWasteByDay();
                $scope.showWasteOverTime();
                $scope.showByWasteReason();
                $scope.showByAction();

                if ($scope.showCost) {
                    $scope.showTopWastedByValue();
                }
            }
        };

        function getRecords() {
            const curRecords = [];
            const { records } = $scope;

            for (let i = 0; i < records.length; i++) {
                if (checkParameters(records[i])) {
                    curRecords.push(records[i]);
                }
            }

            return curRecords;
        }

        function checkParameters(obj) {
            const curDate = obj.loggedTime;

            if ((obj.actionTaken).localeCompare('Repurposed') === 0) {
                return false;
            }

            const currentLocation = $scope.locations.find((loc) => {
                return loc.id === obj.locationId;
            });

            if (currentLocation) {
                return ($scope.selectedLocations).indexOf(currentLocation.name) > -1;
            }

            return (curDate >= $scope.localStartDate) && (curDate <= $scope.localEndDate);
        }

        $scope.showTopWastedByValue = () => {
            // For performance reasons, only calculate the value for the top 30 by volume
            const records = getRecords().filter(record => record.actionTaken === 'Discarded');
            const itemNames = records.map(x => x.itemName);
            const uniqueItemNames = CollectionUtilities.unique(itemNames);
            const uniqueItemsWithValues = [];
            const flattenedMenus = CollectionUtilities.flatten($scope.menus);

            for (let i = 0; i < uniqueItemNames.length; i++) {
                const itemMenuObjects = flattenedMenus.filter(x => (x.name === uniqueItemNames[i]) && x.portionCost && x.portionQuantity && x.portionsProduced);
                const itemLogs = records.filter(x => x.itemName === uniqueItemNames[i]);

                uniqueItemsWithValues.push({
                    itemName: uniqueItemNames[i],
                    value: Math.floor(CostService.computeTotalValueFromLogs(itemLogs, itemMenuObjects)),
                });
            }

            const topWastedSortedByValue = uniqueItemsWithValues.sort((a, b) => {
                return a.value - b.value;
            });
            topWastedSortedByValue.reverse();

            const top10ByValue = topWastedSortedByValue.slice(0, 10);
            if (top10ByValue.length === 0) {
                $scope.topWastedItemByValueLabels = ['No Data'];
                $scope.topWastedItemByValueData = [null];
            } else {
                $scope.topWastedItemByValueLabels = top10ByValue.map(top => top.itemName);
                $scope.topWastedItemByValueData = top10ByValue.map(top => top.value);
            }
        };

        $scope.showTopWasted = () => {
            const records = getRecords().filter(record => record.actionTaken === 'Discarded');
            const topWastedItems = ReportService.computeTopWasted(records);

            $scope.topWastedItems = topWastedItems;

            const [topWastedItem] = topWastedItems;
            if (topWastedItem && ($scope.curItem === '')) {
                $scope.curItem = topWastedItem.item;
            }

            const top10 = topWastedItems.slice(0, 10);
            if (topWastedItems.length === 0) {
                $scope.topWastedItemLabels = ['No Data'];
                $scope.topWastedItemData = [null];
            } else {
                $scope.topWastedItemLabels = top10.map(top => top.itemName);
                $scope.topWastedItemData = top10.map(top => top.quantity);
            }
        };

        $scope.showWasteByDay = () => {
            const records = getRecords().filter(record => record.actionTaken === 'Discarded');
            const values = ReportService.computeWasteByWeekday(records);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            if (values.length === 0) {
                $scope.wasteByDayLabels = ['No Data'];
                $scope.wasteByDayData = [null];
            } else {
                $scope.wasteByDayLabels = days;
                $scope.wasteByDayData = [values];
            }
        };

        $scope.showWasteOverTime = () => {
            const records = getRecords().filter(record => record.actionTaken === 'Discarded');
            const dates = CollectionUtilities.unique(records.map(record => record.dateProduced));
            const dateTotals = ReportService.computeWasteOverTime(records);

            if (dateTotals.length === 0) {
                $scope.wasteOverTimeLabels = ['No Data'];
                $scope.wasteOverTimeData = [null];
            } else {
                $scope.wasteOverTimeLabels = dates.map((dateIso) => {
                    return DateUtilities.isoToMMDDYYYY(dateIso);
                });
                $scope.wasteOverTimeData = [dateTotals];
            }
        };

        $scope.showByWasteReason = () => {
            const records = getRecords().filter(record => record.actionTaken === 'Discarded');
            const totalsByReason = ReportService.computeTotalsByReason(records);

            if (totalsByReason.length === 0) {
                $scope.reasonLabels = ['No Data'];
                $scope.reasonData = [null];
            } else {
                $scope.reasonLabels = totalsByReason.map(obj => obj.actionReason);
                $scope.reasonData = totalsByReason.map(obj => obj.total);
            }
        };

        $scope.showByAction = () => {
            const records = getRecords();
            const totalsByAction = ReportService.computeTotalsByAction(records);

            if (totalsByAction.length === 0) {
                $scope.actionLabels = ['No Data'];
                $scope.actionData = [null];
            } else {
                $scope.actionLabels = totalsByAction.map(obj => obj.actionTaken);
                $scope.actionData = totalsByAction.map(obj => obj.total);
            }
        };

        /**
         * Individual Item Reports
         */
        $scope.showItemWasteOverTime = () => {
            const records = getRecords().filter(record => record.actionTaken === 'Discarded' && record.itemName === $scope.curItem);
            const dates = CollectionUtilities.unique(records.map(record => record.dateProduced));
            const dateTotals = ReportService.computeWasteOverTime(records);

            if (dateTotals.length === 0) {
                $scope.itemWasteOverTimeLabels = ['No Data'];
                $scope.itemWasteOverTimeData = [null];
            } else {
                $scope.itemWasteOverTimeLabels = dates.map((dateIso) => {
                    return DateUtilities.isoToMMDDYYYY(dateIso);
                });
                $scope.itemWasteOverTimeData = [dateTotals];
            }
        };

        $scope.showItemWasteByDay = () => {
            const records = getRecords().filter(record => record.actionTaken === 'Discarded' && record.itemName === $scope.curItem);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dateTotals = ReportService.computeWasteOverTime(records);

            if (dateTotals.length === 0) {
                $scope.itemWasteByDayLabels = ['No Data'];
                $scope.itemWasteByDayData = [null];
            } else {
                $scope.itemWasteByDayLabels = days;
                $scope.itemWasteByDayData = [dateTotals];
            }
        };

        $scope.showItemByReason = () => {
            const records = getRecords().filter(record => record.actionTaken === 'Discarded' && record.itemName === $scope.curItem);
            const totalsByReason = ReportService.computeTotalsByReason(records);

            if (totalsByReason.length === 0) {
                $scope.itemReasonLabels = ['No Data'];
                $scope.itemReasonData = [null];
            } else {
                $scope.itemReasonLabels = totalsByReason.map(obj => obj.actionReason);
                $scope.itemReasonData = totalsByReason.map(obj => obj.total);
            }
        };

        $scope.searchItem = (item) => {
            if (item) {
                $scope.curItem = item;
            }

            $scope.refreshCharts();
        };
    });
};