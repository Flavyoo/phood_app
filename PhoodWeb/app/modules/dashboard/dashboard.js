require('./dashboard.css');
const CollectionUtilities = require('../../services/utilities/collection-utilities');
const DateUtilities = require('../../services/utilities/date-utilities');
const ReportService = require('../../services/utilities/report-service');
const CostService = require('../../services/utilities/cost-service');

module.exports = function(app) {
    app.controller('dashboardCtrl', function($scope, $mdDialog, AlertService, MenuService, AuthService, AuthState, FoodLogService) {
        const user = AuthService.getUserAuth();
        $scope.locations = user.locations;
        $scope.records = [];
        $scope.menus = [];
        $scope.locationRecords = [];
        $scope.access = 0;
        $scope.loadingState = 'Ready';
        $scope.dateRange = 'week';
        $scope.selectedUnit = 'Pound';
        $scope.numDaysInReport = 7;
        $scope.totalNumberDays = 0;
        $scope.isPreConsumer = true;

        $scope.init = () => {
            if (AuthService.isLoggedIn()) {
                $scope.user = AuthService.getUserAuth();
                $scope.locations = user.locations;

                initCharts();
                callAPIs();
            }
        };

        async function callAPIs() {
            $scope.loadingState = 'Loading';

            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 5);
            const origin = new Date(endDate.getTime() - (365 * 24 * 60 * 60 * 1000));

            const startDate = new Date();
            startDate.setDate(new Date().getDate() - 7);

            const localStartDateString = DateUtilities.toLocalDate(origin);
            const localEndDateString = DateUtilities.toLocalDate(endDate);
            const locationId = $scope.user && $scope.user.location && $scope.user.location.id ? $scope.user.location.id : '';

            if (locationId) {
                await getMenus(locationId, localStartDateString, localEndDateString);
            }

            fetchLogs(startDate, localStartDateString, localEndDateString);
        }

        async function getMenus(locationId, startDateString, endDateString) {
            const menuResponse = await MenuService.getItems(locationId, startDateString, endDateString);

            if (!menuResponse.success) {
                AlertService.alertError('Failed to pull menus for costs - defaulting to average cost.');
            } else if (menuResponse.success && menuResponse.data && Array.isArray(menuResponse.data)) {
                $scope.menus = menuResponse.data;
            }
        }

        async function fetchLogs(startDate, startDateString, endDateString) {
            const isDirector = AuthService.isDirector();
            if (isDirector) {
                const result = await FoodLogService.getFoodLogsForOrganization($scope.locations, startDateString, endDateString);
                if (result.success) {
                    const logs = CollectionUtilities.flatten(result.data);
                    processLogs(logs, startDate);
                } else {
                    AlertService.alertError('Error retrieving food logs.');
                }
            } else {
                const result = await FoodLogService.getFoodLogsByLocationId(user.location.id, startDateString, endDateString);
                if (result.success) {
                    const logs = CollectionUtilities.flatten(result.data);
                    processLogs(logs, startDate);
                } else {
                    AlertService.alertError('Error retrieving food logs.');
                }
            }
        }

        $scope.updateDashboard = (isPreConsumer) => {
            filterDate($scope.curStartDate, isPreConsumer);
            $scope.computeWasteOverTime(isPreConsumer);

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        function processLogs(logs, start) {
            $scope.loading = false;
            $scope.loadingState = 'Ready';

            $scope.allRecords = logs.filter(x => x.unit === 'Pound');
            filterDate(start, $scope.isPreConsumer);

            $scope.computeWasteOverTime($scope.isPreConsumer);

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        $scope.computeDateRangeClass = (dateMatch) => {
            return ($scope.dateRange === dateMatch) ? 'phood-gray' : 'phood-blue';
        };

        $scope.setDateRange = (duration) => {
            $scope.dateRange = duration;
            $scope.numDaysInReport = (duration === 'week') ? 7 : (duration === 'month') ? 30 : 120;
            const start = DateUtilities.computeStartDate(duration);
            filterDate(start, $scope.isPreConsumer);
        };

        $scope.computePreOrPostShowing = (isPreConsumer) => {
            return isPreConsumer ? 'PRE' : 'POST';
        };

        function filterDate(start, isPreConsumer) {
            const localStartDate = DateUtilities.toLocalDate(start);

            $scope.curStartDate = start;
            $scope.locationRecords = $scope.allRecords.filter((obj) => {
                const curDate = new Date(obj.loggedTime);
                const localCurDate = DateUtilities.toLocalDate(curDate);

                if (isPreConsumer) {
                    return (obj.itemName !== 'Post Consumer') && (localCurDate > localStartDate);
                }

                return (obj.itemName === 'Post Consumer') && (localCurDate > localStartDate);
            });

            populateBannerCards(isPreConsumer);
            $scope.topWastedItems();
            $scope.wastePerDay();
            $scope.topActions();
        }

        function populateBannerCards(isPreConsumer) {
            const records = $scope.locationRecords;
            $scope.totalEntries = records.length;

            const totalPounds = records.reduce((memo, obj) => {
                return memo + parseFloat(obj.quantity);
            }, 0);

            $scope.totalPounds = Math.floor(totalPounds);
            $scope.totalValue = Math.floor(CostService.computeTotalValueFromLogs(records, $scope.menus));
            $scope.totalEntrySize = Math.floor((totalPounds * 100) / records.length) / 100;

            const allRecords = $scope.allRecords.filter((record) => {
                return isPreConsumer ? record.itemName !== 'Post Consumer' : record.itemName === 'Post Consumer';
            });

            $scope.totalNumberDays = CollectionUtilities.unique(allRecords.map(record => record.dateProduced)).length;
            calculateSustainability();
        }

        function calculateSustainability() {
            $scope.totalGallons = (Math.floor(25.4 * $scope.totalPounds * 10) / 10).toLocaleString();
            $scope.totalTonsGHG = (Math.ceil(($scope.totalPounds / 2000) * 3.81 * 100) / 100).toLocaleString();
            $scope.totalCarsForOneDay = (Math.ceil($scope.totalTonsGHG * 365 * 0.192 * 10) / 10).toLocaleString();
        }

        $scope.topWastedItems = () => {
            const records = $scope.locationRecords;
            const items = CollectionUtilities.unique(records.map(record => record.itemName));

            const itemTotalObjs = items.reduce((memo, curItem) => {
                const itemRecords = records.filter(record => record.itemName === curItem);

                const itemTotal = itemRecords.reduce((itemMemo, rec) => {
                    return itemMemo + parseFloat(rec.quantity);
                }, 0);

                memo.push({ itemName: curItem, quantity: Math.ceil(itemTotal) });
                return memo;
            }, []);

            const sorted = itemTotalObjs.sort((a, b) => {
                return a.quantity - b.quantity;
            });
            sorted.reverse();
            const top5 = sorted.slice(0, 4);

            if (top5.length === 0) {
                $scope.topWastedItemLabels = ['No Data'];
                $scope.topWastedItemData = [null];
            } else {
                $scope.topWastedItemLabels = top5.map(t => t.itemName);
                $scope.topWastedItemData = top5.map(t => t.quantity);
            }
        };

        $scope.computeWasteOverTime = (isPreConsumer) => {
            const records = $scope.allRecords.filter((record) => {
                return isPreConsumer ? (record.itemName !== 'Post Consumer') : (record.itemName === 'Post Consumer');
            });

            const dates = CollectionUtilities.unique(records.map(record => record.dateProduced));
            let dateTotals = [];

            if (dates.length > 15) {
                // Group by week
                const logsWithWeek = records.map((log) => {
                    const curDay = new Date(log.dateProduced);
                    log.week = DateUtilities.getWeekNumber(curDay);

                    return log;
                });

                dateTotals = CollectionUtilities.sumQuantityByProperty(logsWithWeek, 'week');
                $scope.wasteOverTimeLabels = dateTotals.map((x) => {
                    const dateOfWeek = DateUtilities.getDateOfWeek(x.key, 2017);
                    return DateUtilities.isoToMMDDYYYY(dateOfWeek);
                });
            } else {
                dateTotals = CollectionUtilities.sumQuantityByProperty(records, 'dateProduced');

                if (dateTotals.length > 0) {
                    $scope.wasteOverTimeLabels = dates.map((dateIso) => {
                        return DateUtilities.isoToMMDDYYYY(dateIso);
                    });
                }
            }

            if (dateTotals.length === 0) {
                $scope.wasteOverTimeLabels = ['No Data'];
                $scope.wasteOverTimeData = [null];
            } else if (dateTotals.length > 0) {
                $scope.wasteOverTimeData = [dateTotals.map(x => x.value)];
            }
        };

        $scope.wastePerDay = () => {
            const records = $scope.locationRecords;
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const logsWithDay = records.map((log) => {
                const curDay = new Date(log.dateProduced);
                curDay.setDate(curDay.getDate() + 1);
                log.day = curDay.getDay();

                return log;
            });
            const logsByDay = CollectionUtilities.groupBy(logsWithDay, 'day');

            const values = [];
            for (let i = 0; i < 7; i++) {
                if (logsByDay[i] !== undefined) {
                    const wasteQuantities = logsByDay[i].map((obj) => {
                        return parseFloat(obj.quantity);
                    });
                    const totalQuantity = wasteQuantities.reduce((a, b) => {
                        return a + b;
                    });
                    values.push(Math.ceil(totalQuantity));
                } else {
                    values.push(0);
                }
            }

            $scope.wasteByDayLabels = days;

            if (values.length === 0) {
                $scope.wasteByDayData = [null];
            } else {
                $scope.wasteByDayData = [values];
            }
        };

        $scope.topActions = () => {
            const records = $scope.locationRecords;
            const actions = CollectionUtilities.unique(records.map(record => record.actionTaken));
            let objs = [];

            for (let i = 0; i < actions.length; i++) {
                const curAction = actions[i];
                const actionRecords = records.filter(record => record.actionTaken === curAction);
                const actionTotal = actionRecords.reduce((memo, obj) => {
                    return memo + parseFloat(obj.quantity);
                }, 0);
                objs.push({ actionTaken: curAction, total: Math.ceil(actionTotal) });
            }

            objs = objs.sort((a, b) => {
                return a.actionTaken - b.actionTaken;
            });
            if (objs.length === 0) {
                $scope.actionLabels = ['No Data'];
                $scope.actionData = [null];
            } else {
                $scope.actionLabels = objs.map(obj => obj.actionTaken);
                $scope.actionData = objs.map(obj => obj.total);
            }
        };

        function initCharts() {
            $scope.wasteOverTimeSeries = ['Pounds', 'Entries'];
            $scope.wasteOverTimeOptions = ReportService.getWasteOverTimeOptions('Pounds');
            $scope.wasteByDayOptions = ReportService.getTotalWasteByDayOptions('Pounds');
            $scope.actionOptions = ReportService.getPieChartOptions('Pounds', 'Action Breakout');
            $scope.topWastedItemOptions = ReportService.getTopWastedItemOptions('Pounds');
        }
    });
};