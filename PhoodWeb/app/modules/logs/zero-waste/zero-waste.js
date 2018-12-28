"use strict";
require('./zero-waste.css');
const DateUtilities = require('../../../services/utilities/date-utilities');
const CollectionUtilities = require('../../../services/utilities/collection-utilities');

module.exports = function(app) {
    app.controller('zeroWasteCtrl', function($scope, AuthService, UserSettingsService, FoodLogService, MenuService, OrganizationService, LocationService) {
        $scope.$on('$stateChangeSuccess', function() {
                AuthService.restrict();
            }
        );

        $scope.admin = false;
        $scope.director = false;
        $scope.organizationList = [];
        $scope.selectedOrganization = {
            organizationName: null
        };
        $scope.locationList = [];
        $scope.selectedLocation = {
            locationName: null
        };

        $scope.wasteData = [];
        $scope.loadingState = "Ready";

        $scope.currentPage = 1;
        $scope.numPerPage = 20;
        $scope.totalItems = 0;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.numPerPage);

        const days = 42;

        $scope.$watch("selectedOrganization.organizationName", async function() {
            if ($scope.selectedOrganization.organizationName !== null) {
                const result = await LocationService.getByOrganization($scope.selectedOrganization.organizationName);
                if (result.success) {
                    $scope.locationList = result.data.map(loc => loc.name);
                    $scope.wasteData = [];
                    $scope.updateScope();
                }
            }
        });

        $scope.$watch("selectedLocation.locationName", async function() {
            const today = new Date();
            const startDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));

            const localStartDate = DateUtilities.toLocalDate(startDate);
            const localEndDate = DateUtilities.toLocalDate(today);

            if ($scope.selectedOrganization !== null && $scope.selectedLocation !== null) {
                $scope.loadingState = "Loading";

                try {
                    const results = await Promise.all([
                        MenuService.getItems($scope.selectedLocation.id, localStartDate, localEndDate),
                        FoodLogService.getFoodLogsByLocationId($scope.selectedLocation.id, localStartDate, localEndDate)
                    ]);

                    const menuItems = results[0];
                    const logs = results[1];

                    if (menuItems && logs) {
                        if (menuItems.length > 0 || logs.length > 0) {
                            const data = processWasteData(menuItems, logs);
                            $scope.wasteData = data.sort(function(a, b) {
                                return b.daysWasted - a.daysWasted;
                            });
                            $scope.updateScope();
                            $scope.loadingState = "Ready";
                        } else {
                            $scope.loadingState = "NoData";
                        }
                    } else {
                        $scope.loadingState = "Error";
                    }
                } catch (err) {
                    $scope.loadingState = "Error";
                }
            }
        });

        $scope.init = async function() {
            $scope.admin = AuthService.isAdmin();
            $scope.director = AuthService.isDirector();
            const userAuth = AuthService.getUserAuth();

            if ($scope.admin) {
                const result = await OrganizationService.getOrganizationList();
                if (result.success) {
                    $scope.organizationList = result.data
                }
            } else if ($scope.director) {
                $scope.selectedOrganization = userAuth.organization;
            } else {
                $scope.selectedOrganization = userAuth.organization;
                $scope.selectedLocation = userAuth.location;
            }

        };

        $scope.updateScope = function() {
            if (!$scope.$$phase)
                $scope.$apply();
        };

        function processWasteData(menuItems, logs) {
            const allNames = menuItems.map(i => i.name)
                .filter(name => name !== "")
                .sort(function(a, b) {
                    return a - b;
                });
            const menuItemNames = CollectionUtilities.unique(allNames);

            const logGroups = CollectionUtilities.groupBy(logs, function(log) {
                return log.item;
            });
            const logGroupNames = Object.keys(logGroups);
            const menuOnlyItems = menuItemNames.filter(function(item) {
                return !logGroupNames.includes(item)
            });
            const wasteData = [];

            for (let i = 0; i < logGroupNames.length; i++) {
                const logGroup = logGroups[logGroupNames[i]];
                const daysWasted = getDaysWasted(logGroup);
                const quantityWasted = getQuantitiesWasted(logGroup);

                const entry = {
                    itemName: logGroupNames[i],
                    daysWasted: daysWasted,
                    daysNotWasted: days - daysWasted,
                    pounds: quantityWasted.pound,
                    portions: quantityWasted.portion,
                    each: quantityWasted.each
                };

                wasteData.push(entry);
            }

            for (let i2 = 0; i2 < menuOnlyItems.length; i2++) {
                const entry2 = {
                    itemName: menuOnlyItems[i2],
                    daysWasted: 0,
                    daysNotWasted: days
                };

                wasteData.push(entry2);
            }

            $scope.totalItems = wasteData.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.numPerPage);
            return wasteData;
        }

        function getDaysWasted(logGroup) {
            const logDays = CollectionUtilities.groupBy(logGroup, function(log) {
                return log.dateProduced;
            });

            return Object.keys(logDays).length;
        }

        function getQuantitiesWasted(logGroup) {
            const logUnits = CollectionUtilities.groupBy(logGroup, function(log) {
                return log.unit.toLowerCase();
            });
            const logUnitNames = Object.keys(logUnits);
            const quantityData = {};

            for (let i = 0; i < logUnitNames.length; i++) {
                const unitName = logUnitNames[i];
                const quantities = logUnits[logUnitNames[i]].map(function(log) {
                    return log.quantity;
                });
                const total = quantities.reduce(function(a, b) {
                    return parseFloat(a) + parseFloat(b);
                });

                quantityData[unitName] = Math.floor(total * 100) / 100
            }

            return quantityData
        }
    });
};