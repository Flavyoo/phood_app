'use strict';
const validate = require('../../../core/validation');

exports.requestResetToken = function(request) {
    const body = request.body;
    const schema = {
        username: {
            presence: true,
            length: {
                minimum: 4,
                maximum: 50,
                wrongLength: "must be between 4 and 50 characters."
            },
            format: {
                pattern: "[a-z][a-z0-9]*",
                flags: "i",
                message: "must begin with a letter and can only contain a-z and 0-9."
            }
        }
    };

    return validate(body, schema)
};

exports.resetPassword = function(request) {
    const body = request.body;
    const schema = {
        token: {
            presence: true
        },
        password: {
            presence: true,
            length: {
                minimum: 10,
                maximum: 100,
                wrongLength: "must be between 10 and 100 characters."
            },
            format: {
                pattern: "[a-z0-9!\"#$%&'\\(\\)\\*\\+,\\-.\\/:;<=>?@[\\]\\^_`{|}~]*",
                flags: "i",
                message: "can only contain a-z, 0-9 and special characters."
            }
        }
    };

    return validate(body, schema)
};