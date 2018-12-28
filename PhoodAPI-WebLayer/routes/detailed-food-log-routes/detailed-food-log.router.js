"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const detailedFoodLogValidation = require('./detailed-food-log.validation');

module.exports = function(AuthService, DetailedFoodLogService) {
    const router = new Router({prefix: '/detailedFoodLogs'});

    // Note: This set to post since arrays don't work well inside the query.
    router.post('/getDetailedFoodLogs', async(ctx, next) => {
        await validateRequest(ctx, detailedFoodLogValidation.getDetailedFoodLogs, async() => {
            const body = ctx.request.body;
            const ids = body['locationIds'].map(id => parseInt(id));
            const accessControls = ids.map(id => {
                return {
                    Resource: "DetailedFoodLog", Action: "getDetailedFoodLogs",
                    TargetId: id, EntityType: "Location", IsOwnerId: true
                }
            });
            await authRequest(ctx, AuthService, {accessControl: accessControls}, async() => {
                const result = await DetailedFoodLogService.getDetailedFoodLogs(body['startDate'], body['endDate'], ids);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    return router;
};