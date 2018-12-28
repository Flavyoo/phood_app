"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const persistentItemValidation = require('./persistent-item.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, PersistentItemService) {
    const router = new Router({prefix: '/persistentItems'});

    router.post('/addPersistentItem', async(ctx, next) => {
        await validateRequest(ctx, persistentItemValidation.addPersistentItem, async() => {
            const persistentItem = ctx.request.body;
            const accessControl = {
                Resource: "PersistentItem", Action: "addPersistentItem",
                TargetId: persistentItem['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await PersistentItemService.addPersistentItem(persistentItem);

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

    router.get('/getPersistentItemsByLocationId', async(ctx, next) => {
        await validateRequest(ctx, persistentItemValidation.getPersistentItemsByLocationId, async() => {
            const id = parseInt(ctx.query['locationId']);
            const accessControl = {
                Resource: "PersistentItem", Action: "getPersistentItemsByLocationId",
                TargetId: id, EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await PersistentItemService.getPersistentItemsByLocationId(id);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updatePersistentItem', async(ctx, next) => {
        await validateRequest(ctx, persistentItemValidation.updatePersistentItem, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "PersistentItem", Action: "updatePersistentItem",
                TargetId: data['persistentItem']['id'], EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await PersistentItemService.updatePersistentItem(data['persistentItem']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deletePersistentItem', async(ctx, next) => {
        await validateRequest(ctx, persistentItemValidation.deletePersistentItem, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "PersistentItem", Action: "deletePersistentItem",
                TargetId: id, EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await PersistentItemService.deletePersistentItem(id);

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