const moment = require("moment/moment");

const dateMod = (activity) => {
    // "on 09/02/2022 at 10:01PM"
    // "    1  2   3      7  5"
    // "123456789012345678901234"

    const date1 = parseInt(activity.date.slice(3, 5)) - 1
    const date2 = parseInt(activity.date.slice(6, 8))
    const date3 = parseInt(activity.date.slice(9, 13))
    let date4 = parseInt(activity.date.slice(17, 19))
    const date5 = parseInt(activity.date.slice(20, 22))
    const date6 = parseInt(activity.date.slice(22, 24))

    if (date6 === "PM") {
        date4 = date4 + 12
    }
    const date7 = new Date(date3, date1, date2, date4, date5)

    return moment(date7).format();

}

module.exports = dateMod