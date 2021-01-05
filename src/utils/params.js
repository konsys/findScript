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
const title_prefix = "video title prefix ";
const video_description = "";

const window_height = 768;
const window_width = 1366;
const studioUrl = "https://studio.youtube.com/";

// directory contains the videos you want to upload

const searchPhrase = "Лестница своими руками";

const dir = searchPhrase.replace(/ /gi, "_");
const searchDir = path.resolve(`${__dirname}/../../assets/links/${dir}`);
const searchJson = path.resolve(
  `${__dirname}/../../assets/links/${dir}/${dir}.json`
);
const downloadPath = path.resolve(
  `${__dirname}/../../assets/links/${dir}/download`
);
const distPath = path.resolve(
  `${__dirname}/../../assets/links/${dir}/distPath`
);
const trimmedPath = path.resolve(
  `${__dirname}/../../assets/links/${dir}/trimmed`
);

const assetsDir = path.resolve(`${__dirname}/../../assets/`);
const assetsLinksDir = path.resolve(`${__dirname}/../../assets/links/`);

// change user data directory to your directory
const chromeUserDirectory =
  "C:\\Users\\ksysuev\\AppData\\Local\\Chromium\\User Data";

const videoDownloadInterval = 20;
const videoNumFromSearch = 5000;
const scrollDownSearch = 50;
module.exports = {
  DEFAULT_ARGS,
  chromeUserDirectory,
  studioUrl,
  window_width,
  window_height,
  title_prefix,
  video_description,
  downloadPath,
  videoDownloadInterval,
  distPath,
  videoNumFromSearch,
  scrollDownSearch,
  searchPhrase,
  trimmedPath,
  assetsDir,
  assetsLinksDir,
  searchJson,
  searchDir,
};

// RamTamTam1-10
