const { default: axios } = require("axios")
const logger = require("./logger")

const batchUploadActivity = async (allActivities) => {
    try {
        const res = await axios({
            method: 'post',
            url: 'http://backend.sjcloud.ga:5231/simples/batch',
            data: {
                allActivities: allActivities
            }
        })
        console.log(res.data)
        logger.activityLogger.log('info', res.data)
    } catch (error) {
        console.log(error.message)
        logger.activityLogger.log('error', error.message)
    }
}

module.exports = batchUploadActivity