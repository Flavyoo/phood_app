"use strict";
const validate = require('../../../core/validation');

exports.addStation = function(request) {
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
        locationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(body, schema)
};

exports.getStationsByLocationId = function(request) {
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

exports.updateStation = function(request) {
    const body = request.body;
    const stationSchema = {
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

    return validate(body['station'], stationSchema)
};

exports.deleteStation = function(request) {
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