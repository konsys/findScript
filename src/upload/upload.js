const fs = require("fs");

// load puppeteer
const puppeteer = require("puppeteer");

const window_height = 768;
const window_width = 1366;
const studio_url = "https://studio.youtube.com/";

// directory contains the videos you want to upload
const upload_file_directory = "C:\\Users\\ksysuev\\YTReady";
// change user data directory to your directory
const chrome_user_data_directory =
  "C:\\Users\\ksysuev\\AppData\\Local\\Chromium\\User Data";

const title_prefix = "video title prefix ";
const video_description = "";

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

let files = [];
fs.readdir(upload_file_directory, function (err, temp_files) {
  if (err) {
    console.log("Something went wrong...");
    return console.error(err);
  }
  for (let i = 0; i < temp_files.length; i++) {
    files.push(temp_files[i]);
  }
});

try {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false, // have window
      executablePath: null,
      userDataDir: chrome_user_data_directory,
      ignoreDefaultArgs: DEFAULT_ARGS,
      autoClose: false,
      args: [
        "--lang=en-US,en",
        `--window-size=${window_width},${window_height}`,
        "--enable-audio-service-sandbox",
        "--no-sandbox",
      ],
    });
    let page = await browser.newPage();
    await page.setViewport({ width: window_width, height: window_height });
    await page.goto(studio_url, (options = { timeout: 20 * 1000 }));

    for (let i = 0; i < files.length; i++) {
      const file_name = files[i];
      console.log("now process file:\t" + file_name);

      //click create icon
      await page.click("#create-icon");

      //click upload video
      await page.click("#text-item-0 > ytcp-ve");
      await sleep(500);
      //click select files button and upload file
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click("#select-files-button > div"), // some button that triggers file selection
      ]);
      await fileChooser.accept([upload_file_directory + file_name]);

      // wait 10 seconds
      await sleep(10_000);

      // title content
      const text_box = await page.$x('//*[@id="textbox"]');
      await text_box[0].type(title_prefix + file_name.replace(".mp4", ""));
      //  await page.type('#textbox', title_prefix + file_name.replace('.mp4',''));
      await sleep(1000);

      // Description content
      await text_box[1].type(video_description);

      await sleep(1000);

      //click next
      await page.click(
        "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
      );
      await sleep(1000);
      //click next
      await page.click(
        "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
      );
      await sleep(1000);
      //click publish now and public
      await page.click("#first-container");
      await page.click("#privacy-radios > paper-radio-button:nth-child(1)");
      await page.click("#done-button");
      await sleep(5000);
      // close
      await page.click("#close-button > div");

      // wait 60 seconds
      await sleep(60 * 1000);
    }
    await browser.close();
  })();
} catch (error) {
  console.log(error);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
