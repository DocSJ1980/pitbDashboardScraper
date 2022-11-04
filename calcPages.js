const puppeteer = require('puppeteer-extra')
const cheerio = require('cheerio')
const isoDate = require('./lastActivityDate');
const moment = require("moment/moment");
const iteratePages = require('./iteratePages');

const calcPages = async (page, sessionCount) => {
    const dbDate = await isoDate()
    if (dbDate != "rerun") {
        let datefrom = moment(dbDate).format("YYYY-MM-DDTHH:mm")
        // console.log(datefrom)
        // console.log("Received last activity date & time from target database")
        let dateto = moment(datefrom).add(10, 'm').format("YYYY-MM-DDTHH:mm")
        let addMinutes = 10
        let pages = 1
        while (pages < 15) {
            console.log("Checking for number of activities from: ", datefrom, "To: ", dateto)
            const activityUrl = `https://dashboard.tracking.punjab.gov.pk/activities/simples/line_list?act_tag=&datefrom=${datefrom}&dateto=${dateto}&department=129&district_id=&larva_type`
            await page.goto(activityUrl, { waitUntil: 'load', timeout: 0 })
            //Calculating pages
            const pageData = await page.evaluate(() => {
                return { html: document.documentElement.innerHTML }
            })
            const $ = cheerio.load(pageData.html)
            // /html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div[2]/text()
            let pagination = $('.apple_pagination:nth-child(2)').text()
            pagination = pagination.replace(',', '')
            pages = Math.ceil(pagination.substring(15) / 20)
            if (pages < 15) {
                console.log(`Number of activities very small, increasing date range in steps of ${addMinutes} minutes`)
                dateto = moment(dateto).add(addMinutes, 'm').format("YYYY-MM-DDTHH:mm")
            }
        }
        await iteratePages(page, pages, datefrom, dateto, sessionCount)
    }
    else {
        calcPages(page)
    }
}

module.exports = calcPages