"use strict";
const validate = require('../../../core/validation');

exports.addLossReason = function(request) {
    const body = request.body;
    const schema = {
        name: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        organizationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(body, schema)
};

exports.getLossReasonsByOrganizationId = function(request) {
    const query = request.query;
    const schema = {
        organizationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(query, schema);
};

exports.updateLossReason = function(request) {
    const body = request.body;
    const lossReasonSchema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        name: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        }
    };

    return validate(body['lossReason'], lossReasonSchema);
};

exports.deleteLossReason = function(request) {
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