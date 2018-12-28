'use strict';
const validate = require('../../../core/validation');

exports.addEmployee = function(request) {
    const body = request.body;
    const schema = {
        name: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        locationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(body, schema)
};

exports.getEmployeesByLocationId = function(request) {
    const query = request.query;
    const schema = {
        locationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(query, schema);
};

exports.deleteEmployee = function(request) {
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