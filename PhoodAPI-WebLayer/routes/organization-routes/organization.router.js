"use strict";
const Router = require('koa-router');
const AppErrors = require('../../../core/application-errors');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const orgValidation = require('./organization.validation');

module.exports = function(AuthService, OrganizationService) {
    const router = new Router({prefix: '/organizations'});

    router.post('/addOrganization', async(ctx, next) => {
        await validateRequest(ctx, orgValidation.addOrganization, async() => {
            const organization = ctx.request.body;
            const accessControl = {
                Resource: "Organization", Action: "addOrganization",
                TargetId: parseInt(organization.ownerId), EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await OrganizationService.addOrganization(organization);

                    ctx['status'] = 201;
                    ctx['body'] = result;
                } catch (err) {
                    if (err instanceof AppErrors.UniqueConstraintError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Unique constraint violation",
                            fields: err.fields
                        };
                    } else if (err instanceof AppErrors.ForeignKeyConstraintError) {
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

    router.get('/getOrganizationById', async(ctx, next) => {
        await validateRequest(ctx, orgValidation.getOrganizationById, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "Organization", Action: "getOrganizationById",
                TargetId: id, EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await OrganizationService.getOrganizationById(id);

                if (result) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/getOrganizationList', async(ctx, next) => {
        await validateRequest(ctx, orgValidation.getOrganizationList, async() => {
            const accessControl = {
                Resource: "Organization", Action: "getOrganizationList"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const activeOnly = (ctx.query['activeOnly'] === 'true');
                const result = await OrganizationService.getOrganizationList(activeOnly);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/getOrganizationsByOwnerId', async(ctx, next) => {
        await validateRequest(ctx, orgValidation.getOrganizationsByOwnerId, async() => {
            const ownerId = parseInt(ctx.query['ownerId']);
            const accessControl = {
                Resource: "Organization", Action: "getOrganizationsByOwnerId",
                TargetId: ownerId, EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await OrganizationService.getOrganizationsByOwnerId(ownerId);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updateOrganizationInfo', async(ctx, next) => {
        await validateRequest(ctx, orgValidation.updateOrganizationInfo, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "Organization", Action: "updateOrganizationInfo",
                TargetId: data['organization']['id'], EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await OrganizationService.updateOrganizationInfo(data['organization']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.put('/setActiveStatus', async(ctx, next) => {
        await validateRequest(ctx, orgValidation.setActiveStatus, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "Organization", Action: "setActiveStatus",
                TargetId: data['organizationId'], EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await OrganizationService.setActiveStatus(data['organizationId'], data['active']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteOrganization', async(ctx, next) => {
        await validateRequest(ctx, orgValidation.deleteOrganization, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "Organization", Action: "deleteOrganization",
                TargetId: id, EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await OrganizationService.deleteOrganization(id);

                    if (result) {
                        ctx['status'] = 200;
                    } else {
                        ctx['status'] = 409;
                    }
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

    return router;
};