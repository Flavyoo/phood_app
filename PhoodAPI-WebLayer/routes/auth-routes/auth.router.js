'use strict';
const Router = require('koa-router');
const validateRequest = require('../../directives/request-validation');
const authValidation = require('./auth.validation');

module.exports = function(AuthService, UserService, RoleService) {
    const router = new Router({
        prefix: '/auth'
    });

    router.post('/login', async(ctx, next) => {
        await validateRequest(ctx, authValidation.login, async() => {
            const data = ctx.request.body;
            const session = await AuthService.login(data['username'], data['password']);

            if (session === 0 || session === 2) {
                ctx.set("WWWW-Authentication", "Basic");
                ctx['status'] = 401;
            } else if (session === 1) {
                ctx['status'] = 401;
                ctx['body'] = {
                    error: "Authentication Failure: Account is inactive"
                };
            } else if (session === 3) {
                ctx['status'] = 401;
                ctx['body'] = {
                    error: "Authentication Failure: Free trail ended"
                };
            } else {
                const sessionString = `${session.id}:${session.sessionId}`;
                const user = await UserService.getUserById(session.userId);
                // Remove pw hash from result
                delete user.passwordHash;
                const roles = await RoleService.getUserRoles(session.userId);

                ctx.set("authorization", sessionString);
                ctx['status'] = 200;
                ctx['body'] = {user: user, roles: roles};
            }
        });
    });

    router.post('/logout', async(ctx, next) => {
        const authHeader = ctx['Phood'].authorization;

        if (authHeader) {
            const valid = AuthService.checkSessionStringFormat(authHeader);

            if (valid) {
                const result = await AuthService.logout(authHeader);

                if (result) {
                    ctx['status'] = 200;
                } else {
                    ctx['status'] = 409;
                    ctx['body'] = {
                        error: "Error logging out"
                    };
                }
            } else {
                ctx['status'] = 409;
                ctx['body'] = {
                    error: "Invalid Session Id"
                };
            }
        } else {
            ctx['status'] = 409;
            ctx['body'] = {
                error: "Missing Authorization Header"
            };
        }
    });

    router.get('/validateSession', async function(ctx, next) {
        const authHeader = ctx['Phood'].authorization;

        if (authHeader) {
            const valid = AuthService.checkSessionStringFormat(authHeader);

            if (valid) {
                const result = await AuthService.authenticate(authHeader);

                if (result === 0 || result === 2) {
                    ctx['status'] = 401;
                } else if (result === 1) {
                    ctx['status'] = 401;
                    ctx['body'] = {
                        error: "Authentication Failure: Free trail ended"
                    };
                } else {
                    ctx['status'] = 200;
                }
            } else {
                ctx['status'] = 409;
                ctx['body'] = {
                    error: "Invalid Session Id"
                };
            }
        } else {
            ctx['status'] = 409;
            ctx['body'] = {
                error: "Missing Authorization Header"
            };
        }
    });

    return router;
};