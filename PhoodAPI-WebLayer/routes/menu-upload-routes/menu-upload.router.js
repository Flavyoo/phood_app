"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const menuUploadValidation = require('./menu-upload.validation');

module.exports = function(AuthService, MenuUploadService) {
    const router = new Router({prefix: '/menuUpload'});

    router.post('/uploadLocationMenu', async(ctx, next) => {
        await validateRequest(ctx, menuUploadValidation.uploadLocationMenu, async() => {
            const data = ctx.request.body;
            const locationId = parseInt(data['locationId']);
            const accessControl = {
                Resource: "MenuUpload", Action: "uploadLocationMenu",
                TargetId: locationId, EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuUploadService.uploadLocationMenu(data['menuItems'], locationId);

                ctx['status'] = 200;
                ctx['body'] = result;
            });
        });
    });

    router.post('/uploadOrganizationMenu', async(ctx, next) => {
        await validateRequest(ctx, menuUploadValidation.uploadOrganizationMenu, async() => {
            const data = ctx.request.body;
            const organizationId = parseInt(data['organizationId']);
            const accessControl = {
                Resource: "MenuUpload", Action: "uploadOrganizationMenu",
                TargetId: organizationId, EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuUploadService.uploadOrganizationMenu(data['menuItems'], organizationId);

                ctx['status'] = 200;
                ctx['body'] = result;
            });
        });
    });

    return router;
};