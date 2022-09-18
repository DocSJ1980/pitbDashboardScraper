const dateMod = (activity) => {
    const date1 = activity.date.slice(3, 5)
    const date2 = activity.date.slice(6, 8)
    const date3 = activity.date.slice(9, 13)
    const date4 = activity.date.slice(17, 19)
    const date5 = activity.date.slice(19, 22)
    const date6 = activity.date.slice(22, 24)
    let date7 = parseInt(date4)

    if (date6 === "PM") {
        date7 = date7 + 12
    }
    return `${date3}-${date1}-${date2}T${date7}${date5}:00+05:00`
}

module.exports = dateMod