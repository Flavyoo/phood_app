module.exports = function(app) {
    app.service('MenuUploadService', ['WebApiService', function(webApi) {
        const resource = '/MenuUpload';

        this.uploadOrganizationMenu = async (organizationId, menuItems) => {
            const route = resource + '/uploadOrganizationMenu';
            const body = {
                organizationId,
                menuItems,
            };

            const result = await webApi.apiPOST(route, body);

            return {
              success: result.success,
              data: result.success ? result.data : null,
              error: result.success ? null : result.data,
            };
        };
    }]);
};