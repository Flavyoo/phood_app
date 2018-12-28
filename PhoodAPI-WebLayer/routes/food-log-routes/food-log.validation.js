"use strict";
const validate = require('../../../core/validation');

exports.addFoodLog = function(request) {
    const body = request.body;
    const schema = {
        itemName: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        itemType: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 20,
                wrongLength: "must be between 1 and 20 characters."
            }
        },
        locationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        loggedTime: {
            presence: true,
            datetime: true
        },
        dateProduced: {
            presence: true,
            datetime: {
                dateOnly: true
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
        actionTaken: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        actionReason: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        quantity: {
            presence: true,
            numericality: true
        },
        unit: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        station: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        employeeName: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        }
    };

    return validate(body, schema)
};

exports.getLocationFoodLogs = function(request) {
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
            datetime: true
        },
        endDate: {
            presence: true,
            datetime: true
        }
    };

    return validate(query, schema)
};

exports.updateFoodLog = function(request) {
    const body = request.body;
    const foodLogSchema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        itemName: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        itemType: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 20,
                wrongLength: "must be between 1 and 20 characters."
            }
        },
        loggedTime: {
            presence: true,
            datetime: true
        },
        dateProduced: {
            presence: true,
            datetime: {
                dateOnly: true
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
        actionTaken: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        actionReason: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        quantity: {
            presence: true,
            numericality: true
        },
        unit: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            }
        },
        station: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        employeeName: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        }
    };

    return validate(body['foodLog'], foodLogSchema)
};

exports.deleteFoodLog = function(request) {
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