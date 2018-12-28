"use strict";
const validate = require('../../../core/validation');

exports.generateReport = function(request) {
    const errors = [];
    const body = request.body;
    const schema = {
        locationIds: {
            presence: true
        },
        startDate: {
            presence: true,
            datetime: {
                dateOnly: true
            }
        },
        endDate: {
            presence: true,
            datetime: {
                dateOnly: true
            }
        },
        reportMetrics: {
            presence: true
        }
    };

    const check = validate(body, schema);
    if (check) {
        errors.push(check)
    }
    if (!validate.isArray(body.locationIds)) {
        errors.push("locationIds must be an array.");
    }
    if (!validate.isObject(body.reportMetrics)) {
        errors.push("reportMetrics must be an object.");
    }

    if (errors.length > 0) {
        return errors;
    } else {
        return undefined
    }
};