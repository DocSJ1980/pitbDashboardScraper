// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
const fs = require('fs/promises')
const writeFileSync = require("fs").writeFileSync;
const cheerio = require('cheerio')

// add recaptcha plugin and provide it your 2captcha token (= their apiKey)
// 2captcha is the builtin solution provider but others would work as well.
// Please note: You need to add funds to your 2captcha account for this to work
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
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
puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
})
    // Scraping Logic
    .then(async browser => {
        //Login
        const page = await browser.newPage()
        await page.goto('https://dashboard.tracking.punjab.gov.pk')
        await page.type("#user_username", "web.dept.dcorawalpindi.10029")
        await page.type("#user_password", "12344321")
        // That's it, a single line of code to solve reCAPTCHAs 🎉
        // await page.solveRecaptchas()
        await page.waitForTimeout(1000)
        await Promise.all([
            page.waitForNavigation(),
            page.click(`#new_user button`)
        ])
        // Navigating to Activities page
        // const datefrom = '2022-09-02T22:00'
        // const dateto = '2022-09-02T23:59'
        await page.goto('https://dashboard.tracking.punjab.gov.pk/activities/simples/line_list')
        await page.type("#department", "DHA Rawalpindi")

        await page.$eval('#datefrom', el => el.value = '2022-09-02T22:00')
        await page.$eval('#dateto', el => el.value = '2022-09-02T23:59')

        await Promise.all([
            page.waitForNavigation(),
            page.click('body > div.app-admin-wrap.layout-horizontal-bar.clearfix > div > div.row.p-custom > div:nth-child(5) > button'),
        ])

        //Calculating pages
        const pageData = await page.evaluate(() => {
            return { html: document.documentElement.innerHTML }
        })
        const activityArr = []
        const $ = cheerio.load(pageData.html)
        const pagination = $('.apple_pagination:nth-child(2)').text()
        const pages = Math.ceil(pagination.substring(15) / 20)
        console.log(pages)
        // Iterating through columns
        for (let i = 1; i < pages + 1; i++) {
            await page.waitForTimeout(1000)

            const activityUrl = `https://dashboard.tracking.punjab.gov.pk/activities/simples/line_list?act_tag=&datefrom=$2022-09-02T22:00&dateto=2022-09-02T23:59&department=129&district_id=&larva_type=&page=${i}&tehsil_id=&uc=`
            await page.goto(activityUrl)

            let activityData = await page.evaluate(() => {
                return { html: document.documentElement.innerHTML }
            })
            await page.waitForTimeout(1000)
            await scrape(activityData)
            console.log(`Page ${i} scraped successfully.`)

            // await page.click('.next_page')
            // console.log(activityArr)

        }
        await page.screenshot({ path: 'response.png', fullPage: true })
        await browser.close()



    })

const scrape = async (activityData) => {
    let $ = cheerio.load(activityData.html)
    let table = $('#p_table')
    let rowSelector = "#p_table > tbody > tr"

    const keys = ['sr', 'id', 'district', 'town', 'uc', 'tag', 'larva', 'dengueLarva', 'lat', 'long', 'pics', 'timeDiff', 'user', 'activityTime', 'bogus']


    $(rowSelector).each((parentIdx, parentElm) => {
        let keyIdx = 0
        const activity = {}
        let picsBoth = []
        $(parentElm).children().each((childIdx, childElm) => {
            let td = $(childElm)
            let tdValue = $(childElm).text()
            $(td).find('a').each((i, part) => {
                const $part = $(part)
                picsBoth.push($part.attr('href'))
            })

            if (keyIdx === 10) {
                // picsBoth.beforePic = $('a:first-child', $(childElm).html()).attr('href')
                // picsBoth.afterPic = $('a:nth-child(2)', $(childElm).html()).attr('href')
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

            if (tdValue) {
                activity[keys[keyIdx]] = tdValue


                keyIdx++
            }
        })
        console.log(activity)
    })
    // return scrape() // run the loop again
}

