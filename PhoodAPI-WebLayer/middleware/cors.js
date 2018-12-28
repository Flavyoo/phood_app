'use strict';
const config = require('../../core/system-config');
const cors = require('@koa/cors');

const options = config.get("security.cors") || {};

module.exports = cors(options);