'use strict';
const validate = require('../../../core/validation');

exports.createPrimaryAccount = function(request) {
    const body = request.body;
    const schema = {
        name: {
            presence: true,
            length: {
                minimum: 8,
                maximum: 50,
                wrongLength: "must be between 8 and 50 characters."
            },
            format: {
                pattern: "[a-z][a-z0-9]*",
                flags: "i",
                message: "must begin with a letter and can only contain a-z and 0-9."
            }
        },
        password: {
            presence: true,
            length: {
                minimum: 4,
                maximum: 100,
                wrongLength: "must be between 4 and 100 characters."
            },
            format: {
                pattern: "[a-z0-9!\"#$%&'\\(\\)\\*\\+,\\-.\\/:;<=>?@[\\]\\^_`{|}~]*",
                flags: "i",
                message: "can only contain a-z, 0-9 and special characters."
            }
        },
        email: {
            presence: true,
            email: true
        },
        contactName: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        active: {
            presence: true,
            boolean: true
        },
        paidAccount: {
            boolean: true
        }
    };

    return validate(body, schema)
};

exports.createSubAccount = function(request) {
    const body = request.body;
    const schema = {
        name: {
            presence: true,
            length: {
                minimum: 4,
                maximum: 50,
                wrongLength: "must be between 8 and 50 characters."
            },
            format: {
                pattern: "[a-z][a-z0-9]*",
                flags: "i",
                message: "must begin with a letter and can only contain a-z and 0-9."
            }
        },
        password: {
            presence: true,
            length: {
                minimum: 4,
                maximum: 100,
                wrongLength: "must be between 4 and 100 characters."
            },
            format: {
                pattern: "[a-z0-9!\"#$%&'\\(\\)\\*\\+,\\-.\\/:;<=>?@[\\]\\^_`{|}~]*",
                flags: "i",
                message: "can only contain a-z, 0-9 and special characters."
            }
        },
        email: {
            email: true
        },
        contactName: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        },
        active: {
            presence: true,
            boolean: true
        },
        parentId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
    };

    return validate(body, schema)
};

exports.getUserById = function(request) {
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

exports.getUserByName = function(request) {
    const query = request.query;
    const schema = {
        name: {
            presence: true,
            length: {
                minimum: 1,
                maximum: 50,
                wrongLength: "must be between 1 and 50 characters."
            },
            format: {
                pattern: "[a-z][a-z0-9]*",
                flags: "i",
                message: "must begin with a letter and can only contain a-z and 0-9."
            }
        }
    };

    return validate(query, schema);
};

exports.getSubAccountList = function(request) {
    const query = request.query;
    const schema = {
        parentId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        }
    };

    return validate(query, schema);
};

exports.getUserList = function(request) {
    const query = request.query;
    const schema = {
        onlyPrimary: {
            boolean: true
        }
    };

    return validate(query, schema);
};

exports.updateUserInfo = function(request) {
    const body = request.body;
    const userSchema = {
        id: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        email: {
            email: true
        },
        contactName: {
            length: {
                minimum: 1,
                maximum: 100,
                wrongLength: "must be between 1 and 100 characters."
            }
        }
    };

    return validate(body['user'], userSchema)
};

exports.changePassword = function(request) {
    const body = request.body;
    const schema = {
        userId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        confirmPassword: {
            presence: true,
            length: {
                minimum: 4,
                maximum: 100,
                wrongLength: "must be between 4 and 100 characters."
            },
            format: {
                pattern: "[a-z0-9!\"#$%&'\\(\\)\\*\\+,\\-.\\/:;<=>?@[\\]\\^_`{|}~]*",
                flags: "i",
                message: "can only contain a-z, 0-9 and special characters."
            }
        },
        newPassword: {
            presence: true,
            length: {
                minimum: 10,
                maximum: 100,
                wrongLength: "must be between 10 and 100 characters."
            },
            format: {
                pattern: "[a-z0-9!\"#$%&'\\(\\)\\*\\+,\\-.\\/:;<=>?@[\\]\\^_`{|}~]*",
                flags: "i",
                message: "can only contain a-z, 0-9 and special characters."
            }
        }
    };

    return validate(body, schema)
};

exports.setActiveStatus = function(request) {
    const body = request.body;
    const schema = {
        userId: {
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

exports.setTrialStatus = function(request) {
    const body = request.body;
    const schema = {
        userId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        paidAccount: {
            presence: true,
            boolean: true
        },
        freeTrialEnd: {
            presence: true,
            datetime: true
        },
    };

    return validate(body, schema)
};

exports.deleteUser = function(request) {
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

/*
    Temporary validation code for admin override password reset.
    todo: Replace with proper password reset.
 */
exports.adminResetPassword = function(request) {
    const body = request.body;
    const schema = {
        userId: {
            presence: true,
            numericality: {
                onlyInteger: true
            }
        },
        newPassword: {
            presence: true,
            length: {
                minimum: 10,
                maximum: 100,
                wrongLength: "must be between 10 and 100 characters."
            },
            format: {
                pattern: "[a-z0-9!\"#$%&'\\(\\)\\*\\+,\\-.\\/:;<=>?@[\\]\\^_`{|}~]*",
                flags: "i",
                message: "can only contain a-z, 0-9 and special characters."
            }
        }
    };

    return validate(body, schema)
};