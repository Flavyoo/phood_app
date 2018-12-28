'use strict';
const Router = require('koa-router');
const AppErrors = require('../../../core/application-errors');
const authRequest = require('../../directives/request-auth');
const validateRequest = require('../../directives/request-validation');
const employeeValidation = require('./client-employee.validation');

module.exports = function(AuthService, ClientEmployeeService) {
    const router = new Router({prefix: '/clientEmployees'});

    router.post('/addEmployee', async(ctx, next) => {
        await validateRequest(ctx, employeeValidation.addEmployee, async() => {
            const employee = ctx.request.body;
            const accessControl = {
                Resource: "ClientEmployee", Action: "addEmployee",
                TargetId: parseInt(employee.location), EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                try {
                    const result = await ClientEmployeeService.addEmployee(employee);

                    ctx['status'] = 201;
                    ctx['body'] = result;
                } catch (err) {
                    if (err instanceof AppErrors.ForeignKeyConstraintError) {
                        ctx['status'] = 409;
                        ctx['body'] = {
                            error: "Foreign key constraint violation"
                        };
                    } else {
                        throw err
                    }
                }
            });
        });
    });

    router.get('/getEmployeesByLocationId', async(ctx, next) => {
        await validateRequest(ctx, employeeValidation.getEmployeesByLocationId, async() => {
            const id = parseInt(ctx.query['locationId']);
            const accessControl = {
                Resource: "ClientEmployee", Action: "getEmployeesByLocationId",
                TargetId: id, EntityType: "Location", IsOwnerId: true
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await ClientEmployeeService.getEmployeesByLocationId(id);

                if (result.length > 0) {
                    ctx['status'] = 200;
                    ctx['body'] = result;
                } else {
                    ctx['status'] = 204;
                }
            });
        });
    });

    router.delete('/deleteEmployee', async(ctx, next) => {
        await validateRequest(ctx, employeeValidation.deleteEmployee, async() => {
            const id = parseInt(ctx.query['id']);
            const accessControl = {
                Resource: "ClientEmployee", Action: "deleteEmployee",
                TargetId: id, EntityType: "Location", IsOwnerId: false
            };
            await authRequest(ctx, AuthService, {accessControl: accessControl}, async() => {
                const result = await ClientEmployeeService.deleteEmployee(id);

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