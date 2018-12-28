"use strict";
const validate = require('../../../core/validation');

exports.getUserSettingsByUserId = function(request) {
    const query = request.query;
    const schema = {
        userId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(query, schema);
};

exports.upsertUserSettings = function(request) {
    const body = request.body;
    const schema = {
        userId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        showShortageLogs: {
            presence: true,
            boolean: true
        },
        showProductionDetails: {
            presence: true,
            boolean: true
        },
        showCost: {
            presence: true,
            boolean: true
        },
        showPreConsumer: {
            presence: true,
            boolean: true
        },
        showPostConsumer: {
            presence: true,
            boolean: true
        },
        hasTwoPageTracker: {
            presence: true,
            boolean: true
        },
        defaultAction: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            },
        },
        defaultLossReason: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            },
        }
    };

    return validate(body, schema)
};

exports.deleteUserSettings = function(request) {
    const query = request.query;
    const schema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(query, schema);
};