"use strict";

module.exports = function(app) {
    app.service('LossReasonService', ['WebApiService', function(webApi) {
        const resource = "/LossReasons";

        this.addLossReason = async function(lossReason) {
            const route = resource + "/addLossReason";
            const result = await webApi.apiPOST(route, lossReason);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getLossReasons = async function(organizationId) {
            const route = resource + "/getLossReasonsByOrganizationId";
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

        this.updateLossReason = async function(lossReason) {
            const route = resource + "/updateLossReason";
            const result = await webApi.apiPUT(route, lossReason);

            return {
                success: result.success
            }
        };

        this.deleteLossReason = async function(lossReasonId) {
            const route = resource + "/deleteLossReason";
            const query = {
                id: lossReasonId
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success
            }
        };
    }]);
};