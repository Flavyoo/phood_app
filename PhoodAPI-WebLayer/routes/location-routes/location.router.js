"use strict";
const Router = require('koa-router');
const AppErrors = require('../../../core/application-errors');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const locValidation = require('./location.validation');

module.exports = function(AuthService, LocationService) {
    const router = new Router({prefix: '/locations'});

    router.post('/addLocation', async(ctx, next) => {
        await validateRequest(ctx, locValidation.addLocation, async() => {
            const location = ctx.request.body;
            const accessControl = {
                Resource: "Location", Action: "addLocation",
                TargetId: parseInt(location.organizationId), EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await LocationService.addLocation(location);

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

    router.get('/getLocationById', async(ctx, next) => {
        await validateRequest(ctx, locValidation.getLocationById, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "Location", Action: "getLocationById",
                TargetId: id, EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await LocationService.getLocationById(id);

                if (result) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/getLocationsByOrganizationId', async(ctx, next) => {
        await validateRequest(ctx, locValidation.getLocationsByOrganizationId, async() => {
            const id = parseInt(ctx.query['organizationId']);
            const accessControl = {
                Resource: "Location", Action: "getLocationsByOrganizationId",
                TargetId: id, EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await LocationService.getLocationsByOrganizationId(id);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/getLocationsByPrimaryAccount', async(ctx, next) => {
        await validateRequest(ctx, locValidation.getLocationsByPrimaryAccount, async() => {
            const id = parseInt(ctx.query['primaryId']);
            const accessControl = {
                Resource: "Location", Action: "getLocationsByPrimaryAccount",
                TargetId: id, EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await LocationService.getLocationsByPrimaryAccount(id);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updateLocationInfo', async(ctx, next) => {
        await validateRequest(ctx, locValidation.updateLocationInfo, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "Location", Action: "updateLocationInfo",
                TargetId: data['location']['id'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await LocationService.updateLocationInfo(data['location']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.put('/setActiveStatus', async(ctx, next) => {
        await validateRequest(ctx, locValidation.setActiveStatus, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "Location", Action: "setActiveStatus",
                TargetId: data['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await LocationService.setActiveStatus(data['locationId'], data['active']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteLocation', async(ctx, next) => {
        await validateRequest(ctx, locValidation.deleteLocation, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "Location", Action: "deleteLocation"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await LocationService.deleteLocation(id);

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