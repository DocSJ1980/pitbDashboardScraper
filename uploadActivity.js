const { default: axios } = require("axios")
const dateMod = require("./dateMod")

const uploadActivity = async (activity) => {
    const dateSubmitted = await dateMod(activity)
    // console.log(dateSubmitted)
    await axios({
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

module.exports = uploadActivity