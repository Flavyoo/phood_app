'use strict';
const AuthRouter = require('./auth-routes/auth.router');
const CoreRouter = require('./core-routes/core.router');
const ClientEmployeeRouter = require('./client-employee-routes/client-employee.router');
const DetailedFoodLogRouter = require('./detailed-food-log-routes/detailed-food-log.router');
const FoodLogRouter = require('./food-log-routes/food-log.router');
const InventoryItemRouter = require('./inventory-item-routes/inventory-item.router');
const LocationRouter = require('./location-routes/location.router');
const LossReasonRouter = require('./loss-reason-routes/loss-reason.router');
const MenuFormatRouter = require('./menu-format-routes/menu-format.router');
const MenuItemRouter = require('./menu-item-routes/menu-item.router');
const MenuUploadRouter = require('./menu-upload-routes/menu-upload.router');
const OrganizationRouter = require('./organization-routes/organization.router');
const PanRouter = require('./pan-routes/pan.router');
const PasswordResetRouter = require('./password-reset-routes/password-reset.router');
const PersistentItemRouter = require('./persistent-item-routes/persistent-item.router');
const RecentActivityRouter = require('./recent-activity-routes/recent-activity.router');
const RoleRouter = require('./role-routes/role.router');
const StationRouter = require('./station-routes/station.router');
const UserRouter = require('./user-routes/user.router');
const UserSettingsRouter = require('./user-settings-routes/user-settings.router');
const WasteReportRouter = require('./waste-report-routes/waste-report.router');

module.exports = function(services) {
    return [
        CoreRouter(),
        AuthRouter(services['AuthService'], services['UserService'], services['RoleService']),
        ClientEmployeeRouter(services['AuthService'], services['ClientEmployeeService']),
        DetailedFoodLogRouter(services['AuthService'], services['DetailedFoodLogService']),
        FoodLogRouter(services['AuthService'], services['FoodLogService']),
        InventoryItemRouter(services['AuthService'], services['InventoryItemService']),
        LocationRouter(services['AuthService'], services['LocationService']),
        LossReasonRouter(services['AuthService'], services['LossReasonService']),
        MenuFormatRouter(services['AuthService'], services['MenuFormatService']),
        MenuItemRouter(services['AuthService'], services['MenuItemService']),
        MenuUploadRouter(services['AuthService'], services['MenuUploadService']),
        OrganizationRouter(services['AuthService'], services['OrganizationService']),
        PanRouter(services['AuthService'], services['PanService']),
        PasswordResetRouter(services['PasswordResetService'], services['SystemEmail']),
        PersistentItemRouter(services['AuthService'], services['PersistentItemService']),
        RecentActivityRouter(services['AuthService'], services['RecentActivityService']),
        RoleRouter(services['AuthService'], services['RoleService']),
        StationRouter(services['AuthService'], services['StationService']),
        UserRouter(services['AuthService'], services['UserService']),
        UserSettingsRouter(services['AuthService'], services['UserSettingsService']),
        WasteReportRouter(services['AuthService'], services['WasteReport'])
    ]
};