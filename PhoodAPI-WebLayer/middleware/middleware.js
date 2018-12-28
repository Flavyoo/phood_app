'use strict';
const bodyParser = require('./body-parser');
const cors = require('./cors');
const errorHandler = require('./error-handler');
const etag = require('./etag');
const initializeContext = require('./initialize-context');

module.exports = [
    errorHandler,       // Must be listed first in order to handle any internal errors.
    initializeContext,  // Is listed second in order to provide context values to future middleware.
    cors,
    bodyParser,
    etag
];