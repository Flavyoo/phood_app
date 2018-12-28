'use strict';
const Router = require('koa-router');
const validateRequest = require('../../directives/request-validation');
const resetValidation = require('./password-reset.validation');
const emailTemplates = require('./password-reset.templates');

module.exports = function(PasswordResetService, SystemEmail) {
    const router = new Router({prefix: '/passwordReset'});

    router.post('/requestResetToken', async(ctx, next) => {
        await validateRequest(ctx, resetValidation.requestResetToken, async() => {
            const username = ctx.request.body.username;
            const reset = await PasswordResetService.requestResetToken(username);
            if (reset) {
                const NoReplySender = SystemEmail.getSenderAddress("no-reply");
                const message = emailTemplates.ResetTokenEmail(NoReplySender, reset.email, reset.tokenObj.token);
                const result = await SystemEmail.sendEmail(message);

                if (result) {
                    ctx['status'] = 201;
                } else {
                    ctx['status'] = 500;
                    ctx['body'] = {
                        error: "Error sending reset email."
                    };
                }
            } else {
                ctx['status'] = 201;
            }
        });
    });

    router.post('/resetPassword', async(ctx, next) => {
        await validateRequest(ctx, resetValidation.resetPassword, async() => {
            const resetRequest = ctx.request.body;
            const result = await PasswordResetService.resetPassword(resetRequest.token, resetRequest.newPassword);

            if (result) {
                ctx['status'] = 200;
            } else {
                ctx['status'] = 409;
                ctx['body'] = {
                    error: "Invalid or expired token"
                };
            }
        });
    });

    return router;
};