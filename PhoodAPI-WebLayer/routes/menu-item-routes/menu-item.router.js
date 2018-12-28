"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const menuItemValidation = require('./menu-item.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, MenuItemService) {
    const router = new Router({prefix: '/menuItems'});

    router.post('/addMenuItem', async(ctx, next) => {
        await validateRequest(ctx, menuItemValidation.addMenuItem, async() => {
            const menuItem = ctx.request.body;
            const accessControl = {
                Resource: "MenuItem", Action: "addMenuItem",
                TargetId: menuItem['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await MenuItemService.addMenuItem(menuItem);

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

    router.post('/addMenuItems', async(ctx, next) => {
        await validateRequest(ctx, menuItemValidation.addMenuItems, async() => {
            const accessControl = {
                Resource: "MenuItem", Action: "addMenuItems",
                TargetId: ctx.request.body['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await MenuItemService.addMenuItems(ctx.request.body['menuItems'], ctx.request.body['locationId']);

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

    router.get('/getLocationMenu', async(ctx, next) => {
        await validateRequest(ctx, menuItemValidation.getLocationMenu, async() => {
            const data = ctx.query;
            const accessControl = {
                Resource: "MenuItem", Action: "getLocationMenu",
                TargetId: data['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuItemService.getLocationMenu(parseInt(data['locationId']), data['startDate'], data['endDate']);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updateMenuItem', async(ctx, next) => {
        await validateRequest(ctx, menuItemValidation.updateMenuItem, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "MenuItem", Action: "updateMenuItem",
                TargetId: data['menuItem']['id'], EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuItemService.updateMenuItem(data['menuItem']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.put('/updateMenuItems', async(ctx, next) => {
        await validateRequest(ctx, menuItemValidation.updateMenuItems, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "MenuItem", Action: "updateMenuItems",
                TargetId: data['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuItemService.updateMenuItems(data['menuItems'], data['locationId']);

                if (result) {
                    ctx['status'] = 200;
                    ctx['body'] = {
                        requestedUpdates: result.requestedUpdates,
                        actualUpdates: result.actualUpdates
                    };
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteMenuItem', async(ctx, next) => {
        await validateRequest(ctx, menuItemValidation.deleteMenuItem, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "MenuItem", Action: "deleteMenuItem",
                TargetId: id, EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuItemService.deleteMenuItem(id);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteMenuItems', async(ctx, next) => {
        await validateRequest(ctx, menuItemValidation.deleteMenuItems, async() => {
            const data = ctx.query;
            const accessControl = {
                Resource: "MenuItem", Action: "deleteMenuItems",
                TargetId: data['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await MenuItemService.deleteMenuItems(data['menuItemIds'].map(id => parseInt(id)), data['locationId']);

                if (result) {
                    ctx['status'] = 200;
                    ctx['body'] = {
                        requestedDeletions: result.requestedDeletions,
                        actualDeletions: result.actualDeletions
                    };
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    return router;
};