"use strict";
const validate = require("validate.js");

validate.extend(validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function(value, options) {
        return Date.parse(value);
    },
    // Input is a unix timestamp
    format: function(value, options) {
        if (options.dateOnly) {
            return value.toISOString().substring(0, 10);
        } else {
            return value.toISOString();
        }
    }
});

const menuItemSchema = {
    name: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 100,
            wrongLength: "Name must be between 1 and 100 characters."
        }
    },
    clientId: {
        length: {
            minimum: 1,
            maximum: 100,
            wrongLength: "Name must be between 1 and 100 characters."
        }
    },
    meal: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 50,
            wrongLength: "Name must be between 1 and 50 characters."
        }
    },
    date: {
        presence: true,
        datetime: {
            dateOnly: true
        }
    },
    locationId: {
        presence: true,
        numericality: true
    },
    portionQuantity: {
        numericality: true
    },
    portionUnit: {
        length: {
            minimum: 1,
            maximum: 50,
            wrongLength: "Name must be between 1 and 50 characters."
        }
    },
    portionsProduced: {
        numericality: true
    },
    portionCost: {
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

exports.uploadLocationMenu = function(request) {
    const errors = [];
    const body = request.body;

    const bulkInsertSchema = {
        locationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        menuItems: {
            presence: true
        }
    };

    const check1 = validate(body, bulkInsertSchema);
    if (check1) {
        errors.push(check1)
    }
    if (validate.isArray(body.menuItems)) {
        let itemErrors = {};
        const menuItems = body.menuItems;
        for (let i = 0; i < menuItems.length; i++) {
            const check2 = validate(menuItems[i], menuItemSchema);
            if (check2) {
                itemErrors[i] = {item: menuItems[i], err: check2}
            }
        }

        if (Object.keys(itemErrors).length > 0) {
            errors.push(itemErrors)
        }
    } else {
        errors.push("menuItems must be an array.");
    }

    if (errors.length > 0) {
        return errors;
    } else {
        return undefined
    }
};

exports.uploadOrganizationMenu = function(request) {
    const errors = [];
    const body = request.body;

    const bulkInsertSchema = {
        organizationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        menuItems: {
            presence: true
        }
    };

    const check1 = validate(body, bulkInsertSchema);
    if (check1) {
        errors.push(check1)
    }
    if (validate.isArray(body.menuItems)) {
        let itemErrors = {};
        const menuItems = body.menuItems;
        for (let i = 0; i < menuItems.length; i++) {
            const check2 = validate(menuItems[i], menuItemSchema);
            if (check2) {
                itemErrors[i] = {item: menuItems[i], err: check2}
            }
        }

        if (Object.keys(itemErrors).length > 0) {
            errors.push(itemErrors)
        }
    } else {
        errors.push("menuItems must be an array.");
    }

    if (errors.length > 0) {
        return errors;
    } else {
        return undefined
    }
};