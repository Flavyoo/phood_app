"use strict";

module.exports = function(app) {
    app.service('InventoryService', ['WebApiService', function(webApi) {
        const resource = "/InventoryItems";

        this.addItem = async function(item) {
            const route = resource + "/addInventoryItem";
            const result = await webApi.apiPOST(route, {inventoryItem: item});

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getItems = async function(locationID) {
            const route = resource + "/getInventoryItemsByLocationId";
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

        this.updateItem = async function(item) {
            const route = resource + "/updateInventoryItem";
            const result = await webApi.apiPUT(route, {inventoryItem: item});

            return {
                success: result.success
            };
        };

        this.deleteItem = async function(itemId) {
            const route = resource + "/deleteInventoryItem";
            const query = {
                id: itemId
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success
            };
        };
    }]);
};