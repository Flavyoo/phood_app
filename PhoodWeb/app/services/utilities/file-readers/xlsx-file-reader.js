"use strict";
const XLSX = require('xlsx');

exports.readFile = function(file) {
    return new Promise(function(resolve, reject) {
        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const data = event.target.result;
                const workbook = XLSX.read(data, {type: 'binary'});

                resolve({success: true, workbook: workbook});
            };
            reader.onerror = function(ex) {
                resolve({success: false, error: ex});
            };

            reader.readAsBinaryString(file);
        } else {
            resolve({success: false, error: "No File"});
        }
    });
};

exports.sheetToRowArray = function(worksheet) {
    const rowColumnData = getRowColumnData(Object.keys(worksheet));
    const columnKeys = rowColumnData.columnKeys;
    const rowBegin = rowColumnData.rowBegin;
    const rowEnd = rowColumnData.rowEnd;
    const rowArrays = [];

    for (let row = rowBegin; row < rowEnd; row++) {
        const currentRow = [];
        for (let column = 0; column < columnKeys.length; column++) {
            const cellId = columnKeys[column].concat(row);
            let cellData;

            if (worksheet[cellId] !== undefined) {
                cellData = worksheet[cellId].v;
            } else {
                cellData = "";
            }

            currentRow.push(cellData);
        }
        rowArrays.push(currentRow);
    }

    return rowArrays;
};

function getRowColumnData(keys) {
    const keyNames = keys;
    keyNames.splice(keyNames.indexOf('!ref'), 1);
    const columnGroups = keyNames.reduce(function(map, value) {
        map[value.substring(0, 1)].push(value);
        return map;
    });
    const columnKeys = getColumnKeys(columnGroups);
    const rowRange = getRowRange(keyNames);

    return {
        columnKeys: columnKeys,
        rowBegin: rowRange.begin,
        rowEnd: rowRange.end
    };
}

function getColumnKeys(columnGroups) {
    const columnKeys = Object.keys(columnGroups);
    columnKeys.sort();

    return columnKeys;
}

function getRowRange(keyNames) {
    const rowValues = keyNames.map(function(value) {
        return parseInt(value.substring(1, value.length));
    });
    let min = Math.min(rowValues);
    let max = Math.max(rowValues);

    if (!isFinite(min)) {
        min = 0;
    }
    if (!isFinite(max)) {
        max = 0;
    }

    return {begin: min, end: max};
}