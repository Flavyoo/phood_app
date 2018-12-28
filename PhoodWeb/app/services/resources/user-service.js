module.exports = function (app) {
    app.service('UserService', ['WebApiService', function (webApi) {
        const resource = '/Users';

        this.createPrimaryAccount = async function (userData) {
            const route = `${resource}/createPrimaryAccount`;
            const result = await webApi.apiPOST(route, userData);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.createSubAccount = async function (userData) {
            const route = `${resource}/createSubAccount`;
            const result = await webApi.apiPOST(route, userData);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getSubAccountList = async function (parentId) {
            const route = `${resource}/getSubAccountList`;
            const query = {
                parentId,
            };
            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getUserList = async function (onlyPrimary) {
            const route = `${resource}/getUserList`;
            const query = {
                onlyPrimary,
            };

            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.updateUserInfo = async function (userData) {
            const route = `${resource}/updateUserInfo`;
            const result = await webApi.apiPUT(route, { user: userData });

            return {
                success: result.success,
            };
        };

        this.changePassword = async function (userId, oldPass, newPass) {
            const route = `${resource}/changePassword`;
            const data = {
                userId,
                confirmPassword: oldPass,
                newPassword: newPass,
            };
            const result = await webApi.apiPUT(route, data);

            return {
                success: result.success,
            };
        };

        this.setActiveStatus = async function (userId, activeStatus) {
            const route = `${resource}/setActiveStatus`;
            const data = {
                userId,
                active: activeStatus,
            };
            const result = await webApi.apiPUT(route, data);

            return {
                success: result.success,
            };
        };

        this.deleteUser = async function (userId) {
            const route = `${resource}/deleteUser`;
            const query = {
                id: userId,
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success,
            };
        };

        this.adminResetPassword = async function (userId, newPassword) {
            const route = `${resource}/adminResetPassword`;
            const data = {
                userId,
                newPassword,
            };
            const result = await webApi.apiPOST(route, data);

            return {
                success: result.success,
            };
        };
    }]);
};