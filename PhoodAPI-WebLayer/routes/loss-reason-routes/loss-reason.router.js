"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const lossReasonValidation = require('./loss-reason.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, LossReasonService) {
    const router = new Router({prefix: '/lossReasons'});

    router.post('/addLossReason', async(ctx, next) => {
        await validateRequest(ctx, lossReasonValidation.addLossReason, async() => {
            const lossReason = ctx.request.body;
            const accessControl = {
                Resource: "LossReason", Action: "addLossReason",
                TargetId: lossReason['organizationId'], EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await LossReasonService.addLossReason(lossReason);

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

    router.get('/getLossReasonsByOrganizationId', async(ctx, next) => {
        await validateRequest(ctx, lossReasonValidation.getLossReasonsByOrganizationId, async() => {
            const id = parseInt(ctx.query['organizationId']);
            const accessControl = {
                Resource: "LossReason", Action: "getLossReasonsByOrganizationId",
                TargetId: id, EntityType: "Organization", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await LossReasonService.getLossReasonsByOrganizationId(id);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updateLossReason', async(ctx, next) => {
        await validateRequest(ctx, lossReasonValidation.updateLossReason, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "LossReason", Action: "updateLossReason",
                TargetId: data['lossReason']['id'], EntityType: "Organization", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await LossReasonService.updateLossReason(data['lossReason']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteLossReason', async(ctx, next) => {
        await validateRequest(ctx, lossReasonValidation.deleteLossReason, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "LossReason", Action: "deleteLossReason",
                TargetId: id, EntityType: "Organization", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await LossReasonService.deleteLossReason(id);

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