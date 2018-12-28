/**
 * TOOD: Refactor the name for this service to be more appropriate, such as production-info-service
 */

exports.computeTotalValueFromLogs = computeTotalValueFromLogs;
exports.lookupLogCost = lookupLogCost;
exports.calculatePortionCount = calculatePortionCount;
exports.findExactMenuReference = findExactMenuReference;
exports.findCloseMenuReference = findCloseMenuReference;

function computeTotalValueFromLogs(logs, menus) {
    let totalValue = 0;

    for (let i = 0; i < logs.length; i++) {
        totalValue += lookupLogCost(logs[i], menus);
    }

    return totalValue;
}

function findExactMenuReference(log, menus) {
    return menus.find((menuItem) => {
        return (log.itemName === menuItem.name) && (log.dateProduced === menuItem.date) && menuItem.portionQuantity && menuItem.portionCost;
    });
}

function findCloseMenuReference(log, menus) {
    return menus.find((menuItem) => {
        // TODO: Runtime complexity of similarity calculation is too long
        // const similarity = SimilaritySevice.computeSimilarity(log.itemName, menuItem.name);
        const adjustedLogName = log.itemName.replace(/'/g, '').toLowerCase();
        const adjustedMenuItemName = menuItem.name.replace(/'/g, '').toLowerCase();

        return (adjustedLogName === adjustedMenuItemName) && menuItem.portionQuantity && menuItem.portionCost;
    });
}

function lookupLogCost(log, menus) {
    let logCost = log.quantity * 2;

    // Look up to see if that item appears on that day's menu
    const menuReference = findExactMenuReference(log, menus);

    if (menuReference) {
        // If so, use the cost from that day's menu if it exists
        const portionCount = calculatePortionCount(log, menuReference);
        logCost = portionCount * menuReference.portionCost;
    } else {
        // If it wasn't on that day's menu, use the latest cost if one exists
        const backupMenuReference = findCloseMenuReference(log, menus);

        if (backupMenuReference) {
            // We found an entry for this item
            const portionCount = calculatePortionCount(log, backupMenuReference);
            logCost = portionCount * backupMenuReference.portionCost;
        }
    }

    // Otherwise, use the default menu cost
    return logCost;
}

/**
 * If the reference is in Grams, convert Grams to Pounds
 * If the reference is in Ounces, OZ, or OZL, convert
 * If the log isn't in Pounds... exclude that until we have a conversion
 * @param log
 * @param menu
 */
function calculatePortionCount(log, menu) {
    let portionCount = log.quantity;

    if ((menu.portionUnit === 'Grams') && (log.unit === 'Pound')) {
        portionCount = (portionCount * 453.592) / menu.portionQuantity;
    } else if ((menu.portionUnit === 'Ounces') && (log.unit === 'Pound')) {
        portionCount = (portionCount * 16) / menu.portionQuantity;
    } else if (log.unit !== 'Pound') {
        portionCount = 0;
    }

    return Math.floor(portionCount * 1000) / 1000;
}