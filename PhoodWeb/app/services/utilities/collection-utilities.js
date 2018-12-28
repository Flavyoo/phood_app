exports.flatten = function (arrays) {
    if (arrays && Array.isArray(arrays) && arrays.length > 0) {
        return [].concat.apply([], arrays);
    }

    return [];
};

exports.groupBy = function (array, keyOrIterator) {
    let iterator;
    let key;

    // use the function passed in, or create one
    if (typeof key !== 'function') {
        key = String(keyOrIterator);
        iterator = (item) => {
            return item[key];
        };
    } else {
        iterator = keyOrIterator;
    }

    if (Array.isArray(array)) {
        return array.reduce((memo, item) => {
            const curKey = iterator(item);
            memo[curKey] = memo[curKey] || [];
            memo[curKey].push(item);
            return memo;
        }, {});
    }

    console.warn(`Failed to group null array with key ${keyOrIterator}`);
    return {};
};

exports.unique = function (array) {
    return array.filter((item, i, ar) => { return ar.indexOf(item) === i; });
};

exports.sumQuantityByProperty = function (array, property) {
    const objectGroupedByProperty = exports.groupBy(array, property);
    const uniqueProperties = exports.unique(array.map(x => x[property]));

    return uniqueProperties.reduce((memo, currentProperty) => {
        const subarray = objectGroupedByProperty[currentProperty];

        const total = subarray.reduce((m, obj) => {
            return m + parseFloat(obj.quantity);
        }, 0);

        memo.push({
            key: currentProperty,
            value: Math.floor(total),
        });

        return memo;
    }, []);
};

/**
 * Take in an array of objects
 * Add keys with the first letter capitalized, for cases such as where the key is "BREAKFAST" and won't match "Breakfast"
 */
exports.capitalizeFirstLetterOfArrayKeys = (objectArray) => {
    const sanitizedArray = JSON.parse(JSON.stringify(objectArray));

    for (let i = 0; i < sanitizedArray.length; i++) {
        const keys = Object.keys(sanitizedArray[i]);

        for (let j = 0; j < keys.length; j++) {
            // Take the first character, capitalize it, and then add on the rest of the lowercase string
            const correctedKey = keys[j].charAt(0).toUpperCase() + keys[j].substr(1).toLowerCase();
            sanitizedArray[i][correctedKey] = sanitizedArray[i][keys[j]];
        }
    }

    return sanitizedArray;
};

exports.unique = function (array) {
    return Array.from(new Set(array));
};