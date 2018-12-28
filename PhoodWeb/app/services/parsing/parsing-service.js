/**
 * TODO: Much of this file is now obsolete, expect for parseGenericFile and processMeals
 */

module.exports = function(app) {
    app.service('ParsingService', function() {
        const CSVParser = require('./generic-parsers/csv-parser');
        const ColumnNames = ['name', 'clientId', 'meal', 'location', 'date', 'portionQuantity', 'portionUnit', 'portionsProduced', 'portionCost', 'station'];

        this.parseFile = async function (file, delimiter) {
            return await CSVParser.parseFile(file, delimiter);
        };

        this.parseGenericFile = async function (file, delimiter, headers) {
            const rowData = await CSVParser.parseFile(file, delimiter);
            const menuItems = CSVParser.processParseData(headers, rowData);

            return menuItems.map((item) => {
                item.date = formatDate(item.date);

                item.portionUnit = 'Grams';
                item.portionsProduced = (item.portionsProduced) ? parseInt(item.portionsProduced) : null;
                item.portionCost = (item.portionCost) ? parseFloat(item.portionCost) : null;
                item.portionQuantity = (item.portionQuantity) ? Math.round(parseFloat(item.portionQuantity) * 100) / 100 : null;

                return item;
            });
        };

        this.parseUConnMenu = async function (file, delimiter) {
            const rowData = await CSVParser.parseFile(file, delimiter);
            const indexes = [10, 0, 3, 5, 1, -1, -1, -1, -1, -1];
            const menuItems = CSVParser.rowsToFilteredObject(rowData, indexes, ColumnNames);

            return menuItems.map((item) => {
                item.date = formatDate(item.date);

                return item;
            });
        };

        this.parseConnCollegeMenu = async function (file, delimiter) {
            const rowData = await CSVParser.parseFile(file, delimiter);
            const indexes = [9, -1, 2, 4, 0, -1, -1, -1, -1, -1];
            const menuItems = CSVParser.rowsToFilteredObject(rowData, indexes, ColumnNames);

            return menuItems.map((item) => {
                item.date = formatDate(item.date);

                return item;
            });
        };

        this.parseTuftsMenu = async function (file, delimiter) {
            const rowData = await CSVParser.parseFile(file, delimiter);
            const indexes = [5, 1, 3, 4, 2, 9, 10, -1, 8, 7];
            const menuItems = CSVParser.rowsToFilteredObject(rowData, indexes, ColumnNames);

            return menuItems.map((item) => {
                item.date = formatDate(item.date);

                return item;
            });
        };

        this.parseCbordMenu = async function (file, delimiter) {
            const rowData = await CSVParser.parseFile(file, delimiter);
            const indexes = [2, -1, 5, 1, 0, 6, -1, 3, 4, -1];
            const menuItems = CSVParser.rowsToFilteredObject(rowData, indexes, ColumnNames);

            return menuItems.map((item) => {
                item.date = formatDate(item.date);
                item.portionUnit = 'Grams';
                item.portionsProduced = (item.portionsProduced) ? parseInt(item.portionsProduced) : null;
                item.portionCost = (item.portionCost) ? parseFloat(item.portionCost) : null;
                item.portionQuantity = (item.portionQuantity) ? Math.round(parseFloat(item.portionQuantity) * 100) / 100 : null;

                return item;
            });
        };

        this.parseRICMenu = async function (file, delimiter) {
            const rowData = await CSVParser.parseFile(file, delimiter);
            const indexes = [2, -1, 4, 1, 0, 5, -1, -1, -1, -1];
            const menuItems = CSVParser.rowsToFilteredObject(rowData, indexes, ColumnNames);

            return menuItems.map((item) => {
                item.date = formatDate(item.date);
                item.portionUnit = 'Grams';
                item.portionsProduced = (item.portionsProduced) ? parseInt(item.portionsProduced) : null;
                item.portionCost = (item.portionCost) ? parseFloat(item.portionCost) : null;
                item.portionQuantity = (item.portionQuantity) ? Math.round(parseFloat(item.portionQuantity) * 100) / 100 : null;

                return item;
            });
        };

        this.parseRISDMenu = async function (file, delimiter) {
            const rowData = await CSVParser.parseFile(file, delimiter);
            const indexes = [3, -1, 1, 2, 0, -1, -1, 5, 6, -1];
            const menuItems = CSVParser.rowsToFilteredObject(rowData, indexes, ColumnNames);

            return menuItems.map((item) => {
                item.date = formatDate(item.date);

                return item;
            });
        };

        this.processMeals = (menuItems) => {
            // TODO: Make this function name more descriptive
            // TODO: Handle a wider variety of cases in a more elegant manner
            // E.g. Brunch maps to Breakfast + Lunch; All Day maps to Breakfast + Lunch + Dinner
            const brunchItems = menuItems.filter(x => x.meal && (x.meal.toLowerCase() === 'brunch'));
            const breakfastItems = brunchItems.map((x) => {
                x.meal = 'breakfast';
                return x;
            });

            const lunchItems = brunchItems.map((x) => {
                x.meal = 'lunch';
                return x;
            });

            menuItems = menuItems.concat(breakfastItems).concat(lunchItems);
            return menuItems.filter(x => x.meal && (x.meal.toLowerCase() !== 'brunch'));
        };

        function formatDate(dateString) {
            try {
                return new Date(dateString).toISOString().substring(0, 10);
            } catch (e) {
                return '';
            }
        }

        // TODO: Resolve why renaming the item groups is not working
        this.processMenuData = async (locations, menuData, forceUpdateItems) => {
            const menuItemGroups = CollectionUtilities.groupBy(menuData, 'location');
            const renamedItemGroups = this.applyLocationAliases(locations, menuItemGroups);
            const filteredItemGroups = applyLocationFilter(locations, renamedItemGroups);
            const itemGroupIds = Object.keys(filteredItemGroups);

            const existingItemGroups = {};
            const lookupPromises = [];
            for (let i = 0; i < itemGroupIds.length; i++) {
                const id = itemGroupIds[i];
                const dateRange = getDateRange(filteredItemGroups[id]);
                const promise = MenuService.getItems(id, dateRange.start, dateRange.end)
                    .then((results) => {
                        existingItemGroups[id] = results;
                    });

                lookupPromises.push(promise);
            }
            await Promise.all(lookupPromises);

            return checkDifferences(existingItemGroups, filteredItemGroups, forceUpdateItems);
        }

        function applyLocationFilter(locations, menuItemGroups) {
            const filteredGroups = {};

            for (let i = 0; i < locations.length; i++) {
                const locationName = locations[i].name;
                const locationAlias = locations[i].alias;
                const menuItemKeys = Object.keys(menuItemGroups);
                const menuItemKey = menuItemKeys.find(x => x.includes(locationAlias));

                if (menuItemGroups[locationName]) {
                    filteredGroups[locations[i].id] = menuItemGroups[locationName];
                } else if (menuItemKey) {
                    filteredGroups[locations[i].id] = menuItemGroups[menuItemKey];
                }
            }

            return filteredGroups;
        }

        function getDateRange(menuItems) {
            const groupByDate = CollectionUtilities.groupBy(menuItems, 'date');
            const dates = Object.keys(groupByDate).sort((a, b) => {
                return a.date - b.date;
            });

            return {
                start: dates[0],
                end: dates[dates.length - 1],
            };
        }

        function checkDifferences(existingItemGroups, parsedItemGroups, forceUpdateItems) {
            const newItems = {};
            const updatedItems = {};

            Object.keys(parsedItemGroups).forEach((id) => {
                const parsedGroup = parsedItemGroups[id];
                const existingGroup = existingItemGroups[id];

                const compare = compareMenuItems(existingGroup.data, parsedGroup, forceUpdateItems);

                if (compare.newItems.length > 0) {
                    newItems[id] = compare.newItems;
                }
                if (compare.updatedItems.length > 0) {
                    updatedItems[id] = compare.updatedItems;
                }
            });

            return {
                newItems,
                updatedItems,
            };
        }

        function compareMenuItems(existingItems, parsedItems, forceUpdateItems) {
            const newItems = [];
            const updatedItems = [];

            parsedItems.forEach((item) => {
                let search = null;
                for (let i = 0; i < existingItems.length; i++) {
                    const test = existingItems[i];
                    if (item.name === test.name && item.date === test.date.substring(0, 10) && item.meal === test.meal) {
                        search = test;
                        i = existingItems.length;
                    }
                }

                if (search === null) {
                    newItems.push(item);
                } else {
                    item.portionQuantity = (item.portionQuantity) ? item.portionQuantity : null;
                    item.portionUnit = (item.portionUnit) ? item.portionUnit : null;
                    item.portionsProduced = (item.portionsProduced) ? item.portionsProduced : null;
                    item.portionCost = (item.portionCost) ? item.portionCost : null;

                    if (forceUpdateItems || item.portionQuantity !== search.portionQuantity || item.portionUnit !== search.portionUnit ||
                        item.portionsProduced !== search.portionsProduced || item.portionCost !== search.portionCost) {
                        item.id = search.id;
                        updatedItems.push(item);
                    }
                }
            });

            return {
                newItems,
                updatedItems,
            };
        }

        function renameGroup(locationName, menuItems) {
            for (let i = 0; i < menuItems.length; i++) {
                menuItems[i].location = locationName;
            }
        }

        this.applyLocationAliases = (locations, menuItemGroups) => {
            const itemGroupKeys = Object.keys(menuItemGroups);
            const duplicatedMenuItemGroups = JSON.parse(JSON.stringify(menuItemGroups));

            for (let i = 0; i < locations.length; i++) {
                const locationName = locations[i].name;
                const locationAlias = locations[i].alias;
                if (locationAlias && (locationAlias !== locationName)) {
                    if (itemGroupKeys.includes(locationAlias)) {
                        renameGroup(locationName, duplicatedMenuItemGroups[locationAlias]);

                        if (duplicatedMenuItemGroups[locationName]) {
                            duplicatedMenuItemGroups[locationName].concat(duplicatedMenuItemGroups[locationAlias]);
                        } else {
                            duplicatedMenuItemGroups[locationName] = duplicatedMenuItemGroups[locationAlias];
                        }
                        duplicatedMenuItemGroups[locationAlias] = null;
                    }
                }
            }

            return menuItemGroups;
        }
    });
};