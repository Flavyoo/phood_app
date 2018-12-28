"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const stationValidation = require('./station.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, StationService) {
    const router = new Router({prefix: '/stations'});

    router.post('/addStation', async(ctx, next) => {
        await validateRequest(ctx, stationValidation.addStation, async() => {
            const station = ctx.request.body;
            const accessControl = {
                Resource: "Station", Action: "addStation",
                TargetId: station['locationId'], EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await StationService.addStation(station);

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

    router.get('/getStationsByLocationId', async(ctx, next) => {
        await validateRequest(ctx, stationValidation.getStationsByLocationId, async() => {
            const id = parseInt(ctx.query['locationId']);
            const accessControl = {
                Resource: "Station", Action: "getStationsByLocationId",
                TargetId: id, EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await StationService.getStationsByLocationId(id);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/updateStation', async(ctx, next) => {
        await validateRequest(ctx, stationValidation.updateStation, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "Station", Action: "updateStation",
                TargetId: data['station']['id'], EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await StationService.updateStation(data['station']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteStation', async(ctx, next) => {
        await validateRequest(ctx, stationValidation.deleteStation, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "Station", Action: "deleteStation",
                TargetId: id, EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await StationService.deleteStation(id);

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