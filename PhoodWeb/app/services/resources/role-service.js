"use strict";

module.exports = function(app) {
    app.service('RoleService', ['WebApiService', function(webApi) {
        const resource = "/Roles";

        this.addRole = async function(userRoleData) {
            const route = resource + "/addRole";
            const result = await webApi.apiPOST(route, userRoleData);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getUserRolesByUserId = async function(id) {
            const route = resource + "/getUserRoles";
            const query = {
                userId: id
            };
            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.deleteRole = async function(userRole) {
            const route = resource + "/deleteRole";
            const query = {
                id: userRole.id,
                entityType: userRole.entityType
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success
            }
        };
    }]);
};