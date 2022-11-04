// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
// const restartSeq = require('./restartSeq');
const calcPages = require('./calcPages');

// add recaptcha plugin and provide it your 2captcha token (= their apiKey)
// 2captcha is the builtin solution provider but others would work as well.
// Please note: You need to add funds to your 2captcha account for this to work
puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: process.env.API_KEY // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
        },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
)
// puppeteer usage as normal
// Launch Browser
let sessionCount = 1
const pageScraper = () => puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: '/usr/bin/chromium-browser',
    args: [
        "--no-sandbox",
        "--disable-gpu",
    ]
})
    // Scraping Logic
    .then(async browser => {
        //Login
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0)
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
        console.log("Login successful")
        await calcPages(page, sessionCount)
        await browser.close()
        // await restartSeq(page)
        sessionCount++
        await pageScraper()
    })

module.exports = pageScraper

