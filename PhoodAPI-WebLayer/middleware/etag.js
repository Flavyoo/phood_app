'use strict';
const generateETag = require('etag');

module.exports = async function(ctx, next) {
    await next();

    if (ctx.method === "GET" && Math.floor(ctx.status / 100) === 2 && ctx.body) {
        const eTag = generateETag(JSON.stringify(ctx.body));
        ctx.etag = eTag;

        if (ctx.headers["if-none-match"] && ctx.headers["if-none-match"] === eTag) {
            ctx.body = null;
            ctx.status = 304
        }
    }
};