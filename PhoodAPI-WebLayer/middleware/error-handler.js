'use strict';
const Logger = require('../../../server/core/logging').WebAPI;

module.exports = async function(ctx, next) {
    try {
        await next();
    } catch (err) {
        ctx.status = 500;
        ctx.body = "Internal Server Error";
        Logger.error("Unexpected error during api request");
        Logger.error(err);
    }
};