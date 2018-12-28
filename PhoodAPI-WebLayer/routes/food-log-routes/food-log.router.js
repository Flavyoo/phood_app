"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const foodLogValidation = require('./food-log.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, FoodLogService) {
    const router = new Router({prefix: '/foodLogs'});

    router.post('/addFoodLog', async(ctx, next) => {
        await validateRequest(ctx, foodLogValidation.addFoodLog, async() => {
            const foodLog = ctx.request.body;
            const accessControl = {
                Resource: "FoodLog", Action: "addFoodLog",
                TargetId: foodLog['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await FoodLogService.addFoodLog(foodLog);

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

    router.get('/getLocationFoodLogs', async(ctx, next) => {
        await validateRequest(ctx, foodLogValidation.getLocationFoodLogs, async() => {
            const data = ctx.query;
            const accessControl = {
                Resource: "FoodLog", Action: "getLocationFoodLogs",
                TargetId: data['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await FoodLogService.getLocationFoodLogs(parseInt(data['locationId']), data['startDate'], data['endDate']);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updateFoodLog', async(ctx, next) => {
        await validateRequest(ctx, foodLogValidation.updateFoodLog, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "FoodLog", Action: "updateFoodLog",
                TargetId: data['foodLog']['id'], EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await FoodLogService.updateFoodLog(data['foodLog']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteFoodLog', async(ctx, next) => {
        await validateRequest(ctx, foodLogValidation.deleteFoodLog, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "FoodLog", Action: "deleteFoodLog",
                TargetId: id, EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await FoodLogService.deleteFoodLog(id);

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