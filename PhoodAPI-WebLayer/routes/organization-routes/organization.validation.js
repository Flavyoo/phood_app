"use strict";
const validate = require('../../../core/validation');

exports.addOrganization = function(request) {
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
        ownerId: {
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

    return validate(body, schema)
};

exports.getOrganizationById = function(request) {
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

exports.getOrganizationList = function(request) {
    const query = request.query;
    const schema = {
        activeOnly: {
            boolean: true
        }
    };

    return validate(query, schema);
};

exports.getOrganizationsByOwnerId = function(request) {
    const query = request.query;
    const schema = {
        ownerId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(query, schema);
};

exports.updateOrganizationInfo = function(request) {
    const body = request.body;
    const orgSchema = {
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
    };

    return validate(body['organization'], orgSchema)
};

exports.setActiveStatus = function(request) {
    const body = request.body;
    const schema = {
        organizationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        active: {
            presence: true,
            boolean: true
        },
    };

    return validate(body, schema)
};

exports.deleteOrganization = function(request) {
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