"use strict";
const validate = require('../../../core/validation');

const insertMenuItemSchema = {
    name: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 100,
            wrongLength: "must be between 1 and 100 characters."
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
        },
        format: {
            pattern: "[a-z][a-z ]*[a-z]",
            flags: "i",
            message: "must begin and end with a letter and can only contain letters and spaces."
        }
    },
    date: {
        presence: true,
        datetime: {
            dateOnly: true
        }
    },
    portionQuantity: {
        numericality: true
    },
    portionUnit: {
        length: {
            minimum: 1,
            maximum: 50,
            wrongLength: "must be between 1 and 50 characters."
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

exports.addMenuItem = function(request) {
    const body = request.body;

    return validate(body, insertMenuItemSchema)
};

exports.addMenuItems = function(request) {
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
            const check2 = validate(menuItems[i], insertMenuItemSchema);
            if (check2) {
                itemErrors[i] = check2
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

exports.getLocationMenu = function(request) {
    const query = request.query;
    const schema = {
        locationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
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
        }
    };

    return validate(query, schema);
};

const updateMenuItemSchema = {
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
        },
        format: {
            pattern: "[a-z][a-z ]*[a-z]",
            flags: "i",
            message: "must begin and end with a letter and can only contain letters and spaces."
        }
    },
    date: {
        presence: true,
        datetime: {
            dateOnly: true
        }
    },
    portionQuantity: {
        numericality: true
    },
    portionUnit: {
        length: {
            minimum: 1,
            maximum: 50,
            wrongLength: "must be between 1 and 50 characters."
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

exports.updateMenuItem = function(request) {
    const body = request.body;

    return validate(body['menuItem'], updateMenuItemSchema)
};

exports.updateMenuItems = function(request) {
    const errors = [];
    const body = request.body;

    const bulkUpdateSchema = {
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

    const check1 = validate(body, bulkUpdateSchema);
    if (check1) {
        errors.push(check1)
    }
    if (validate.isArray(body.menuItems)) {
        let itemErrors = {};
        const menuItems = body['menuItems'];
        for (let i = 0; i < menuItems.length; i++) {
            const check2 = validate(menuItems[i], updateMenuItemSchema);
            if (check2) {
                itemErrors[i] = check2
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

exports.deleteMenuItem = function(request) {
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

exports.deleteMenuItems = function(request) {
    const errors = [];
    const query = request.query;

    const bulkDeleteSchema = {
        locationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        menuItemIds: {
            presence: true
        }
    };

    const check1 = validate(query, bulkDeleteSchema);
    if (check1) {
        errors.push(check1)
    }
    if (validate.isArray(query.menuItemIds)) {
        let itemErrors = {};
        const menuItemIds = query['menuItemIds'];
        for (let i = 0; i < menuItemIds.length; i++) {
            if (isNaN(parseInt(menuItemIds[i]))) {
                itemErrors[i] = `Value [${menuItemIds[i]}] is not a valid id.`;
            }
        }

        if (Object.keys(itemErrors).length > 0) {
            errors.push(itemErrors)
        }
    } else {
        errors.push("menuItemIds must be an array.");
    }

    if (errors.length > 0) {
        return errors;
    } else {
        return undefined
    }
};