'use strict';

module.exports = function(app) {
    app.service('RecentActivityService', ['WebApiService', function(webApi) {
        const resource = '/RecentActivity';

        this.getLocationDetails = async function() {
            const route = `${resource}/getLocationDetails`;
            const result = await webApi.apiGET(route);

            return {
              success: result.success,
              data: result.success ? result.data : null,
              error: result.success ? null : result.data,
            };
        };

        this.getMostRecentLogs = async function() {
            const route = resource + '/getMostRecentLogs';
            const result = await webApi.apiGET(route);

            if (result.success) {
                return {
                    success: true,
                    data: (result.data) ? result.data : []
                }
            } else {
                return {
                    success: false,
                    error: result.data
                }
            }
        };

        this.getMenuCounts = async function(date) {
            const route = resource + '/getMenuCounts';
            const params = {
                date: date,
            };
            const result = await webApi.apiGET(route, params);

            if (result.success) {
                return {
                    success: true,
                    data: (result.data) ? result.data : []
                }
            } else {
                return {
                    success: false,
                    error: result.data
                }
            }
        };
    }]);
};