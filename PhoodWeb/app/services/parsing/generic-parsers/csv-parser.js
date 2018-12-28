'use strict';
const TextFileReader = require('../../utilities/file-readers/text-file-reader');

exports.parseFile = async function(file, delimiter) {
    const fileData = await TextFileReader.readFile(file);

    if (fileData.success) {
        const textData = fileData.textData;

        const regex = (delimiter === 'comma') ? /,(?=(?:[^\']*\'[^\']*\')*[^\']*$)/ : /\t/;

        return textData
            .split('\n')
            .filter(function(row) {
                return (row !== '');
            }).map(function(row) {
                return row.split(regex);
            });
    } else {
        console.log('Unable to read file.');

        return false;
    }
};

/**
 * Matches parsed columns to object properties based on the headers
 * @param {*} headers - e.g. { name: String, isActive: Boolean, index: Number }
 * @param {*} rawParseData 
 */
exports.processParseData = (headers, rawParseData) => {
    for (let i = 0; i < headers.length; i++) {
        headers[i].index = i;
    }

    const activeHeaders = headers.filter(x => x && x.name && x.isActive);

    // Convert the parsed arrays into JSON
    return rawParseData.map(row => {
        const jsonifiedRow = {};
        for (let i = 0; i < activeHeaders.length; i++) {
            jsonifiedRow[activeHeaders[i].name] = row[activeHeaders[i].index];
        }

        return jsonifiedRow;
    });
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
                    obj[columnNames[i]] = trimQuotes(row[indexes[i]]);
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

function trimQuotes(str) {
    return str ? str.replace(/['']+/g, '') : str;
}