'use strict';
const Router = require('koa-router');

module.exports = function() {
    const router = new Router({prefix: '/'});
    const packageJson = require('../../../../package.json');

    router.get('', (ctx, next) => {
        ctx['status'] = 200;
        ctx['body'] = {
            status: "Phood API Server is available.",
            version: packageJson.version
        };
    });

    return router;
};