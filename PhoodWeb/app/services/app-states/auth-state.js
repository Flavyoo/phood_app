'use strict';

module.exports = function(app) {
    app.service('AuthState', function($state, localStorageService) {
        let AuthState = {
            user: {
                name: "",
                roles: [],
                location: {},
                locations: [],
                organization: {},
                organizations: []
            },
            sessionId: undefined,
            navState: {
                isTracker: false,
                isMain: false,
                isManager: false
            }
        };

        // Auth State Functions
        this.setStateData = function(key, value) {
            AuthState[key] = value;
            this.saveUserToLocalStorage();
        };

        this.getStateData = function(key) {
            if (key) {
                return AuthState[key];
            } else {
                return AuthState;
            }
        };

        this.saveUserToLocalStorage = function() {
            localStorageService.set("AuthState", JSON.stringify(AuthState));
        };

        /**
         * Fetch the auth object (if it exists) from localStorage
         */
        this.loadFromLocalStorage = function() {
            if (localStorageService) {
                const authInfo = localStorageService.get("AuthState");

                if (authInfo) {
                    try {
                        AuthState = JSON.parse(authInfo);
                    } catch (e) {
                        console.log("Error loading auth state.")
                    }
                }
            }
        };

        this.resetState = function() {
            AuthState = {
                user: {
                    name: "",
                    roles: [],
                    location: {},
                    locations: [],
                    organization: {},
                    organizations: []
                },
                sessionId: undefined,
                navState: {
                    isTracker: false,
                    isMain: false,
                    isManager: false
                }
            };
            localStorageService.remove("AuthState");
            $state.go('login');
        };
    });
};