const { default: axios } = require("axios")

const isoDate = async () => {
    const rerun = "rerun"
    try {
        lastActivityDate = await axios.get('http://backend.sjcloud.ga:5231/simples/fetchlastsimples')
        return lastActivityDate.data
    }
    catch (error) {
        if (error.response) {
            // The client was given an error response (5xx, 4xx)
            console.log("No response from the server. Sending request again")
            return rerun
        } else if (error.request) {
            // The client never received a response, and the request was never left
            console.log("Sorry request could not be sent. Sending request again")
            return rerun
        } else {
            // Anything else
            console.log(error, "Something went wrong. Sending request again")
            return rerun
        }
    }
}

module.exports = isoDate
