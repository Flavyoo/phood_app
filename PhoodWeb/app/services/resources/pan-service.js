"use strict";

module.exports = function(app) {
    app.service('PanService', ['WebApiService', function(webApi) {
        const resource = "/Pans";

        this.addPan = async function(panData) {
            const route = resource + "/addPan";
            const result = await webApi.apiPOST(route, panData);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getByOrganization = async function(organizationId) {
            const route = resource + "/getPansByOrganizationId";
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

        this.editPan = async function(pan) {
            const route = resource + "/updatePan";
            const result = await webApi.apiPUT(route, {pan: pan});

            return {
                success: result.success
            }
        };

        this.deletePan = async function(panId) {
            const route = resource + "/deletePan";
            const query = {
                id: panId
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success
            }
        };
    }]);
};