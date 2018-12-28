"use strict";

module.exports = function(app) {
    app.service('PersistentItemService', ['WebApiService', function(webApi) {
        const resource = "/PersistentItems";

        this.addItem = async function(itemData) {
            const route = resource + "/addPersistentItem";
            const result = await webApi.apiPOST(route, itemData);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getItems = async function(locationID) {
            const route = resource + "/getPersistentItemsByLocationId";
            const query = {
                locationId: locationID
            };
            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.updateItem = async function(itemData) {
            const route = resource + "/updatePersistentItem";
            const result = await webApi.apiPUT(route, itemData);

            return {
                success: result.success
            }
        };

        this.deleteItem = async function(itemId) {
            const route = resource + "/deletePersistentItem";
            const query = {
                id: itemId
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success
            }
        };
    }]);
};