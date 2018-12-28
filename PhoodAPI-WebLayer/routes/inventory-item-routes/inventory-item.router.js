"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const inventoryItemValidation = require('./inventory-item.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, InventoryItemService) {
    const router = new Router({prefix: '/inventoryItems'});

    router.post('/addInventoryItem', async(ctx, next) => {
        await validateRequest(ctx, inventoryItemValidation.addInventoryItem, async() => {
            const invItem = ctx.request.body;
            const accessControl = {
                Resource: "InventoryItem", Action: "addInventoryItem",
                TargetId: invItem['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await InventoryItemService.addInventoryItem(invItem);

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

    router.get('/getInventoryItemsByLocationId', async(ctx, next) => {
        await validateRequest(ctx, inventoryItemValidation.getInventoryItemsByLocationId, async() => {
            const id = parseInt(ctx.query['locationId']);
            const accessControl = {
                Resource: "InventoryItem", Action: "getInventoryItemsByLocationId",
                TargetId: id, EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await InventoryItemService.getInventoryItemsByLocationId(id);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updateInventoryItem', async(ctx, next) => {
        await validateRequest(ctx, inventoryItemValidation.updateInventoryItem, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "InventoryItem", Action: "updateInventoryItem",
                TargetId: data['inventoryItem']['id'], EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await InventoryItemService.updateInventoryItem(data['inventoryItem']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteInventoryItem', async(ctx, next) => {
        await validateRequest(ctx, inventoryItemValidation.deleteInventoryItem, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "InventoryItem", Action: "deleteInventoryItem",
                TargetId: id, EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await InventoryItemService.deleteInventoryItem(id);

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