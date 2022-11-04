const puppeteer = require('puppeteer-extra')
const cheerio = require('cheerio')
const scrape = require('./simpleActivityScraper')

const iteratePages = async (page, pages, datefrom, dateto, sessionCount) => {
    for (let i = pages; i > 0; i--) {
        await page.waitForTimeout(3000)

        const activityUrl = `https://dashboard.tracking.punjab.gov.pk/activities/simples/line_list?act_tag=&datefrom=${datefrom}&dateto=${dateto}&department=129&district_id=&larva_type=&page=${i}&tehsil_id=&uc=`
        await page.goto(activityUrl, { waitUntil: 'load', timeout: 0 })
        // console.log(activityUrl)
        let activityData = await page.evaluate(() => {
            return { html: document.documentElement.innerHTML }
        })
        await scrape(page, activityData)
        console.log(`Session: ${sessionCount} - Page: ${i} scraped successfully.`)
    }
}
module.exports = iteratePages