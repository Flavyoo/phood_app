'use strict';
const XLSXFileReader = require('../../utilities/file-readers/xlsx-file-reader');

exports.parseFile = function(file) {
    return XLSXFileReader.readFile(file)
        .then(function(result) {
            if (result.success) {
                const workbook = result.workbook;
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const rowArrays = XLSXFileReader.sheetToRowArray(worksheet);
                const pages = splitPages(rowArrays);

                if (pages.length > 0) {
                    const menus = _.map(pages, parsePage);

                    return [].concat.apply([], menus);
                } else {
                    console.log("Unable to parse file. Is the file locked by protected view?");

                    return false;
                }
            } else {
                console.log("Unable to read file.");
                return false;
            }
        });
};

function splitPages(rowArrays) {
    const targetString = "Production Worksheets Report";
    const pageIndexes = [];

    for (let i = 0; i < rowArrays.length; i++) {
        if (rowArrays[i][0] === targetString || rowArrays[i][1] === targetString) {
            pageIndexes.push(i);
        }
    }
    pageIndexes.push(rowArrays.length);

    const pages = [];
    for (let p = 0; p < pageIndexes.length - 1; p++) {
        const page = rowArrays.slice(pageIndexes[p], pageIndexes[p + 1]);
        pages.push(page);
    }

    return pages;
}

function parsePage(page) {
    const targetString = "Master";
    const sectionIndexes = [];
    const items = [];
    for (let i = 0; i < page.length; i++) {
        if (page[i][0] === targetString || page[i][1] === targetString) {
            sectionIndexes.push(i);
        }
    }
    sectionIndexes.push(page.length - 1);

    for (let s = 0; s < sectionIndexes.length - 1; s++) {
        const metaInfo = sectionIndexes[s] - 1;
        const menuStart = sectionIndexes[s] + 2;
        const menuEnd = sectionIndexes[s + 1] - 2;
        const dateMeal = parseDateMeal(page[metaInfo][4]);
        const location = page[metaInfo][8];

        const sectionItems = parseMenuLines(page.slice(menuStart, menuEnd));
        const menuItems = _.map(sectionItems, function(item) {
            item["location"] = location;
            item["date"] = dateMeal.date;
            item["meal"] = dateMeal.meal;

            return item;
        });

        items.push(menuItems);
    }

    return [].concat.apply([], items);
}

function parseMenuLines(menuLines) {
    const items = _.filter(menuLines, function(row) {
        if ((row[0] !== "") && (row[0].indexOf(":") == -1)) {
            return true;
        }
    });

    return _.map(items, function(item) {
        const name = filterItemName(item[0]);
        const portion = item[2];
        const forecast = item[3];
        let portionQuantity, portionUnit, portionsProduced;

        if (portion !== "") {
            const qPart = portion.substr(0, portion.indexOf(' '));
            if (qPart.indexOf("/") != -1) {
                portionQuantity = eval(qPart);
            } else {
                portionQuantity = parseFloat(qPart);
            }

            portionUnit = portion.substr(portion.indexOf(' ') + 1);
        } else {
            portionQuantity = null;
            portionUnit = null;
        }

        if (forecast !== "") {
            portionsProduced = parseInt(forecast);
        } else {
            portionsProduced = null;
        }

        if (isNaN(portionQuantity) || isNaN(portionsProduced)) {
            console.log({
                error: "Can't process item. Invalid quantity or forecast.",
                item: item
            })
        }

        return {
            item: name,
            portionQuantity: portionQuantity,
            portionUnit: portionUnit,
            portionsProduced: portionsProduced
        }
    });
}

function parseDateMeal(dateMeal) {
    const parts = dateMeal.split(",");
    const dateParts = parts[0].replace(" ", "").split("/");
    const date = "20" + dateParts[2] + "-" + dateParts[0] + "-" + dateParts[1];
    const mealPart = parts[2].replace(" ", "");
    let meal;

    if (mealPart == "BRK") {
        meal = "Breakfast";
    } else if (mealPart == "LS") {
        meal = "Lunch";
    } else if (mealPart == "DS") {
        meal = "Dinner";
    } else if (mealPart == "PIZ") {
        meal = "Dinner";
    } else if (mealPart == "VEG") {
        meal = "Dinner";
    } else {
        meal = mealPart;
    }

    return {
        date: date,
        meal: meal
    }
}

function filterItemName(name) {
    let itemName = name;
    const filterList = ["Portfolio", "port", "the met", "met", "PROD"];

    for (let i = 0; i < filterList.length; i++) {
        const regex = new RegExp("[[-][ ]*]*" + filterList[i], "ig");
        itemName = itemName.replace(regex, '');
    }
    itemName = itemName.trim();
    itemName = itemName.replace("  ", " ");
    itemName = itemName.replace(/['*+]+/g, '');

    return itemName;
}