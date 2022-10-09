const { default: axios } = require("axios")

const isoDate = async () => {
    try {
        lastActivityDate = await axios.get('http://scraper.sjcloud.ga:5232/simples/fetchall')
        return lastActivityDate.data
    }
    catch (error) {
        if (error.response) {
            // The client was given an error response (5xx, 4xx)
            console.log("No response from the server. Sending request again")
            isoDate()
        } else if (error.request) {
            // The client never received a response, and the request was never left
            console.log("Sorry request could not be sent. Sending request again")
            isoDate()
        } else {
            // Anything else
            console.log(error, "Something went wrong. Sending request again")
            isoDate()
        }
    }
}

module.exports = isoDate
