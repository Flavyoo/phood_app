require('./logs.css');
const DateUtilities = require('../../services/utilities/date-utilities');
const ExportService = require('../../services/utilities/export-service');
const SimilaritySevice = require('../../services/utilities/similarity-service');
const CostService = require('../../services/utilities/cost-service');

module.exports = function(app) {
    app.controller('logsCtrl', function($scope, $mdDialog, AuthService, FoodLogService, MenuService, AlertService) {
        $scope.records = [];
        $scope.objects = [];
        $scope.loaded = false;
        $scope.credentials = null;
        $scope.item = '';
        $scope.action = 'All';
        $scope.minimum = 0;
        $scope.queriedParams = {};

        const user = AuthService.getUserAuth();
        $scope.user = user;
        $scope.locations = user.locations;
        $scope.locationId = (user.location) ? user.location.id : undefined;
        $scope.selectedLocations = $scope.locations.map(loc => loc.name);
        $scope.organization = user.organization;

        $scope.selectedActions = [];
        $scope.sortType = 'loggedTime';
        $scope.sortReverse = true;

        $scope.showSearch = false;
        $scope.showQuantity = false;

        $scope.currentPage = 1;
        $scope.numPerPage = 20;
        $scope.totalItems = 0;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.numPerPage);
        $scope.endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        $scope.startDate = new Date(2016, 7, 1, 0);

        $scope.localStartDate = null;
        $scope.localEndDate = null;

        $scope.isManager = false;
        $scope.isTracker = true;
        $scope.showTotalsTable = false;

        $scope.filteredTodos = [];
        $scope.currentPage = 1;
        $scope.numPerPage = 20;
        $scope.maxSize = 5;

        $scope.locationTotals = [];

        $scope.actions = [
            {name: 'Discarded', selected: true},
            {name: 'Repurposed', selected: true},
            {name: 'Composted', selected: true},
            {name: 'Donation', selected: true}
        ];

        $scope.logActions = ['Discarded', 'Repurposed', 'Composted', 'Donation'];
        $scope.units = ['Portion', 'Pound', 'Each'];
        $scope.lossReasons = ['Over Production', 'Expired', 'Spoilage', 'Quality', 'N/A'];
        $scope.loadingState = 'Ready';

        $scope.init = init;
        $scope.fetchLogs = fetchLogs;

        function init() {
            if (AuthService.isLoggedIn()) {
                $scope.loading = true;
                $scope.isManager = AuthService.isManager();
                $scope.isTracker = AuthService.isTracker();

                if ($scope.isTracker) {
                    // Only show today if it's not manager
                    $scope.startDate = new Date();
                }
            }
        }

        async function fetchLogs() {
            const newParams = {
                locations: $scope.locations,
                startDate: $scope.localStartDate,
                endDate: $scope.localEndDate,
            };

            // Make sure we didn't query these exact parameters already
            if ($scope.localStartDate && ($scope.localStartDate.length > 0) && $scope.localEndDate && ($scope.localEndDate.length > 0) && (newParams !== $scope.queriedParams)) {
                $scope.queriedParams = newParams;
                $scope.loadingState = 'Loading';

                if (user.isTracker) {
                    $scope.locations = $scope.locations.filter((location) => {
                        return location.id === $scope.locationId;
                    });
                }

                const logResult = await FoodLogService.getFoodLogsForOrganization($scope.locations, $scope.localStartDate, $scope.localEndDate);
                let logs = (logResult.success) ? logResult.data.reduce((total, locationLogs) => {
                    return total.concat(locationLogs);
                }, []) : [];

                const menuResult = await MenuService.getMenusForOrganization($scope.locations, $scope.localStartDate, $scope.localEndDate);
                const menus = (menuResult.success) ? menuResult.data.reduce((memory, locationMenus) => {
                    return memory.concat(locationMenus);
                }, []) : [];

                logs = logs.map((log) => {
                    log.locationName = $scope.locations.find((loc) => {
                        return loc.id === log.locationId;
                    }).name;

                    log.loggedTime = new Date(log.loggedTime);

                    // Append menu information to the logs
                    const itemMenuReference = CostService.findCloseMenuReference(log, menus);

                    if (itemMenuReference) {
                        log.portionCost = itemMenuReference.portionCost;
                        log.portionQuantity = itemMenuReference.portionQuantity;
                        log.portionUnit = itemMenuReference.portionUnit;

                        log.portionsActioned = CostService.calculatePortionCount(log, itemMenuReference);
                        log.valueActioned = Math.floor(log.portionsActioned * log.portionCost * 100) / 100;
                    }

                    const exactReference = CostService.findExactMenuReference(log, menus);

                    log.portionsProduced = exactReference ? exactReference.portionsProduced : null;

                    // dateProduced is coming back of the form 2017-09-10T00:00:00.000Z, dropping time zone, so create a date from that
                    const dateString = log.dateProduced;
                    const year = Number(dateString.substring(0, 4));
                    const month = Number(dateString.substring(5, 7)) - 1;
                    const day = Number(dateString.substring(8, 10));

                    log.dateProduced = new Date(year, month, day);

                    return log;
                });

                $scope.objects = logs;
                $scope.records = logs;

                $scope.loadingState = 'Ready';
                $scope.addProductionDetails(logs);
                cheatCount();

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }

        $scope.sort = function(keyName) {
            if (keyName.localeCompare($scope.sortType) === 0) {
                $scope.sortReverse = !$scope.sortReverse;
            }

            $scope.sortType = keyName;
        };

        $scope.filterQ = function(obj) {
            return (obj.quantity >= $scope.minimum);
        };

        $scope.filterItem = function(obj) {
            return ((obj.itemName.toLowerCase()).indexOf($scope.item.toLowerCase()) > -1);
        };

        $scope.filterLocation = function(obj) {
            // return (($scope.selectedLocations).indexOf(obj.location) > -1);
            return true;
        };

        $scope.filterAction = function(obj) {
            return (($scope.selectedActions).indexOf(obj.actionTaken) > -1);
        };

        $scope.filterStart = function(obj) {
            // return obj.loggedTime.substring(0, 10) >= $scope.localStartDate;
            return true;
        };

        $scope.filterEnd = function(obj) {
            // return obj.loggedTime.substring(0, 10) <= $scope.localEndDate;
            return true;
        };

        $scope.$watch('selectedLocations', function(nv) {
            cheatCount();
        }, true);

        $scope.$watch('item', cheatCount, true);

        $scope.$watch('records', cheatCount, true);

        $scope.$watch('startDate', function() {
            $scope.localStartDate = DateUtilities.toLocalDate($scope.startDate);
            $scope.fetchLogs();
        }, true);

        $scope.$watch('endDate', function() {
            $scope.localEndDate = DateUtilities.toLocalDate(new Date($scope.endDate.getTime() + 24 * 60 * 60 * 1000));
            $scope.fetchLogs();
        }, true);

        $scope.$watch('minimum', cheatCount, true);

        $scope.$watch('actions|filter:{selected:true}', function(nv) {
            $scope.selectedActions = nv.map(function(action) {
                return action.name;
            });
            cheatCount();
        }, true);

        function cheatCount() {
            let filteredLogs = getRecords();

            if (filteredLogs) {
                $scope.objects = filteredLogs;
                update(filteredLogs.length);
                $scope.computeLocationTotals();
            }
        }

        function update(counter) {
            $scope.totalItems = counter;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.numPerPage);
            $scope.currentPage = 1;
        }

        function getRecords() {
            if ($scope.records) {
                let curLocations = $scope.locations.filter(function(loc) {
                    return $scope.selectedLocations.includes(loc.name);
                });

                let locationIds = curLocations.map(x => x.id);
                return FoodLogService.filterFoodLogs($scope.records, locationIds, $scope.minimum, $scope.localStartDate, $scope.localEndDate, $scope.item, $scope.selectedActions);
            }

            return [];
        }

        $scope.edit = async function(obj) {
            const result = await FoodLogService.editFoodLog(obj);

            if (!result.success) {
                AlertService.alertError("Error updating food log.")
            }
        };

        $scope.delete = function(obj) {
            const index = $scope.objects.indexOf(obj);

            $mdDialog.show({
                controller: function($scope, $mdDialog) {
                    $scope.deleteFoodLog = async function() {
                        $mdDialog.cancel();
                        const id = obj.id;
                        const result = await FoodLogService.deleteFoodLog(id);
                        if (result.success) {
                            $scope.objects.splice(index, 1);
                            $scope.records = $scope.objects;
                        } else {
                            AlertService.alertError('Error deleting food log.');
                        }

                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    };

                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                },

                templateUrl: 'app/modules/logs/confirm-delete-dialog.html',
                parent: angular.element(document.body),
                scope: $scope.$new(false),
                clickOutsideToClose: true
            });
        };

        $scope.addProductionDetails = function(records) {
            for (let i = 0; i < records.length; i++) {
                const record = records[i];
                record.productionDetails = "N/A";
                if (record.portionQuantity !== null && record.portionUnit !== null && record.portionsProduced !== null) {
                    if (record.portionQuantity > 0 && record.portionUnit !== "" && record.portionsProduced > 0) {
                        record.productionDetails = record.portionsProduced * record.portionQuantity + " " + record.portionUnit;
                    }
                }
            }
        };

        $scope.showShortages = function() {
            return ($scope.organization === "RISD") && $scope.isManager;
        };

        $scope.showTotals = function() {
            $scope.showTotalsTable = !$scope.showTotalsTable;

            if ($scope.showTotalsTable) {
                document.getElementById("showTotalsTableButton").innerHTML = "Hide Totals Table";
            } else {
                document.getElementById("showTotalsTableButton").innerHTML = "Show Totals Table";
            }
        };

        $scope.computeLocationTotals = function() {
            const data = getRecords();

            const res = $scope.selectedLocations.reduce(function(memo, curLocation) {
                // Get all the portion, pound, and each
                const loc = $scope.locations.find(function(loc) {
                    return loc.name === curLocation;
                });

                const locationId = (loc) ? loc.id : null;
                const hallLogs = data.filter(d => d.locationId === locationId && d.unit === "Pound");
                const quantitySum = hallLogs.reduce(function(memo2, curObj) {
                    return memo2 + parseFloat(curObj.quantity);
                }, 0);

                let locationObj = {
                    "name": curLocation,
                    "pound": Math.ceil(quantitySum),
                    "entries": hallLogs.length
                };

                memo.push(locationObj);
                return memo;
            }, []);

            const totalPound = Math.floor(res.map(r => r.pound).reduce(function(memo, q) {
                return memo + q;
            }, 0));

            const totalEntries = data.length;
            const totalObj = {name: "TOTAL", pound: totalPound, entries: totalEntries};
            res.push(totalObj);

            $scope.locationTotals = res;
            if (!$scope.$$phase)
                $scope.$apply();
        };

        $scope.exportCSV = function() {
            ExportService.exportCSV(getRecords());
        };
    });

    app.filter('startFrom', function() {
        return function(input, start) {
            if (input) {
                start = +start;
                return input.slice(start);
            }
            return [];
        };
    });

    //-- Reformat 2015-09-03 14:44:23 to 2:24 PM 09/03/16
    app.filter('reorderTime', function() {
        return function(input, obj) {
            return DateUtilities.reorderTime(obj.loggedTime);
        };
    });

    app.filter('showDay', function($filter) {
        const dates = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        //-- Reformat 2016-09-13 to Wed 09/13/16
        return function(input, date) {
            const d = new Date(date);
            const day = dates[d.getDay()];
            const month = d.getMonth() + 1;
            return day + " " + month + "-" + d.getDate();
        };
    });
};