module.exports = function(app) {
    // Parsing Services
    require('./parsing/parsing-service')(app);

    // Meta Services
    require('./meta-services/recent-activity-service')(app);

    // Resource Services
    require('./resources/auth-service')(app);
    require('./resources/food-log-service')(app);
    require('./resources/inventory-service')(app);
    require('./resources/location-service')(app);
    require('./resources/loss-reason-service')(app);
    require('./resources/menu-service')(app);
    require('./resources/menu-upload-service')(app);
    require('./resources/organization-service')(app);
    require('./resources/pan-service')(app);
    require('./resources/persistent-item-service')(app);
    require('./resources/role-service')(app);
    require('./resources/station-service')(app);
    require('./resources/user-service')(app);
    require('./resources/user-settings-service')(app);
    require('./resources/web-api-service')(app);

    // Utility Services
    require('./utilities/alert-service')(app);

    // Application States
    require('./app-states/auth-state')(app);
};