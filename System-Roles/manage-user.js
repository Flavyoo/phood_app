"use strict";

module.exports = {
    Role: {
        getUserRoles: true
    },
    User: {
        getUserById: true,
        updateUserInfo: true,
        changePassword: true
    },
    UserSettings: {
        getUserSettingsByUserId: true,
        upsertUserSettings: true
    }
};