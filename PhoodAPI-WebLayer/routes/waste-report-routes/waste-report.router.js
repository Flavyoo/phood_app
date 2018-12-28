"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const wrValidation = require('./waste-report.validation');

module.exports = function(AuthService, WasteReport) {
    const router = new Router({prefix: '/wasteReports'});

    router.post('/generateReport', async(ctx, next) => {
        await validateRequest(ctx, wrValidation.generateReport, async() => {
            const body = ctx.request.body;
            const ids = body['locationIds'].map(id => parseInt(id));
            const accessControls = ids.map(id => {
                return {
                    Resource: "WasteReport", Action: "generateReport",
                    TargetId: id, EntityType: "Location", IsOwnerId: true
                }
            });
            await authRequest(ctx, AuthService, {accessControl: accessControls}, async() => {
                const result = await WasteReport.generateReport(body['startDate'], body['endDate'], ids, body['reportMetrics']);

                if (Object.keys(result).length) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/listReportMetrics', async(ctx, next) => {
        const result = WasteReport.listReportMetrics();

        ctx['status'] = 200;
        ctx['body'] = result;
    });

    return router;
};