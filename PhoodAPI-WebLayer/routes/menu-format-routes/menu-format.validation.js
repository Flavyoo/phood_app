"use strict";
const validate = require('../../../core/validation');

const customFormatSchema = {
    name: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    clientId: {
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    meal: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    date: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    locationName: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    portionQuantity: {
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    portionUnit: {
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    portionsProduced: {
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    portionCost: {
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    },
    station: {
        length: {
            minimum: 1,
            maximum: 30,
            wrongLength: "column tag must be between 1 and 30 characters."
        }
    }
};

exports.addMenuFormat = function(request) {
    const body = request.body;
    const errors = [];

    const insertSchema = {
        email: {
            presence: true,
            email: true,
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        organizationId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        receiveResultEmails: {
            presence: true,
            boolean: true
        },
        formatData: {
            presence: true
        },
        "formatData.formatType": {
            presence: true,
            length: {
                minimum: 1,
                maximum: 30,
                wrongLength: "must be between 1 and 30 characters."
            }
        },
        "formatData.formatName": {
            presence: true,
            length: {
                minimum: 1,
                maximum: 30,
                wrongLength: "must be between 1 and 30 characters."
            }
        }
    };

    const check1 = validate(body, insertSchema);
    if (check1) {
        errors.push(check1)
    } else {
        if (body.formatData.formatType.toLowerCase() === "custom") {
            if (validate.isDefined(body.formatData.customFormat)) {
                const check2 = validate(body.formatData.customFormat, customFormatSchema);
                if (check2) {
                    errors.push(check2)
                }
            } else {
                errors.push("If formatType is set to custom, a customFormat object is required.")
            }
        }
    }

    if (errors.length > 0) {
        return errors;
    } else {
        return undefined
    }
};

exports.getMenuFormatByAssignedEmail = function(request) {
    const query = request.query;
    const schema = {
        email: {
            presence: true,
            email: true,
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        }
    };

    return validate(query, schema);
};

exports.getMenuFormatsByOrganization = function(request) {
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

exports.updateMenuFormat = function(request) {
    const body = request.body;
    const errors = [];

    const menuFormatSchema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        receiveResultEmails: {
            presence: true,
            boolean: true
        },
        formatData: {
            presence: true
        },
        "formatData.formatType": {
            presence: true,
            length: {
                minimum: 1,
                maximum: 30,
                wrongLength: "must be between 1 and 30 characters."
            }
        },
        "formatData.formatName": {
            presence: true,
            length: {
                minimum: 1,
                maximum: 30,
                wrongLength: "must be between 1 and 30 characters."
            }
        }
    };

    const check1 = validate(body['menuFormat'], menuFormatSchema);
    if (check1) {
        errors.push(check1)
    } else {
        const formatData = body['menuFormat'].formatData;
        if (formatData.formatType.toLowerCase() === "custom") {
            if (validate.isDefined(formatData.customFormat)) {
                const check2 = validate(formatData.customFormat, customFormatSchema);
                if (check2) {
                    errors.push(check2)
                }
            } else {
                errors.push("If formatType is set to custom, a customFormat object is required.")
            }
        }
    }

    if (errors.length > 0) {
        return errors;
    } else {
        return undefined
    }
};

exports.deleteMenuFormat = function(request) {
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