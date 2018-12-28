"use strict";
const Router = require('koa-router');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const usValidation = require('./user-settings.validation');
const AppErrors = require('../../../core/application-errors');

module.exports = function(AuthService, UserSettingsService) {
    const router = new Router({prefix: '/userSettings'});

    router.get('/getUserSettingsByUserId', async(ctx, next) => {
        await validateRequest(ctx, usValidation.getUserSettingsByUserId, async() => {
            const id = parseInt(ctx.query['userId']);
            const accessControl = {
                Resource: "UserSettings", Action: "getUserSettingsByUserId",
                TargetId: id, EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await UserSettingsService.getUserSettingsByUserId(id);

                if (result) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.put('/upsertUserSettings', async(ctx, next) => {
        await validateRequest(ctx, usValidation.upsertUserSettings, async() => {
            const userSettings = ctx.request.body;
            let accessControl;
            // If a resource id is present, assume update. Otherwise assume new entry creation.
            if (userSettings['id']) {
                accessControl = {
                    Resource: "UserSettings", Action: "upsertUserSettings",
                    TargetId: userSettings['id'], EntityType: "User", IsOwnerId: false
                };
            } else {
                accessControl = {
                    Resource: "UserSettings", Action: "upsertUserSettings",
                    TargetId: parseInt(userSettings['userId']), EntityType: "User", IsOwnerId: true
                };
            }
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await UserSettingsService.upsertUserSettings(userSettings);

                    if (result === 1) {
                        ctx['status'] = 201;
                    } else if (result === 0) {
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

    router.delete('/deleteUserSettings', async(ctx, next) => {
        await validateRequest(ctx, usValidation.deleteUserSettings, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "UserSettings", Action: "deleteUserSettings"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await UserSettingsService.deleteUserSettings(id);

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