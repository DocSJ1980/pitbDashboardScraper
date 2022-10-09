// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
const fs = require('fs/promises')
const writeFileSync = require("fs").writeFileSync;
const cheerio = require('cheerio')
const scrape = require('./simpleActivityScraper')
const { default: axios } = require("axios")
const moment = require("moment/moment")


// add recaptcha plugin and provide it your 2captcha token (= their apiKey)
// 2captcha is the builtin solution provider but others would work as well.
// Please note: You need to add funds to your 2captcha account for this to work
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const restartSeq = require('./restartSeq');
const isoDate = require('./lastActivityDate');
puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: '08306da0a50bf487eb36b5c746e0269c' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
        },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
)
// puppeteer usage as normal
// Launch Browser
const pageScraper = () => puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
})
    // Scraping Logic
    .then(async browser => {
        //Login
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0)
        await page.goto('https://google.com')
        console.log("Step 1 successful")
        await page.goto('https://dashboard.tracking.punjab.gov.pk', { waitUntil: 'load', timeout: 0 })
        await page.type("#user_username", "web.dept.dcorawalpindi.10029")
        await page.type("#user_password", "12344321")
        // That's it, a single line of code to solve reCAPTCHAs 🎉
        // await page.solveRecaptchas()
        await page.waitForTimeout(1000)
        await Promise.all([
            page.waitForNavigation(),
            page.click(`#new_user button`)
        ])
        console.log("Step 2 successful")

        let datefrom = moment(await isoDate()).add(1, 'm').format("YYYY-MM-DDTHH:mm")
        console.log(datefrom)
        console.log("Received last activity date & time from target database")
        let dateto = moment(datefrom).add(2, 'm').format("YYYY-MM-DDTHH:mm")
        let addMinutes = 2
        let pages = 1
        console.log("Checking for number of available activities")
        while (pages < 5) {
            console.log("Checking for number of activities from: ", datefrom)
            console.log("To: ", dateto)
            const activityUrl = `https://dashboard.tracking.punjab.gov.pk/activities/simples/line_list?act_tag=&datefrom=${datefrom}&dateto=${dateto}&department=129&district_id=&larva_type`
            await page.goto(activityUrl, { waitUntil: 'load', timeout: 0 })
            //Calculating pages
            const pageData = await page.evaluate(() => {
                return { html: document.documentElement.innerHTML }
            })
            const $ = cheerio.load(pageData.html)
            // /html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div[2]/text()
            let pagination = $('.apple_pagination:nth-child(2)').text()
            console.log(pagination)
            pagination = pagination.replace(',', '')
            pages = Math.ceil(pagination.substring(15) / 20)
            console.log(pages)
            if (pages < 5) {
                console.log(`Number of activities very small, increasing date range in steps of ${addMinutes} minutes`)
                dateto = moment(dateto).add(addMinutes, 'm').format("YYYY-MM-DDTHH:mm")
            }
        }
        // Iterating through columns with reverse Loop
        for (let i = pages; i > 0; i--) {
            // Iterating through columns with forward Loop
            // for (let i = 1; i < pages + 1; i++) {
            await page.waitForTimeout(3000)

            const activityUrl = `https://dashboard.tracking.punjab.gov.pk/activities/simples/line_list?act_tag=&datefrom=${datefrom}&dateto=${dateto}&department=129&district_id=&larva_type=&page=${i}&tehsil_id=&uc=`
            await page.goto(activityUrl, { waitUntil: 'load', timeout: 0 })
            console.log(activityUrl)
            let activityData = await page.evaluate(() => {
                return { html: document.documentElement.innerHTML }
            })
            await scrape(page, activityData)
            console.log(`Page ${i} scraped successfully.`)
        }

        await browser.close()
        await restartSeq(page)
        await pageScraper()
    })

module.exports = pageScraper

