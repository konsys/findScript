const puppeteer = require("puppeteer");

const fs = require("fs");
const { sampleSize } = require("lodash");
const useProxy = require("puppeteer-page-proxy");
const {
  DEFAULT_ARGS,
  window_height,
  window_width,
} = require("../utils/params");
const { assetsDir } = require("../utils/params");

async function start() {
  const pr = JSON.parse(fs.readFileSync(assetsDir + "/proxy/proxyJson.json"));
  const proxies = sampleSize(pr, pr.length);

  console.log("Starting browser...");
  const browser = await puppeteer.launch({
    headless: false, // have window
    executablePath: null,
    ignoreDefaultArgs: DEFAULT_ARGS,
    // userDataDir: "C:\\Users\\ksysuev\\puppeterdata",
    // executablePath:
    //   "C:\\Users\\ksysuev\\Google\\Chrome\\Application\\chrome.exe",
    autoClose: false,
    args: [
      "--lang=en-US,en",
      `--window-size=${window_width},${window_height}`,
      "--enable-audio-service-sandbox",
      "--no-sandbox",
      // `--proxy-server=http=${proxies[0]}`,
    ],
  });

  let page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-AU; rv:1.9.2.14) Gecko/20110218 Firefox/3.6.14"
  );
  console.log("setting proxy");
  await useProxy(page, `http://100.24.216.83:80`);

  // const data = await useProxy.lookup(page);

  console.log(proxies[0]);

  await page.goto("https://2ip.ua/ru/", (options = { timeout: 120 * 1000 }));
  // await page.goto("https://ya.ru", (options = { timeout: 120 * 1000 }));
}

start();
