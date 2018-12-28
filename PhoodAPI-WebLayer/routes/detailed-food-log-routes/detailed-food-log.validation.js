"use strict";
const validate = require('../../../core/validation');

exports.getDetailedFoodLogs = function(request) {
    const errors = [];
    const body = request.body;
    const schema = {
        locationIds: {
            presence: true
        },
        startDate: {
            presence: true,
            datetime: true
        },
        endDate: {
            presence: true,
            datetime: true
        }
    };

    const check1 = validate(body, schema);
    if (check1) {
        errors.push(check1)
    }
    if (validate.isArray(body.locationIds)) {
        let idErrors = [];
        const ids = body.locationIds;
        for (let i = 0; i < ids.length; i++) {
            const check2 = validate.isInteger(ids[i]);
            if (!check2) {
                idErrors[i] = {id: ids[i], err: "value must be an integer"}
            }
        }

        if (Object.keys(idErrors).length > 0) {
            errors.push(idErrors)
        }
    } else {
        errors.push("locationIds must be an array.");
    }

    if (errors.length > 0) {
        return errors;
    } else {
        return undefined
    }
};