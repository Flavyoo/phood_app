"use strict";

module.exports = function(app) {
    app.service('LocationService', ['WebApiService', function(webApi) {
        const resource = "/Locations";

        this.addLocation = async function(location) {
            const route = resource + "/addLocation";
            const result = await webApi.apiPOST(route, location);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getLocationById = async function(locationId) {
            const route = resource + "/getLocationById";
            const query = {
                id: locationId
            };
            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getLocationsByOrganizationId = async function(organizationId) {
            const route = resource + "/getLocationsByOrganizationId";
            const query = {
                organizationId: organizationId
            };
            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.updateLocationInfo = async function(location) {
            const route = resource + "/updateLocationInfo";
            const result = await webApi.apiPUT(route, {location: location});

            return {
                success: result.success
            };
        };

        this.setActiveStatus = async function(data) {
            const route = resource + "/setActiveStatus";
            const result = await webApi.apiPUT(route, data);

            return {
                success: result.success
            };
        };

        this.deleteLocation = async function(locationId) {
            const route = resource + "/deleteLocation";
            const query = {
                id: locationId
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success
            };
        };
    }]);
};