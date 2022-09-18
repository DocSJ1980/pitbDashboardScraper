const { default: axios } = require('axios')
const cheerio = require('cheerio')
const dateMod = require('./dateMod')

const scrape = async (activityData) => {
    let $ = cheerio.load(activityData.html)
    let rowSelector = "#p_table > tbody > tr"

    const keys = ['sr', 'pitbid', 'district', 'town', 'uc', 'department', 'tag', 'larva', 'dengueLarva', 'lat', 'long', 'pics', 'timeDiff', 'userName', 'date', 'bogus']


    $(rowSelector).each(async function (parentIdx, parentElm) {
        const activity = {}
        let keyIdx = 0
        $(parentElm).children().each((childIdx, childElm) => {
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
        try {
            await uploadActivity(activity)
        } catch (error) {
            console.log(error)
        }
        console.log(`Activity number ${parentIdx + 1} scrapped`)
    })
}

const uploadActivity = async (activity) => {
    // "on 09/02/2022 at 10:01PM"
    const aDate = dateMod(activity)
    const dateSubmitted = new Date(aDate)
    // console.log(dateSubmitted)
    // console.log(aDate)
    axios({
        method: 'post',
        url: 'http://scraper.sjcloud.ga:5232/simples/new',
        data: {
            pitbid: activity.pitbid,
            district: activity.district,
            town: activity.town,
            uc: activity.uc,
            department: activity.department,
            tag: activity.tag,
            larva: activity.larva,
            dengueLarva: activity.dengueLarva,
            lat: activity.lat,
            long: activity.long,
            beforePic: `https://dashboard.tracking.punjab.gov.pk${activity.pics[0]}`,
            afterPic: `https://dashboard.tracking.punjab.gov.pk${activity.pics[1]}`,
            timeDiff: activity.timeDiff,
            userName: activity.userName,
            dateSubmitted: dateSubmitted,
            bogus: activity.bogus
        }
    })
}

module.exports = scrape