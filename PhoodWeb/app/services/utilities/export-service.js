const DateUtilities = require('./date-utilities');

exports.exportCSV = function (records) {
    let csvContent = 'data:application/csv;charset=UTF-8,';
    const headers = ['Date Discarded', 'Date Produced', 'Location', 'Item', 'Quantity', 'Value', 'Number of Portions', 'Meal', 'Unit', 'Action', 'Reason'];

    csvContent += `${headers.join(',')}\n`;
    const data = records;
    data.reverse();

    for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        const dateProd = DateUtilities.isoToMMDDYYYY(obj.dateProduced);

        const values = [DateUtilities.isoToHHMMMMDDYYYYY(obj.loggedTime), dateProd, obj.locationName, obj.itemName, obj.quantity, obj.valueActioned, obj.portionsActioned, obj.meal, obj.unit, obj.actionTaken, obj.actionReason];
        csvContent += `${values.join(',')}\n`;
    }

    const encodedURI = encodeURI(csvContent);
    const link = document.createElement('a');
    const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
    });

    const d = new Date();
    let dformat = [
            d.getMonth() + 1,
            d.getDate(),
            d.getFullYear()].join('-') + ' ' + [d.getHours(), d.getMinutes()
        ].join('');

    if (d.getHours() < 12) {
        dformat += 'am';
    } else {
        dformat += 'pm';
    }

    link.setAttribute('id', 'blah');
    link.setAttribute('href', encodedURI);
    link.setAttribute('download', `Phood Log Export ${dformat}.csv`);
    link.dispatchEvent(clickEvent);
};