'use strict';
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const RecentActivityValidation = require('./recent-activity.validation');

module.exports = function(AuthService, RecentActivityService) {
    const router = new Router({prefix: '/recentActivity'});

    router.get('/getLocationDetails', async(ctx, next) => {
        const accessControl = {
            Resource: "RecentActivity", Action: "getLocationDetails"
        };
        await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
            const result = await RecentActivityService.getLocationDetails();

            if (result.length > 0) {
                ctx['status'] = 200;
                ctx['body'] = result;
            } else {
                ctx['status'] = 204;
            }
        });
    });

    router.get('/getMostRecentLogs', async(ctx, next) => {
        const accessControl = {
            Resource: "RecentActivity", Action: "getMostRecentLogs"
        };
        await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
            const result = await RecentActivityService.getMostRecentLogs();

            if (result.length > 0) {
                ctx['status'] = 200;
                ctx['body'] = result;
            } else {
                ctx['status'] = 204;
            }
        });
    });

    router.get('/getMenuCounts', async(ctx, next) => {
        await validateRequest(ctx, RecentActivityValidation.getMenuCounts, async() => {
            const data = ctx.query;
            const accessControl = {
                Resource: "RecentActivity", Action: "getMenuCounts"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await RecentActivityService.getMenuCounts(data['date']);

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