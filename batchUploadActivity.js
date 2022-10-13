const { default: axios } = require("axios")
const logger = require("./logger")

const batchUploadActivity = async (allActivities) => {
    try {
        const res = await axios({
            method: 'post',
            url: 'http://scraper.sjcloud.ga:5232/simples/batch',
            data: {
                allActivities: allActivities
            }
        })
        console.log(await res.data)
        logger.activityLogger.log('info', res.data)
    } catch (error) {
        console.log(await error.message)
        logger.activityLogger.log('error', error.message)
    }
}

module.exports = batchUploadActivity