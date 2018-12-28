"use strict";
const validate = require('../../../core/validation');

exports.addPersistentItem = function(request) {
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
        },
        clientId: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        meal: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        dayOfTheWeek: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 10,
                wrongLength: "must be between 1 and 10 characters."
            }
        },
        station: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        itemCost: {
            numericality: true
        }
    };

    return validate(body, schema)
};

exports.getPersistentItemsByLocationId = function(request) {
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

exports.updatePersistentItem = function(request) {
    const body = request.body;
    const persistentItemSchema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        clientId: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        meal: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        dayOfTheWeek: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 10,
                wrongLength: "must be between 1 and 10 characters."
            }
        }
    };

    return validate(body['persistentItem'], persistentItemSchema)
};

exports.deletePersistentItem = function(request) {
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