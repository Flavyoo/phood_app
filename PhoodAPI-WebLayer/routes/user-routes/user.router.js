'use strict';
const Router = require('koa-router');
const AppErrors = require('../../../core/application-errors');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const userValidation = require('./user.validation');

module.exports = function(AuthService, UserService) {
    const router = new Router({prefix: '/users'});

    router.post('/createPrimaryAccount', async(ctx, next) => {
        await validateRequest(ctx, userValidation.createPrimaryAccount, async() => {
            const accessControl = {
                Resource: "User", Action: "createPrimaryAccount"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const user = ctx.request.body;
                    user.parentId = null;
                    user.paidAccount = (user.paidAccount) ? user.paidAccount : true; // todo: remove default value in the future.
                    const result = await UserService.addUser(user);

                    ctx['status'] = 201;
                    ctx['body'] = result;
                } catch (err) {
                    if (err instanceof AppErrors.UniqueConstraintError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Unique constraint violation",
                            fields: err.fields
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    router.post('/createSubAccount', async(ctx, next) => {
        await validateRequest(ctx, userValidation.createSubAccount, async() => {
            const user = ctx.request.body;
            const accessControl = {
                Resource: "User", Action: "createSubAccount",
                TargetId: parseInt(user.parentId), EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    user.paidAccount = null;
                    const result = await UserService.addUser(user);

                    ctx['status'] = 201;
                    ctx['body'] = result;
                } catch (err) {
                    if (err instanceof AppErrors.UniqueConstraintError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Unique constraint violation",
                            fields: err.fields
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    router.get('/getUserById', async(ctx, next) => {
        await validateRequest(ctx, userValidation.getUserById, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "User", Action: "getUserById",
                TargetId: id, EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                let result = await UserService.getUserById(id);

                if (result) {
                    // Remove pw hash from result
                    delete result.passwordHash;

                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/getUserByName', async(ctx, next) => {
        await validateRequest(ctx, userValidation.getUserByName, async() => {
            const accessControl = {
                Resource: "User", Action: "getUserByName"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                let result = await UserService.getUserByName(ctx.query['name']);

                if (result) {
                    // Remove pw hash from result
                    delete result.passwordHash;

                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/getSubAccountList', async(ctx, next) => {
        await validateRequest(ctx, userValidation.getSubAccountList, async() => {
            const id = parseInt(ctx.query['parentId']);
            const accessControl = {
                Resource: "User", Action: "getSubAccountList",
                TargetId: id, EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await UserService.getSubAccountList(id);

                if (result.length > 0) {
                    const users = result.map(function(user) {
                        delete user.passwordHash;

                        return user;
                    });

                    ctx['status'] = 200;
                    ctx['body'] = users;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.get('/getUserList', async(ctx, next) => {
        await validateRequest(ctx, userValidation.getUserList, async() => {
            const onlyPrimary = (ctx.query['onlyPrimary'] === "true");
            const accessControl = {
                Resource: "User", Action: "getUserList"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await UserService.getUserList(onlyPrimary);

                if (result) {
                    const users = result.map(function(user) {
                        delete user.passwordHash;

                        return user;
                    });

                    ctx['status'] = 200;
                    ctx['body'] = users;
                } else {
                    ctx['status'] = 204;
                }
            });
        })
    });

    router.put('/updateUserInfo', async(ctx, next) => {
        await validateRequest(ctx, userValidation.updateUserInfo, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "User", Action: "updateUserInfo",
                TargetId: data['user']['id'], EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await UserService.updateUserInfo(data['user']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.put('/changePassword', async(ctx, next) => {
        await validateRequest(ctx, userValidation.changePassword, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "User", Action: "changePassword",
                TargetId: data['userId'], EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {
                accessControl: accessControl,
                confirmPassword: data['confirmPassword']
            }, async() => {
                const result = await UserService.changePassword(data['userId'], data['newPassword']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.put('/setActiveStatus', async(ctx, next) => {
        await validateRequest(ctx, userValidation.setActiveStatus, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "User", Action: "setActiveStatus",
                TargetId: data['userId'], EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await UserService.setActiveStatus(data['userId'], data['active']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.put('/setTrialStatus', async(ctx, next) => {
        await validateRequest(ctx, userValidation.setTrialStatus, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "User", Action: "setTrialStatus",
                TargetId: data['userId'], EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await UserService.setTrialStatus(data['userId'], data['paidAccount'], data['freeTrialEnd']);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                }
            });
        });
    });

    router.delete('/deleteUser', async(ctx, next) => {
        await validateRequest(ctx, userValidation.deleteUser, async() => {
            const accessControl = {
                Resource: "User", Action: "deleteUser"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const id = parseInt(ctx.query['id']);
                    const result = await UserService.deleteUser(id);

                    if (result) {
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

    /*
    Temporary validation code for admin override password reset.
    todo: Replace with proper password reset.
    */
    router.post('/adminResetPassword', async(ctx, next) => {
        await validateRequest(ctx, userValidation.adminResetPassword, async() => {
            const data = ctx.request.body;
            const accessControl = {
                Resource: "User", Action: "adminResetPassword"
            };
            await authRequest(ctx, AuthService, {
                accessControl: accessControl
            }, async() => {
                const result = await UserService.changePassword(data['userId'], data['newPassword']);

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