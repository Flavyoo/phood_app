"use strict";

module.exports = function(app) {
    app.service('UserSettingsService', ['WebApiService', function(webApi) {
        const resource = "/UserSettings";

        this.getUserSettingsByUserId = async function(userId) {
            const route = resource + "/getUserSettingsByUserId";
            const query = {
                userId: userId
            };
            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.upsertUserSettings = async function(dataObj) {
            const route = resource + "/upsertUserSettings";
            const result = await webApi.apiPUT(route, dataObj);

            return {
                success: result.success
            }
        };

        this.deleteUserSettingsBySettingsId = async function(settingsId) {
            const route = resource + "/deleteUserSettings";
            const query = {
                id: settingsId
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success
            }
        };
    }]);
};