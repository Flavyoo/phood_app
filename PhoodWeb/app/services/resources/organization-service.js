module.exports = function (app) {
    app.service('OrganizationService', ['WebApiService', function (webApi) {
        const resource = '/Organizations';

        function processReturn(result) {
            const returnObject = {
                success: result.success,
            };

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        }

        this.addOrganization = async (organizationData) => {
            const route = `${resource}/addOrganization`;
            const result = await webApi.apiPOST(route, organizationData);

            return processReturn(result);
        };

        this.getOrganizationList = async (onlyActive) => {
            const route = `${resource}/getOrganizationList`;
            const query = {
                onlyActive,
            };
            const result = await webApi.apiGET(route, query);

            return processReturn(result);
        };

        this.getOrganizationById = async (organizationId) => {
            const route = `${resource}/getOrganizationById`;
            const query = {
                id: organizationId,
            };
            const result = await webApi.apiGET(route, query);

            return processReturn(result);
        };

        this.getOrganizationsByOwnerId = async (ownerId) => {
            const route = `${resource}/getOrganizationsByOwnerId`;
            const query = {
                ownerId,
            };
            const result = await webApi.apiGET(route, query);

            return processReturn(result);
        };

        this.updateOrganization = async (org) => {
            const route = `${resource}/updateOrganizationInfo`;
            const result = await webApi.apiPUT(route, { organization: org });

            return {
                success: result.success,
            };
        };

        this.setActiveStatus = async (data) => {
            const route = `${resource}/setActiveStatus`;
            const result = await webApi.apiPUT(route, data);

            return {
                success: result.success,
            };
        };

        this.deleteOrganization = async (organizationId) => {
            const route = `${resource}/deleteOrganization`;
            const query = {
                id: organizationId,
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success,
            };
        };
    }]);
};