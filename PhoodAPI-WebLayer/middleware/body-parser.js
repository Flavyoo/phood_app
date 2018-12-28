'use strict';
const bodyParser = require('koa-bodyparser');
const config = require('../../core/system-config');

const options = config.get("web-api.body-parser") || {};

module.exports = bodyParser(options);