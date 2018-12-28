"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const menuFormatValidation = require('./menu-format.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, MenuFormatService) {
    const router = new Router({prefix: '/menuFormats'});

    router.post('/addMenuFormat', async(ctx, next) => {
        await validateRequest(ctx, menuFormatValidation.addMenuFormat, async() => {
            const menuFormat = ctx.request.body;
            const accessControl = {
                Resource: "MenuFormat", Action: "addMenuFormat",
                TargetId: menuFormat['organizationId'], EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await MenuFormatService.addMenuFormat(menuFormat);

                    ctx['status'] = 201;
                    ctx['body'] = result;
                } catch (err) {
                    if (err instanceof AppErrors.UniqueConstraintError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Unique constraint violation",
                            message: err.message
                        };
                    } else if (err instanceof AppErrors.ForeignKeyConstraintError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Foreign key constraint violation",
                            index: err.index
                        };
                    } else if (err instanceof AppErrors.InvalidSizeError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Invalid size error",
                            message: err.message
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    router.get('/getMenuFormatByAssignedEmail', async(ctx, next) => {
        await validateRequest(ctx, menuFormatValidation.getMenuFormatByAssignedEmail, async() => {
            const data = ctx.query;
            const accessControl = {
                Resource: "MenuFormat", Action: "getMenuFormatByAssignedEmail",
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuFormatService.getMenuFormatByAssignedEmail(data['email']);

                if (result) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/getMenuFormatsByOrganization', async(ctx, next) => {
        await validateRequest(ctx, menuFormatValidation.getMenuFormatsByOrganization, async() => {
            const data = ctx.query;
            const orgId = parseInt(data['organizationId']);
            const accessControl = {
                Resource: "MenuFormat", Action: "getMenuFormatsByOrganization",
                TargetId: orgId, EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuFormatService.getMenuFormatsByOrganization(orgId);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updateMenuFormat', async(ctx, next) => {
        await validateRequest(ctx, menuFormatValidation.updateMenuFormat, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "MenuFormat", Action: "updateMenuFormat",
                TargetId: data['menuFormat']['id'], EntityType: "Organization", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await MenuFormatService.updateMenuFormat(data['menuFormat']);

                    if (result) {
                        ctx['status'] = 200;
                    } else {
                        ctx['status'] = 409;
                    }
                } catch (err) {
                    if (err instanceof AppErrors.InvalidSizeError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Invalid size error",
                            message: err.message
                        };
                    } else {
                        throw err
                    }
                }

            });
        });
    });

    router.delete('/deleteMenuFormat', async(ctx, next) => {
        await validateRequest(ctx, menuFormatValidation.deleteMenuFormat, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "MenuFormat", Action: "deleteMenuFormat",
                TargetId: id, EntityType: "Organization", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuFormatService.deleteMenuFormat(id);

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