'use strict';
const validate = require('../../../core/validation');

exports.addRole = function(request) {
    const body = request.body;
    const schema = {
        userId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        roleName: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        entityType: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        entityId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(body, schema)
};

exports.addSubAccountRole = function(request) {
    const body = request.body;
    const schema = {
        userId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        roleName: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        entityType: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        entityId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(body, schema)
};

exports.addAdminRole = function(request) {
    const body = request.body;
    const schema = {
        userId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        roleName: {
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

exports.getUserRoles = function(request) {
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

exports.deleteRole = function(request) {
    const query = request.query;
    const schema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        entityType: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        }
    };

    return validate(query, schema);
};

exports.deleteSubAccountRole = function(request) {
    const query = request.query;
    const schema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        entityType: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        }
    };

    return validate(query, schema);
};