module.exports = function(app) {
    app.service('StationService', ['WebApiService', function(webApi) {
        const resource = '/Stations';

        this.addStation = async function(itemData) {
            const route = resource + '/addStation';
            const result = await webApi.apiPOST(route, itemData);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.getStations = async function(locationID) {
            const route = resource + '/getStationsByLocationId';
            const query = {
                locationId: locationID,
            };
            const result = await webApi.apiGET(route, query);

            return {
                success: result.success,
                data: result.success ? result.data : null,
                error: result.success ? null : result.data,
            };
        };

        this.updateStation = async function(itemData) {
            const route = resource + '/updateStation';
            const result = await webApi.apiPUT(route, itemData);

            return {
                success: result.success,
            };
        };

        this.deleteStation = async function(stationId) {
            const route = resource + '/deleteStation';
            const query = {
                id: stationId,
            };
            const result = await webApi.apiDELETE(route, query);

            return {
                success: result.success,
            };
        };
    }]);
};