const restartSeq = async (page) => {
    console.log("Loop Completed")
    console.log("Starting next loop in 10 seconds")
    await page.waitForTimeout(1000)
    console.log("Starting next loop in 9 seconds")
    await page.waitForTimeout(1000)
    console.log("Starting next loop in 8 seconds")
    await page.waitForTimeout(1000)
    console.log("Starting next loop in 6 seconds")
    await page.waitForTimeout(1000)
    console.log("Starting next loop in 5 seconds")
    await page.waitForTimeout(1000)
    console.log("Starting next loop in 4 seconds")
    await page.waitForTimeout(1000)
    console.log("Starting next loop in 3 seconds")
    await page.waitForTimeout(1000)
    console.log("Starting next loop in 2 seconds")
    await page.waitForTimeout(1000)
    console.log("Starting next loop in 1 seconds")
    await page.waitForTimeout(1000)
    console.log("Reinitializing scraping sequence")
}

module.exports = restartSeq