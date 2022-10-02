const { default: axios } = require("axios")
const dateMod = require("./dateMod")
const logger = require("./logger")

const uploadActivity = async (activity) => {
    const dateSubmitted = await dateMod(activity)
    // console.log(dateSubmitted)
    try {
        const res = await axios({
            method: 'post',
            url: 'http://scraper.sjcloud.ga:5232/simples/new',
            data: {
                pitbid: activity.pitbid,
                district: activity.district,
                town: activity.town,
                uc: activity.uc,
                department: activity.department,
                tag: activity.tag,
                larvaFound: activity.larva,
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
        console.log(res.data)
        logger.activityLogger.log('info', res.data)
    } catch (error) {
        console.log(error.message)
        logger.activityLogger.log('error', error.message)
    }
}

module.exports = uploadActivity