const cheerio = require('cheerio')
const uploadActivity = require('./uploadActivity')
const dateMod = require("./dateMod")
const batchUploadActivity = require('./batchUploadActivity')


const scrape = async (page, activityData) => {
    let $ = cheerio.load(activityData.html)
    let rowSelector = "#p_table > tbody > tr"
    const allActivities = []

    const keys = ['sr', 'pitbid', 'district', 'town', 'uc', 'department', 'tag', 'larva', 'dengueLarva', 'lat', 'long', 'pics', 'timeDiff', 'userName', 'dateSubmitted', 'bogus']


    $(rowSelector).each(async function (parentIdx, parentElm) {
        const activity = {}
        let keyIdx = 0
        await new Promise(resolve => {
            $(parentElm).children().each(async (childIdx, childElm) => {
                let picsBoth = []
                let td = $(childElm)
                let tdValue = $(childElm).text()
                $(td).find('a').each((i, part) => {
                    const $part = $(part)
                    picsBoth.push(`https://dashboard.tracking.punjab.gov.pk${$part.attr('href')}`)
                    // console.log(picsBoth)
                })

                if (keyIdx === 10) {
                    tdValue = picsBoth
                }

                if (keyIdx === 13) {
                    tdValue = dateMod(tdValue)
                }

                if (keyIdx === 14) {
                    const bogus = $('button', $(childElm).html()).attr('onclick')
                    if (bogus === undefined) {
                        tdValue = "Bogus Activity"
                    } else {
                        tdValue = `https://dashboard.tracking.punjab.gov.pk${bogus.substring(17)}`
                    }
                }

                if (childIdx) {
                    activity[keys[childIdx]] = tdValue
                    keyIdx++
                }
            })
            const coordinates = [activity.long, activity.lat]
            const location = { coordinates }
            const beforePic = activity.pics[0]
            const afterPic = activity.pics[1]
            activity.location = location
            activity.beforePic = beforePic
            activity.afterPic = afterPic
            delete activity.long
            delete activity.lat
            delete activity.pics
            allActivities.push(activity)
            // console.log(`Activity number ${parentIdx + 1} scrapped`)
            resolve()
        })
    })
    // console.log(allActivities)
    batchUploadActivity(allActivities)
}



module.exports = scrape