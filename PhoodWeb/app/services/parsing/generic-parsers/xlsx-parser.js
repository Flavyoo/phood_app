'use strict';
const XLSXFileReader = require('../../utilities/file-readers/xlsx-file-reader');

exports.parseFile = async function(file) {
    const fileData = await XLSXFileReader.readFile(file);

    if (fileData.success) {
        const workbook = fileData.workbook;
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        return XLSXFileReader.sheetToRowArray(worksheet);
    } else {
        console.log("Unable to read file.");
        return false;
    }
};

/**
 * Takes an array of row data and creates an array of objects using only the given indexes mapped to the given names.
 * @param rowData
 * @param indexes
 * @param columnNames
 */
exports.rowsToFilteredObject = function(rowData, indexes, columnNames) {
    if (indexes.length === columnNames.length) {
        const size = indexes.length;
        return rowData.map(function(row) {
            let obj = {};
            for (let i = 0; i < size; i++) {
                if (indexes[i] > -1) {
                    obj[columnNames[i]] = row[indexes[i]];
                } else {
                    obj[columnNames[i]] = null;
                }
            }

            return obj;
        });
    } else {
        return false;
    }
};