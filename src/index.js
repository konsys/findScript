const puppeteer = require("puppeteer");
const { loginYandex } = require("./login");
const { search } = require("./search");
const { uploadYandex } = require("./upload");
const {
  chromeUserDirectory,
  DEFAULT_ARGS,
  window_height,
  window_width,
  downloadPath,
} = require("./utils/params");
const fs = require("fs");
const { load } = require("./load");
const { clearDistDir, clearLoadDir, getPaths } = require("./utils");
const { trim } = require("./video.handler");

async function start() {
  console.log("Starting browser...");
  let browser = await puppeteer.launch({
    headless: false, // have window
    executablePath: null,
    userDataDir: chromeUserDirectory,
    ignoreDefaultArgs: DEFAULT_ARGS,
    autoClose: false,
    args: [
      "--lang=en-US,en",
      `--window-size=${window_width},${window_height}`,
      "--enable-audio-service-sandbox",
      "--no-sandbox",
      // "--proxy-server=34.229.251.122:80",
    ],
  });

  const page = await browser.newPage();
  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath,
  });
  page.on("dialog", async (dialog) => {
    console.log(dialog.message());
    await dialog.dismiss();
  });
  page.on("popup", async (dialog) => {
    console.log("popup detected");
    await dialog.close();
  });

  const categories = JSON.parse(
    fs.readFileSync("C:\\Users\\ksysuev\\data\\categories.json")
  );

  const emails = JSON.parse(
    fs.readFileSync("C:\\Users\\ksysuev\\data\\emails.json")
  );

  let i = 0;
  for await (let email of emails) {
    const category = categories[i];
    const pathParams = getPaths(category);
    try {
      fs.mkdirSync(pathParams.searchDir, 0744);
    } catch (e) {
      // NOP
    }
    try {
      fs.mkdirSync(pathParams.downloadPath, 0744);
    } catch (e) {
      // NOP
    }
    try {
      fs.mkdirSync(pathParams.distPath, 0744);
    } catch (e) {
      // NOP
    }
    try {
      fs.mkdirSync(pathParams.trimmedPath, 0744);
    } catch (e) {
      // NOP
    }

    i++;
    await search(category, page);

    await loginYandex(page, email.email, email.pass);

    let links = JSON.parse(fs.readFileSync(pathParams.searchJson));

    for await (let link of links) {
      await clearDistDir();
      await clearLoadDir();
      try {
        console.log("Loading file", link.id + link.fileExt);
        await load(page, searchJson, links, link);
        await trim(link.id + link.fileExt);
      } catch (err) {
        console.log("Error: ", err);
      }
      try {
        await uploadYandex(page);
      } catch (err) {
        try {
          await uploadYandex(page);
        } catch (err) {
          try {
            await uploadYandex(page);
          } catch (err) {
            try {
              await uploadYandex(page);
            } catch (err) {}
          }
        }
      }
    }
  }
  await browser.close();
  process.exit();
}

start();
