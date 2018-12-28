// Reformat 2015-09-03 14:44:23 to 2:24 PM 09/03/16
exports.reorderTime = function (date) {
    let amOrPm = 'AM';

    let hours = Number(date.getHours());
    if (hours === 12) {
        amOrPm = 'PM';
    } else if (hours >= 13) {
        hours -= 12;
        amOrPm = 'PM';
    }

    let minutes = Number(date.getMinutes());
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    const month = Number(date.getMonth()) + 1;
    const year = String(date.getYear()).substring(1);

    return `${hours}:${minutes} ${amOrPm} on ${month}/${date.getDate()}/${year}`;
};

exports.isoToHHMMMMDDYYYYY = (date) => {
    let amOrPm = 'AM';

    let hours = Number(date.getHours());
    if (hours === 12) {
        amOrPm = 'PM';
    } else if (hours >= 13) {
        hours -= 12;
        amOrPm = 'PM';
    }

    let minutes = Number(date.getMinutes());
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    const month = Number(date.getMonth()) + 1;
    const year = String(date.getYear()).substring(1);

    return `${hours}:${minutes} ${amOrPm} ${month}/${date.getDate()}/${year}`;
};

exports.getWeekNumber = function (d) {
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate((d.getUTCDate() + 4) - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

exports.getDateOfWeek = function (w, y) {
    const d = (1 + ((w - 1) * 7)); // 1st of January + 7 days for each week

    return new Date(y, 0, d);
};

exports.toLocalDate = function (jsDate) {
    const localDate = new Date(jsDate.getTime() + (1000 * 60 * jsDate.getTimezoneOffset()));
    const dateParts = [localDate.getFullYear(), localDate.getMonth(), localDate.getDate()];

    dateParts[1] = parseInt(dateParts[1], 10) + 1;

    for (let i = 1; i < dateParts.length; i++) {
        if (parseInt(dateParts[i], 10) < 10) {
            dateParts[i] = `0${dateParts[i]}`;
        }
    }

    return dateParts.join('-');
};

exports.isoToMMDDYYYY = function (iso) {
    const date = new Date(iso);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = `0${dt}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }

    return `${month}-${dt}-${year}`;
};

exports.isoToYYYYMMDD = function (iso) {
    const date = new Date(iso);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = `0${dt}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }

    return `${year}-${month}-${dt}`;
};

exports.computeStartDate = function (duration) {
    const end = new Date();
    let start = new Date();

    if (duration === 'week') {
        start = new Date(end.getTime() - (7 * 24 * 60 * 60 * 1000));
    } else if (duration === 'month') {
        start = new Date(end.getTime() - (30 * 24 * 60 * 60 * 1000));
    } else if (duration === 'semester') {
        const month = start.getMonth();
        const year = start.getFullYear();

        if (month < 5) {
            start = new Date(year, 0, 1, 0, 0, 0, 0);
        } else if (month >= 5 && month <= 6) {
            start = new Date(year, 5, 1, 0, 0, 0, 0);
        } else {
            start = new Date(year, 7, 1, 0, 0, 0, 0);
        }
    }

    return start;
};