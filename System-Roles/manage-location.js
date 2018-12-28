"use strict";

module.exports = {
    ClientEmployee: {
        addEmployee: true,
        getEmployeesByLocationId: true,
        deleteEmployee: true
    },
    DetailedFoodLog: {
        getDetailedFoodLogs: true
    },
    FoodLog: {
        addFoodLog: true,
        getLocationFoodLogs: true,
        updateFoodLog: true,
        deleteFoodLog: true
    },
    InventoryItem: {
        addInventoryItem: true,
        getInventoryItemsByLocationId: true,
        updateInventoryItem: true,
        deleteInventoryItem: true
    },
    Location: {
        getLocationById: true,
        updateLocationInfo: true
    },
    MenuItem: {
        addMenuItem: true,
        addMenuItems: true,
        getLocationMenu: true,
        updateMenuItem: true,
        updateMenuItems: true,
        deleteMenuItem: true,
        deleteMenuItems: true
    },
    MenuUpload: {
        uploadLocationMenu: true
    },
    PersistentItem: {
        addPersistentItem: true,
        getPersistentItemsByLocationId: true,
        updatePersistentItem: true,
        deletePersistentItem: true
    },
    Station: {
        addStation: true,
        getStationsByLocationId: true,
        updateStation: true,
        deleteStation: true
    },
    WasteReport: {
        generateReport: true
    }
};