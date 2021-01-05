const { assetsDir } = require("../utils/params");
const fs = require("fs");
const puppeteer = require("puppeteer");

const {
  DEFAULT_ARGS,
  window_height,
  window_width,
} = require("../utils/params");

async function getProxy() {
  let browser = await puppeteer.launch({
    headless: false, // have window
    executablePath: null,
    ignoreDefaultArgs: DEFAULT_ARGS,
    userDataDir: "C:\\Users\\ksysuev\\pupproxy",
    // executablePath:
    // "C:\\Users\\ksysuev\\Google\\Chrome\\Application\\chrome.exe",
    autoClose: false,
    args: [
      "--lang=en-RU,ru",
      `--window-size=${window_width},${window_height}`,
      // "--enable-audio-service-sandbox",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // `--proxy-server=http=${proxy}`,
    ],
  });
  let page = await browser.newPage();

  const proxyDir = assetsDir + "/proxy";
  const proxyFile = proxyDir + "/proxyJson.json";
  try {
    fs.mkdirSync(proxyDir, 0744);
  } catch (e) {
    // NOP
  }

  let resArr = [];
  let currentPage = 0;
  for await (let d of Array(12).fill(1)) {
    await page.goto(
      // `https://hidemy.name/ru/proxy-list/?country=RU&type=h&start=${currentPage}#list`,
      // `https://hidemy.name/ru/proxy-list/?type=5&start=${currentPage}#list`,
      `https://hidemy.name/ru/proxy-list/?type=4&start=${currentPage}#list`,
      {
        waitUntil: "networkidle0",
      }
      // (options = { timeout: 120 * 1000 })
    );

    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll("table tr td"));

      const protocols = tds
        .filter((v, k) => {
          if (/HTTP|HTTPS|SOCKS4|SOCKS5/.test(v.innerText)) {
            return true;
          } else {
            return false;
          }
        })
        .map((v, k) => v.innerText);

      const ports = tds
        .filter((v, k) => {
          if (
            /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
              v.innerText
            )
          ) {
            return true;
          } else {
            return false;
          }
        })
        .map((v) => v.innerText);

      const ips = tds
        .filter((v, k) => {
          if (
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
              v.innerText
            )
          ) {
            return true;
          } else {
            return false;
          }
        })
        .map((v, k) => protocols[k] + ":" + v.innerText + ":" + ports[k]);
      return ips;
    });
    resArr = resArr.concat(data);
    currentPage += 64;
  }

  fs.writeFileSync(proxyFile, JSON.stringify(resArr));

  return resArr;
}

getProxy();
// module.exports = { getProxy };
