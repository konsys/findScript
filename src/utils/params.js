const path = require("path");

const DEFAULT_ARGS = [
  "--disable-background-networking",
  "--enable-features=NetworkService,NetworkServiceInProcess",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-extensions-with-background-pages",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-extensions",
  // BlinkGenPropertyTrees disabled due to crbug.com/937609
  "--disable-features=TranslateUI,BlinkGenPropertyTrees",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-popup-blocking",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-sync",
  "--force-color-profile=srgb",
  "--metrics-recording-only",
  "--no-first-run",
  "--enable-automation",
  "--password-store=basic",
  "--use-mock-keychain",
];

const window_height = 768;
const window_width = 1366;

const assetsDir = path.resolve(`${__dirname}/../../assets/`);
const assetsLinksDir = path.resolve(`${__dirname}/../../assets/links/`);

const chromeUserDirectory =
  "C:\\Users\\ksysuev\\AppData\\Local\\Chromium\\User Data";

const videoDownloadInterval = 20;
const videoNumFromSearch = 20;
const scrollDownSearch = 40;

module.exports = {
  DEFAULT_ARGS,
  chromeUserDirectory,
  window_width,
  window_height,
  videoDownloadInterval,
  videoNumFromSearch,
  scrollDownSearch,
  assetsDir,
  assetsLinksDir,
};
