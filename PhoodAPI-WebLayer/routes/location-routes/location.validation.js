"use strict";
const validate = require('../../../core/validation');

exports.addLocation = function(request) {
    const body = request.body;
    const schema = {
        name: {
            presence: true,
            length: {
                minimum: 3,
                maximum: 100,
                wrongLength: "must be between 3 and 100 characters."
            }
        },
        alias: {
            length: {
                minimum: 3,
                maximum: 100,
                wrongLength: "must be between 3 and 100 characters."
            }
        },
        organizationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        timezoneOffset: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        active: {
            presence: true,
            boolean: true
        }
    };

    return validate(body, schema);
};

exports.getLocationById = function(request) {
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

exports.getLocationsByOrganizationId = function(request) {
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

exports.getLocationsByPrimaryAccount = function(request) {
    const query = request.query;
    const schema = {
        primaryId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(query, schema);
};

exports.updateLocationInfo = function(request) {
    const body = request.body;
    const locationSchema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        alias: {
            length: {
                minimum: 3,
                maximum: 100,
                wrongLength: "must be between 3 and 100 characters."
            }
        },
        timezoneOffset: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(body['location'], locationSchema);
};

exports.setActiveStatus = function(request) {
    const body = request.body;
    const schema = {
        locationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        active: {
            presence: true,
            boolean: true
        }
    };

    return validate(body, schema);
};

exports.deleteLocation = function(request) {
    const query = request.query;
    const schema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(query, schema)
};