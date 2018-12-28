'use strict';

module.exports = async function(ctx, authService, options, successFunction) {
    const authHeader = ctx['Phood'].authorization;

    // Check for missing auth header
    if (!authHeader) {
        ctx.body = {error: "Missing Auth Header"};
        ctx['status'] = 401;

        return;
    }

    // Check for malformed session id
    if (!authService.checkSessionStringFormat(authHeader)) {
        ctx.body = {error: "Malformed Session Id"};
        ctx['status'] = 401;

        return;
    }

    // Authenticate session
    const session = await authService.authenticate(authHeader, options['confirmPassword']);
    if (session === 0) {
        ctx.body = {error: "Invalid Session Id"};
        ctx['status'] = 401;

        return;
    } else if (session === 1) {
        ctx.body = {error: "Free Trial Ended"};
        ctx['status'] = 401;

        return;
    } else if (session === 2) {
        ctx.body = {error: "Invalid Password"};
        ctx['status'] = 401;

        return;
    }

    // Check for access control
    const accessControl = options['accessControl'];
    if (!accessControl) {
        await successFunction()
    }

    // Authorize request
    let authorized = true;
    if (Array.isArray(accessControl)) {
        for (let i = 0; i < accessControl.length; i++) {
            const result = await authService.authorize(session, accessControl[i]);

            if (!result) {
                authorized = false;
                break;
            }
        }
    } else {
        authorized = await authService.authorize(session, accessControl);
    }

    // Check if requester is authorized
    if (!authorized) {
        ctx.body = {error: "Forbidden"};
        ctx['status'] = 403;

        return;
    }

    ctx['Phood'].session = session;
    await successFunction();
};