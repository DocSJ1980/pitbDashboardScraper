const moment = require("moment/moment");

const dateMod = (tdValue) => {
    // "on 09/02/2022 at 10:01PM"
    // "    1  2   3      7  5"
    // "123456789012345678901234"

    const date1 = parseInt(tdValue.slice(3, 5)) - 1
    const date2 = parseInt(tdValue.slice(6, 8))
    const date3 = parseInt(tdValue.slice(9, 13))
    let date4 = parseInt(tdValue.slice(17, 19))
    const date5 = parseInt(tdValue.slice(20, 22))
    const date6 = tdValue.slice(22, 24)
    if (date6 === "PM" && date4 != 12) {
        date4 = date4 + 12
    }
    if (date6 === "AM" && date4 === 12) {
        date4 = 0
    }
    const date7 = new Date(date3, date1, date2, date4, date5)
    // console.log(date7)
    return moment(date7).format();

}

module.exports = dateMod