'use strict';

module.exports = function(app) {
    app.service('WebApiService', function($http, AuthState) {
        const APIUrl = API_URL; // Set from global variable in index.html

        function getAuthToken() {
            return AuthState.getStateData('sessionId');
        }

        function handleResponse(httpResponse) {
            /*
            HttpResponse contains the following properties:
                success, status, statusText, data, config(the request object), and headers(method for retrieving header data).
             */

            // Handle special cases
            if (httpResponse.status === 304 && httpResponse.config.headers('if-none-match')) {
                httpResponse.success = true;
            } else if (httpResponse.status === 401) {
                // Log out user.
                AuthState.resetState();
            }

            return httpResponse;
        }

        // Create / Post
        this.apiPOST = async function(endpoint, body, eTag) {
            const apiURL = APIUrl + endpoint;

            const response = await new Promise((resolve, reject) => {
                $http.post(apiURL, body, {
                    headers: {
                        'authorization': getAuthToken()
                    }
                })
                    .then(function(response) {
                        response.success = true;
                        return resolve(response);
                    })
                    .catch(function(response) {
                        response.success = false;
                        return resolve(response);
                    });
            });

            return handleResponse(response)
        };

        // Read // Get
        this.apiGET = async function(endpoint, query, eTag) {
            const apiURL = APIUrl + endpoint;

            const response = await new Promise((resolve, reject) => {
                $http.get(apiURL, {
                    params: query,
                    headers: {
                        'authorization': getAuthToken(),
                        'if-none-match': eTag
                    }
                })
                    .then((response) => {
                        response.success = true;
                        return resolve(response);
                    })
                    .catch((response) => {
                        response.success = false;
                        return resolve(response);
                    });
            });

            return handleResponse(response);
        };

        // Update / Put
        this.apiPUT = async function(endpoint, body) {
            const apiURL = APIUrl + endpoint;

            const response = await new Promise(function(resolve, reject) {
                $http.put(apiURL, body, {headers: {authorization: getAuthToken()} })
                    .then((response) => {
                        response.success = true;
                        return resolve(response);
                    })
                    .catch((response) => {
                        response.success = false;
                        return resolve(response);
                    });
            });

            return handleResponse(response);
        };

        // Delete / Delete
        this.apiDELETE = async function(endpoint, query) {
            const apiURL = APIUrl + endpoint;

            const response = await new Promise((resolve, reject) => {
                $http.delete(apiURL, {
                    params: query,
                    headers: {'authorization': getAuthToken()}
                })
                    .then((response) => {
                        response.success = true;
                        return resolve(response);
                    })
                    .catch((response) => {
                        response.success = false;
                        return resolve(response);
                    });
            });

            return handleResponse(response);
        };
    });
};