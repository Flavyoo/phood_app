module.exports = function(app) {
    require('./change-password/change-password')(app);
    
    require('./config-station/config-station')(app);
    require('./config-recurring-item/config-recurring-item')(app);
    require('./config-pan/config-pan')(app);
    require('./config-location/config-location')(app);
    require('./config-loss-reason/config-loss-reason')(app);

    require('./kitchen-achievements/kitchen-achievements')(app);
    require('./kitchen-feed/kitchen-feed')(app);
    require('./manage-organization/manage-organization')(app);
    require('./manage-user/manage-user')(app);
    require('./menu-editor/menu-editor')(app);
    require('./menu-uploader/menu-uploader')(app);

    require('./new-location-card/new-location-card')(app);
    require('./new-menu-items-card/new-menu-items-card')(app);
    require('./new-organization-card/new-organization-card')(app);
    require('./new-pan-card/new-pan-card')(app);
    require('./new-role-card/new-role-card')(app);
    require('./new-user-card/new-user-card')(app);
    
    require('./organization-list/organization-list')(app);
    require('./password-reset-card/password-reset-card')(app);
    require('./phood-loader/phood-loader')(app);
    require('./phood-navbar/phood-navbar')(app);
    require('./user-settings-card/user-settings-card')(app);
    require('./user-roles-card/user-roles-card')(app);
};