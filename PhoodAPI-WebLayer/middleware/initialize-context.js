'use strict';

// NOTE: This middleware must be listed first in order to initialize context variables.
module.exports = async function(ctx, next) {
    // Initialize 'Phood' object for system use.
    ctx['Phood'] = {
        authorization: ctx.headers['authorization']     // Extract sessionId from auth header.
    };

    await next();
};