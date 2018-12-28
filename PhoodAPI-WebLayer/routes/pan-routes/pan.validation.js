"use strict";
const validate = require('../../../core/validation');

exports.addPan = function(request) {
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
        },
        weightQuantity: {
            presence: true,
            numericality: true
        },
        weightUnit: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        }
    };

    return validate(body, schema)
};

exports.getPansByOrganizationId = function(request) {
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

exports.updatePan = function(request) {
    const body = request.body;
    const panSchema = {
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
        },
        weightQuantity: {
            presence: true,
            numericality: true
        },
        weightUnit: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        }
    };

    return validate(body['pan'], panSchema)
};

exports.deletePan = function(request) {
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