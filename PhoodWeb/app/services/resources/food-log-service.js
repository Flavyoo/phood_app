const DateUtilities = require('../utilities/date-utilities');

module.exports = function(app) {
    app.service('FoodLogService', ['WebApiService', function(webApi) {
        const resource = '/FoodLogs';

        this.addFoodLog = async function(foodLog) {
            const route = resource + '/addFoodLog';
            const result = await webApi.apiPOST(route, foodLog);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getFoodLogsByLocationId = async function(locationId, startDate, endDate) {
            const route = resource + '/getLocationFoodLogs';
            const query = {
                locationId,
                startDate,
                endDate,
            };
            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getFoodLogsForOrganization = async function(locations, startDate, endDate) {
            const route = resource + '/getLocationFoodLogs';

            const promises = locations.map((location) => {
                const query = {
                    locationId: location.id,
                    startDate,
                    endDate,
                };

                return webApi.apiGET(route, query);
            });

            try {
                const results = await Promise.all(promises);
                const logs = results.map((promise) => {
                    if (promise.data.length > 0) {
                        return promise.data;
                    }

                    return [];
                });

                return {
                    success: true,
                    data: logs,
                };
            } catch (err) {
                return {
                    success: false,
                    error: err,
                };
            }
        };

        this.editFoodLog = async function(foodLog) {
            const route = resource + '/updateFoodLog';

            foodLog.dateProduced = DateUtilities.isoToYYYYMMDD(foodLog.dateProduced);
            const result = await webApi.apiPUT(route, { foodLog });

            return {
                success: result.success,
            };
        };

        this.deleteFoodLog = async function(foodLogId) {
            const route = resource + '/deleteFoodLog';
            const query = {
                id: foodLogId,
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success,
            };
        };

        this.filterFoodLogs = function(foodLogs, locationIds, minimum, startDate, endDate, item, actions) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            return foodLogs.filter(function(foodLog) {
                const currentQuantity = foodLog.quantity;
                const currentItem = foodLog.itemName.toLowerCase();
                const currentDate = new Date(foodLog.loggedTime);

                return locationIds.includes(foodLog.locationId)
                    && currentQuantity >= minimum
                    && currentItem.indexOf(item.toLowerCase()) > -1
                    && actions.indexOf(foodLog.actionTaken) > -1
                    && currentDate >= start
                    && currentDate <= end
            });
        };
    }]);
};