const puppeteer = require("puppeteer");
const { loginYandex } = require("./login");
const { search } = require("./search");
const { uploadYandex } = require("./upload");
const {
  chromeUserDirectory,
  DEFAULT_ARGS,
  window_height,
  window_width,
} = require("./utils/params");
const fs = require("fs");
const { load } = require("./load");
const {
  clearDistDir,
  clearLoadDir,
  getPaths,
  clearTrimmedDir,
} = require("./utils");
const { trim } = require("./video.handler");

async function start() {
  console.log("Starting browser...");
  let browser = await puppeteer.launch({
    headless: true, // have window
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

  for await (let j of Array(10).fill(1)) {
    const emails = JSON.parse(
      fs.readFileSync("C:\\Users\\ksysuev\\data\\emails.json")
    );

    for await (let email of emails) {
      if (!email.isActive) {
        continue;
      }
      console.log("Search phrase", email.searchPhrase);
      const pathParams = getPaths(email.searchPhrase);
      const downloadPath = pathParams.downloadPath;
      const page = await browser.newPage();

      await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath,
      });

      page.on("dialog", async (dialog) => {
        await dialog.dismiss();
      });

      page.on("popup", async (dialog) => {
        await dialog.close();
      });

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

      await search(email.searchPhrase, pathParams.searchJson, page);

      await loginYandex(page, email.email, email.pass);

      let links = JSON.parse(fs.readFileSync(pathParams.searchJson));

      for await (let link of links) {
        if (
          link &&
          link.title &&
          link.title.toLowerCase().indexOf("фильм") > -1
        ) {
          continue;
        }
        await clearDistDir(pathParams.distPath);
        await clearLoadDir(pathParams.downloadPath);
        await clearTrimmedDir(pathParams.trimmedPath);
        try {
          console.log("Loading file", link.id + link.fileExt);
          await load(
            page,
            pathParams.searchJson,
            links,
            link,
            pathParams.downloadPath,
            pathParams.distPath
          );
          await trim(
            link.id + link.fileExt,
            pathParams.trimmedPath,
            pathParams.distPath
          );
        } catch (err) {
          console.log("Error: ", err);
        }
        try {
          await uploadYandex(
            page,
            pathParams.trimmedPath,
            pathParams.searchJson,
            email.categoryNum
          );
        } catch (err) {
          try {
            await uploadYandex(
              page,
              pathParams.trimmedPath,
              pathParams.searchJson,
              email.categoryNum
            );
          } catch (err) {}
        }
      }
      // await page.close();
    }
  }
  await browser.close();
  process.exit();
}

start();
