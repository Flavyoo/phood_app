const CollectionUtilities = require('../../services/utilities/collection-utilities');

function generateOptions(titleText, xLabelString, yLabelString) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: titleText,
        },

        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: xLabelString,
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: yLabelString,
                },
                ticks: {
                    beginAtZero: true,
                },
            }],
        },
    };
}

exports.getTopWastedItemValueOptions = function () {
    const generalOptions = generateOptions('Top Wasted Items by Value', 'Item', 'Value ($)');
    generalOptions.tooltips = {
        enabled: true,
            callbacks: {
            label: (tooltipItem, data) => {
                const value = data.datasets[0].data[tooltipItem.index];
                return `$${value}`;
            },
        },
    };

    return generalOptions;
};

exports.getTopWastedItemOptions = function (units) {
    return generateOptions('Top Wasted Items by Volume', 'Item', units);
};

exports.getWasteByDayOptions = function (units) {
    return generateOptions('Average Waste by Day', 'Day', units);
};

exports.getTotalWasteByDayOptions = function (units) {
    return generateOptions('Total Waste by Day', 'Day', units);
};

exports.getWasteOverTimeOptions = function (units) {
    return generateOptions('Waste over Time', 'Date', units);
};

exports.getPieChartOptions = function (units, title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: title,
        },
        legend: {
            display: true,
        },
        tooltips: {
            enabled: true,
            callbacks: {
                label: (tooltipItem, data) => {
                    const value = data.datasets[0].data[tooltipItem.index];
                    const total = data.datasets[0].data.reduce((memo, obj) => {
                        return memo + Math.floor(obj);
                    }, 0);
                    const percentage = Math.floor((value * 1000) / total) / 10;

                    return `${percentage}%; ${value} ${units}`;
                },
                title: (tooltipItem, data) => {
                    return data.labels[tooltipItem[0].index];
                },
            },
        },
    };
};

exports.getItemWasteOverTimeOptions = function (curItem, units) {
    return generateOptions(`${curItem} - Waste over Time`, 'Date', units);
};

exports.getItemWasteByDayOptions = function (curItem, units) {
    return generateOptions(`${curItem} - Waste by Day`, 'Day', units);
};

exports.computeTopWasted = function (records) {
    const items = CollectionUtilities.unique(records.map(record => record.itemName));

    const itemTotalObjs = items.reduce((memo, curItem) => {
        const itemRecords = records.filter(record => record.itemName === curItem);
        const itemTotal = itemRecords.reduce((itemMemo, rec) => {
            return itemMemo + parseFloat(rec.quantity);
        }, 0);

        memo.push({ itemName: curItem, quantity: Math.ceil(itemTotal) });
        return memo;
    }, []);

    const sorted = itemTotalObjs.sort((a, b) => {
        return a.quantity - b.quantity;
    });
    sorted.reverse();

    return sorted;
};

exports.computeWasteByWeekday = function (records) {
    const totalsByDay = [];
    const logsWithDay = records.map((obj) => {
        const date = new Date(obj.loggedTime);
        obj.day = date.getDay();
        return obj;
    });
    const logsByDay = CollectionUtilities.groupBy(logsWithDay, 'day');

    let avg = 0;
    let wasteQuantities = [];
    let totalQuantity = 0;

    for (let i = 0; i < 7; i++) {
        if (logsByDay[i] !== undefined) {
            wasteQuantities = logsByDay[i].map((obj) => {
                return parseFloat(obj.quantity);
            });
            totalQuantity = wasteQuantities.reduce((a, b) => {
                return a + b;
            });

            avg = (wasteQuantities.length > 0) ? (totalQuantity / wasteQuantities.length) : 0;
            totalsByDay.push(Math.ceil(avg * 10) / 10);
        } else {
            totalsByDay.push(0);
        }
    }

    return totalsByDay;
};

exports.computeWasteOverTime = function (records) {
    const dates = CollectionUtilities.unique(records.map(record => record.dateProduced));

    return dates.reduce((memo, dateProd) => {
        const dateMatches = records.filter(record => record.dateProduced === dateProd);

        const total = dateMatches.reduce((m, obj) => {
            return m + parseFloat(obj.quantity);
        }, 0);

        memo.push(total);
        return memo;
    }, []);
};

exports.computeTotalsByReason = function (records) {
    const reasons = CollectionUtilities.unique(records.map(record => record.actionReason));
    const totalsByReason = [];

    for (let i = 0; i < reasons.length; i++) {
        const curReason = reasons[i];
        const reasonRecords = records.filter(record => record.actionReason === curReason);
        const reasonTotal = reasonRecords.reduce((memo, obj) => {
            return memo + parseFloat(obj.quantity);
        }, 0);

        totalsByReason.push({ actionReason: curReason, total: Math.ceil(reasonTotal) });
    }

    return totalsByReason;
};

exports.computeTotalsByAction = function (records) {
    const actions = CollectionUtilities.unique(records.map(record => record.actionTaken));
    const totalsByAction = [];

    for (let i = 0; i < actions.length; i++) {
        const curAction = actions[i];
        const actionRecords = records.filter(record => record.actionTaken === curAction);
        const actionTotal = actionRecords.reduce((memo, obj) => {
            return memo + parseFloat(obj.quantity);
        }, 0);
        totalsByAction.push({ actionTaken: curAction, total: Math.ceil(actionTotal) });
    }

    return totalsByAction;
};

exports.sumLogsBy = function (records, parameter) {
    // Sum the quantities based on the parameter, for example sumLogsBy action

};