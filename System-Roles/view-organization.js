"use strict";

module.exports = {
    ClientEmployee: {
        getEmployeesByLocationId: true
    },
    DetailedFoodLog: {
        getDetailedFoodLogs: true
    },
    FoodLog: {
        getLocationFoodLogs: true
    },
    InventoryItem: {
        getInventoryItemsByLocationId: true
    },
    Location: {
        getLocationById: true,
        getLocationsByOrganizationId: true
    },
    LossReason: {
        addLossReason: true,
        getLossReasonsByOrganizationId: true
    },
    MenuItem: {
        getLocationMenu: true
    },
    Organization: {
        getOrganizationById: true,
    },
    Pan: {
        getPansByOrganizationId: true
    },
    PersistentItem: {
        getPersistentItemsByLocationId: true
    },
    Station: {
        getStationsByLocationId: true
    },
    WasteReport: {
        generateReport: true
    }
};