"use strict";
const validate = require('../../../core/validation');

exports.getMenuCounts = function(request) {
    const query = request.query;
    const schema = {
        date: {
            presence: true,
            datetime: {
                dateOnly: true
            }
        }
    };

    return validate(query, schema);
};
