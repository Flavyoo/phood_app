"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const panValidation = require('./pan.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, PanService) {
    const router = new Router({prefix: '/pans'});

    router.post('/addPan', async(ctx, next) => {
        await validateRequest(ctx, panValidation.addPan, async() => {
            const pan = ctx.request.body;
            const accessControl = {
                Resource: "Pan", Action: "addPan",
                TargetId: pan['organizationId'], EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await PanService.addPan(pan);

                    ctx['status'] = 201;
                    ctx['body'] = result;
                } catch (err) {
                    if (err instanceof AppErrors.ForeignKeyConstraintError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Foreign key constraint violation",
                            index: err.index
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    router.get('/getPansByOrganizationId', async(ctx, next) => {
        await validateRequest(ctx, panValidation.getPansByOrganizationId, async() => {
            const id = parseInt(ctx.query['organizationId']);
            const accessControl = {
                Resource: "Pan", Action: "getPansByOrganizationId",
                TargetId: id, EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await PanService.getPansByOrganizationId(id);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updatePan', async(ctx, next) => {
        await validateRequest(ctx, panValidation.updatePan, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "Pan", Action: "updatePan",
                TargetId: data['pan']['id'], EntityType: "Organization", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await PanService.updatePan(data['pan']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deletePan', async(ctx, next) => {
        await validateRequest(ctx, panValidation.deletePan, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "Pan", Action: "deletePan",
                TargetId: id, EntityType: "Organization", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await PanService.deletePan(id);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    return router;
};