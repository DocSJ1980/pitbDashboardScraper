const cheerio = require('cheerio')
const uploadActivity = require('./uploadActivity')

const scrape = async (page, activityData) => {
    let $ = cheerio.load(activityData.html)
    let rowSelector = "#p_table > tbody > tr"

    const keys = ['sr', 'pitbid', 'district', 'town', 'uc', 'department', 'tag', 'larva', 'dengueLarva', 'lat', 'long', 'pics', 'timeDiff', 'userName', 'date', 'bogus']


    $(rowSelector).each(async function (parentIdx, parentElm) {
        const activity = {}
        let keyIdx = 0
        $(parentElm).children().each(async (childIdx, childElm) => {
            let picsBoth = []
            let td = $(childElm)
            let tdValue = $(childElm).text()
            $(td).find('a').each((i, part) => {
                const $part = $(part)
                picsBoth.push($part.attr('href'))
            })

            if (keyIdx === 10) {
                tdValue = picsBoth
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
        await page.waitForTimeout(1000)
        await uploadActivity(activity)
        console.log(`Activity number ${parentIdx + 1} scrapped`)
    })
}



module.exports = scrape