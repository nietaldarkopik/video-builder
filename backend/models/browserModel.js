const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteerExtra.use(AdblockerPlugin());

async function getMediaFromPage(url) {
    const browser = await puppeteerExtra.launch({ headless: false,/* devtools:true, */executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
    const page = await browser.newPage();
    let iframes = [];
    await page.goto(url);
    await page.setDefaultNavigationTimeout(0)
    // Wait for some time to ensure that media on the page gets loaded
    //await page.waitForTimeout(3000);
    await page.waitForSelector('#ads-pop span', { timeout: 5000 }); // Timeout in milliseconds
    await page.click('#ads-pop span');

    await page.waitForSelector('#player-iframe', { timeout: 5000 });
    //await page.waitForSelector('iframe', { timeout: 5000 });

    let mediaList = await page.evaluate(() => {
        window.debuger = false;
        const xx = Array.from(document.querySelectorAll('video, iframe'));
        //const iframe = frame.$('video');
        const zz = xx.map((element) => ({
            src: element.src,
            type: element.tagName.toLowerCase(),
            attributes: element.attributes,
        }));
        return zz;
    });

    const iframeElementHandle = await page.$('#player-iframe');
    const frame = await iframeElementHandle.contentFrame();
    //await frame.setDefaultNavigationTimeout(0) 
    //await frame.waitForNavigation({ waitUntil: 'networkidle0' });

    const mediaList2 = await frame.evaluate(() => {
        const xx = Array.from(document.querySelectorAll('video, iframe'));
        //const iframe = frame.$('video');
        const zz = xx.map((element) => ({
            src: element.src,
            type: element.tagName.toLowerCase(),
            attributes: element.attributes,
        }));
        return zz;
    });
    mediaList = [...mediaList, ...mediaList2]
    console.log(mediaList);

    // Get the iframe element handle
    //const targetWord = 'Skip Ad &gt;&gt;';

    //frame.waitForSelector('#player-ads', { timeout: 5000 });
    //frame.click('#player-ads');
    /* 
        const mediaList = await frame.evaluate((frame,page) => {
    
            console.log(frame);
            console.log(page);
            // Switch to the iframe's context
            frame.waitForSelector('#player-ads', { timeout: 5000 });
            frame.click('#player-ads');
    
            //<div id="skip-ads" style="display: block; cursor: pointer;">Skip Ad &gt;&gt;</div>
            //await page.waitForSelector('#loadProviders', { timeout: 5000 }); // Timeout in milliseconds
            //const element = await page.$('#loadProviders');
            //await page.click('#loadProviders a');
            //await page.touchscreen.tap('#loadProviders a');
    
            const mediaElements = Array.from(document.querySelectorAll('img, video'));
            //const mediaElements = frame.$('img, video');
            return mediaElements.map((element) => ({
                src: element.src,
                type: element.tagName.toLowerCase(),
            }));
        },frame,page);
     */
    /* 
        await frame.waitForFunction((targetWord,fr) => {
            fr.waitForSelector('#skip-ads');
            const elements = document.querySelectorAll('#skip-ads');
            for (const element of elements) {
                if (element.textContent.includes(targetWord)) {
                    fr.click('#skip-ads')
                    return true;
                }
            }
            return false;
        }, {}, targetWord,frame); */


    //await browser.close();
    return mediaList;
}

const url = 'https://terbit21.gold/anatomy-of-hell-2004/'; // Replace with the URL of the page you want to scrape
//const url = 'https://t21.press/play-3.php?movie=anatomy-of-hell-2004&iframe=gdframe'; // Replace with the URL of the page you want to scrape
getMediaFromPage(url)
    .then((mediaList) => {
        console.log('Loaded Media on the Page:');
        console.log(mediaList);
    })
    .catch((err) => console.error('Error:', err));
