"use strict";
const validate = require('../../../core/validation');

exports.addInventoryItem = function(request) {
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
        itemCost: {
            numericality: true
        },
        station: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        }
    };

    return validate(body, schema)
};

exports.getInventoryItemsByLocationId = function(request) {
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

exports.updateInventoryItem = function(request) {
    const body = request.body;
    const inventoryItemSchema = {
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
        itemCost: {
            numericality: true
        },
        station: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        }
    };

    return validate(body['inventoryItem'], inventoryItemSchema)
};

exports.deleteInventoryItem = function(request) {
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