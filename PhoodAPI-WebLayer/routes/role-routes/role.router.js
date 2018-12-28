'use strict';
const Router = require('koa-router');
const AppErrors = require('../../../core/application-errors');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const roleValidation = require('./role.validation');

module.exports = function(AuthService, RoleService) {
    const router = new Router({prefix: '/roles'});

    router.post('/addRole', async(ctx, next) => {
        await validateRequest(ctx, roleValidation.addRole, async() => {
            const accessControl = {
                Resource: "Role", Action: "addRole"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const role = ctx.request.body;
                    const result = await RoleService.addRole(role);

                    ctx['status'] = 201;
                    ctx['body'] = result;
                } catch (err) {
                    if (err instanceof AppErrors.ForeignKeyConstraintError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Foreign Key Error: Invalid entityId"
                        };
                    } else if (err instanceof AppErrors.InvalidRoleError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Invalid Role Error",
                            msg: err.message
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    router.post('/addSubAccountRole', async(ctx, next) => {
        await validateRequest(ctx, roleValidation.addSubAccountRole, async() => {
            const role = ctx.request.body;
            const allowedRoles = ["ViewLocation", "ManageLocation", "ViewOrganization", "ManageOrganization"];
            const allowedEntities = ["User", "Location", "Organization"];

            if (!allowedRoles.includes(role['roleName'])) {
                ctx['status'] = 409;
                ctx['body'] = {
                    error: "Invalid Role Error",
                    msg: `Role '${role['roleName']}' is not allowed.`
                };
            } else if (!allowedEntities.includes(role['entityType'])) {
                ctx['status'] = 409;
                ctx['body'] = {
                    error: "Invalid Role Error",
                    msg: `EntityType '${role['entityType']}' is not allowed.`
                };
            } else {
                const targetEntityAC = {
                    Resource: "Role", Action: "addSubAccountRole",
                    TargetId: role['entityId'], EntityType: role['entityType'], IsOwnerId: true
                };
                const targetUserAC = {
                    Resource: "Role", Action: "addSubAccountRole",
                    TargetId: role['userId'], EntityType: "User", IsOwnerId: true
                };
                await authRequest(ctx, AuthService, {accessControl: [targetEntityAC, targetUserAC]}, async() => {
                    try {
                        const result = await RoleService.addRole(role);

                        ctx['status'] = 201;
                        ctx['body'] = result;
                    } catch (err) {
                        if (err instanceof AppErrors.InvalidRoleError) {
                            ctx['status'] = 409;
                            ctx['body'] = {
                                error: "Invalid Role Error",
                                msg: err.message
                            };
                        } else {
                            throw err
                        }
                    }
                });
            }
        });
    });

    router.post('/addAdminRole', async(ctx, next) => {
        await validateRequest(ctx, roleValidation.addAdminRole, async() => {
            const accessControl = {
                Resource: "Role", Action: "addAdminRole"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const role = ctx.request.body;
                    const result = await RoleService.addAdminRole(role);

                    ctx['status'] = 201;
                    ctx['body'] = result;
                } catch (err) {
                    if (err instanceof AppErrors.InvalidRoleError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Invalid Role Error",
                            msg: err.message
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    router.get('/getUserRoles', async(ctx, next) => {
        await validateRequest(ctx, roleValidation.getUserRoles, async() => {
            const userId = parseInt(ctx.query['userId']);
            const accessControl = {
                Resource: "Role", Action: "getUserRoles",
                TargetId: userId, EntityType: "User", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await RoleService.getUserRoles(userId);

                ctx['status'] = 200;
                ctx['body'] = result;
            });
        });
    });

    router.delete('/deleteRole', async(ctx, next) => {
        await validateRequest(ctx, roleValidation.deleteRole, async() => {
            const accessControl = {
                Resource: "Role", Action: "deleteRole"
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const id = parseInt(ctx.query['id']);
                    const result = await RoleService.deleteRole(id, ctx.query['entityType']);

                    if (result) {
                        ctx['status'] = 200;
                    } else {
                        ctx['status'] = 409;
                    }
                } catch (err) {
                    if (err instanceof AppErrors.InvalidRoleError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Invalid Role Error",
                            msg: err.message
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    router.delete('/deleteSubAccountRole', async(ctx, next) => {
        await validateRequest(ctx, roleValidation.deleteSubAccountRole, async() => {
            const id = parseInt(ctx.query['id']);
            const roleEntity = ctx.query['entityType'];
            const accessControl = {
                Resource: "Role", Action: "deleteSubAccountRole",
                TargetId: id, EntityType: "User", IsOwnerId: false, RoleEntity: roleEntity
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await RoleService.deleteRole(id, roleEntity);

                    if (result) {
                        ctx['status'] = 200;
                    } else {
                        ctx['status'] = 409;
                    }
                } catch (err) {
                    if (err instanceof AppErrors.InvalidRoleError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Invalid Role Error",
                            msg: err.message
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    return router;
};