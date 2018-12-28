module.exports = function(app) {
    app.service('MenuService', ['WebApiService', function(webApi) {
        const resource = '/MenuItems';

        this.addItem = async function(menuItem) {
            const route = resource + '/addMenuItem';
            const result = await webApi.apiPOST(route, menuItem);

            return {
              success: result.success,
              data: result.success ? result.data : null,
              error: result.success ? null : result.data,
            };
        };

        this.bulkAddItems = async function(locationId, menuItems) {
            const route = resource + '/addMenuItems';
            const body = {
                locationId,
                menuItems,
            };
            const result = await webApi.apiPOST(route, body);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getItems = async function(locationID, startDate, endDate) {
            const route = resource + '/getLocationMenu' ;
            const query = {
                locationId: locationID,
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

        this.getMenusForOrganization = async function(locations, startDate, endDate) {
            const route = resource + '/getLocationMenu';

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

        this.updateItem = async function(menuItem) {
            const route = resource + '/updateMenuItem';
            const result = await webApi.apiPUT(route, menuItem);

            return {
                success: result.success,
            };
        };

        this.bulkUpdateItems = async function(locationId, menuItems) {
            const route = resource + '/updateMenuItems';
            const body = {
                locationId,
                menuItems,
            };
            const result = await webApi.apiPUT(route, body);

            return {
                success: result.success,
                requestedUpdates: result.data.requestedUpdates,
                actualUpdates: result.data.actualUpdates
            };
        };

        this.deleteItem = async (id) => {
            const route = `${resource}/deleteMenuItem`;
            const body = {
                id
            };

            const result = await webApi.apiDELETE(route, body);

            return {
                success: result.success,
            };
        };

        this.deleteListById = async (locationId, idArray) => {
            const route = resource + '/deleteMenuItems';
            const body = {
                locationId,
                menuItemIds: idArray,
            };

            const result = await webApi.apiDELETE(route, body);

            return {
                success: result.success,
            };
        };
    }]);
};