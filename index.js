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
        await page.solveRecaptchas()
        // await page.waitForTimeout(15000)
        await Promise.all([
            page.waitForNavigation(),
            page.click(`#new_user button`)
        ])
        // Navigating to Activities page
        await page.goto('https://dashboard.tracking.punjab.gov.pk/activities/simples/line_list')
        await page.type("#department", "DHA Rawalpindi")
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.keyboard.press("0");
        await page.keyboard.press("9");
        await page.keyboard.press("0");
        await page.keyboard.press("2");
        await page.keyboard.press("2");
        await page.keyboard.press("0");
        await page.keyboard.press("2");
        await page.keyboard.press("2");
        await page.keyboard.press("Tab");
        await page.keyboard.press("1");
        await page.keyboard.press("0");
        await page.keyboard.press("0");
        await page.keyboard.press("0");
        await page.keyboard.press("p");
        await page.keyboard.press("Tab");
        await page.keyboard.press("0");
        await page.keyboard.press("9");
        await page.keyboard.press("0");
        await page.keyboard.press("2");
        await page.keyboard.press("2");
        await page.keyboard.press("0");
        await page.keyboard.press("2");
        await page.keyboard.press("2");
        await page.keyboard.press("Tab");
        await page.keyboard.press("1");
        await page.keyboard.press("1");
        await page.keyboard.press("5");
        await page.keyboard.press("9");
        await page.keyboard.press("p");

        await Promise.all([
            page.waitForNavigation(),
            page.click('body > div.app-admin-wrap.layout-horizontal-bar.clearfix > div > div.row.p-custom > div:nth-child(5) > button'),
        ])
        // Loading HTML data in cheerio and selecting table
        const pageData = await page.evaluate(() => {
            return { html: document.documentElement.innerHTML }
        })

        const $ = cheerio.load(pageData.html)
        const table = $('#p_table')
        const rowSelector = "#p_table > tbody > tr"

        const keys = ['sr', 'id', 'district', 'town', 'uc', 'tag', 'larva', 'dengueLarva', 'lat', 'long', 'pics', 'timeDiff', 'user', 'activityTime', 'bogus']

        // Iterating through columns
        $(rowSelector).each((parentIdx, parentElm) => {
            let keyIdx = 0
            const activity = {}
            const picsBoth = []
            $(parentElm).children().each((childIdx, childElm) => {
                let tdValue = $(childElm).text()

                if (keyIdx === 10) {
                    const beforePic = $('a:first-child', $(childElm).html()).attr('href')
                    const afterPic = $('a:nth-child(2)', $(childElm).html()).attr('href')
                    picsBoth.push({
                        'before': `https://dashboard.tracking.punjab.gov.pk${beforePic}`,
                        'after': `https://dashboard.tracking.punjab.gov.pk${afterPic}`
                    })
                    tdValue = picsBoth
                }

                if (keyIdx === 14) {
                    const bogus = $('button', $(childElm).html()).attr('onclick')
                    if (bogus === undefined) {
                        tdValue = "Bogus Activity"
                    } else {
                        tdValue = `https://dashboard.tracking.punjab.gov.pk${bogus.substr(17)}`
                    }
                }

                if (tdValue) {
                    activity[keys[keyIdx]] = tdValue

                    keyIdx++
                }
            })
            console.log(activity)
        })
        await page.screenshot({ path: 'response.png', fullPage: true })
        await browser.close()



    })