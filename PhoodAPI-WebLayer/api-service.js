"use strict";
const Koa = require('koa');
const https = require('https');
const logger = require('../../server/core/logging').System;
const fs = require('fs');

exports.createListener = async function(config, middleware, routers) {
    const app = new Koa();
    const port = config['port'];

    try {
        logger.info(`Starting Web API HTTP Listener on port: ${port}.`);

        if (middleware) {
            logger.info("Registering middleware.");
            middleware.forEach(function(mw) {
                app.use(mw);
            })
        }
        if (routers) {
            logger.info("Binding routes to listener.");
            routers.forEach(router => {
                app.use(router.routes());
                app.use(router.allowedMethods());
            })
        }

        const httpsOptions = {
            key: fs.readFileSync('./server-key.pem'),
            cert: fs.readFileSync('./server-crt.pem')
        };

        app['httpServer'] = await new Promise((resolve, reject) => {
            https.createServer(httpsOptions, app.callback()).listen(443)
                .on('listening', function() {
                    resolve(this)
                })
                .on('error', (err) => {
                    reject(err)
                });
        });

        logger.info(`Web API started (listening on port ${port}).`);
        return app;
    } catch (err) {
        logger.error(`Unable to start Web API Listener.`);
        logger.error(err);

        throw new Error("Web API Error");
    }
};