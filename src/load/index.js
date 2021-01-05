const fs = require("fs");
const {
  randSleep,
  ifFileUploaded,
  waitForDownloadButton,
} = require("../utils");
const { downloadPath, distPath } = require("../utils/params");

async function load(page, jsonPath, links, link) {
  const searchInput = "#dlURL";
  try {
    if (link.uploaded === true) {
      throw new Error("Already loaded " + link);
    }
    // if (link.error === true) {
    //   throw new Error("Error in prev load " + link);
    // }

    await page.goto("https://ymp4.download/en4/");
    await randSleep();
    await randSleep();
    await randSleep();
    await randSleep();

    await page.waitForSelector(searchInput);
    await page.type(searchInput, link.href);
    await randSleep();

    const searchButton = "#dlBTN1";
    await page.waitForSelector(searchButton);
    await page.click(searchButton);
    await randSleep();

    await waitForDownloadButton(page);
    const fileExt = await ifFileUploaded(downloadPath, distPath, link.id);

    links = links.map((v) => {
      if (v.id === link.id) {
        v.loaded = true;
        v.fileExt = fileExt;
      }
      return v;
    });
    console.log("Written into JSON", link.title);
    fs.writeFileSync(jsonPath, JSON.stringify(links));
  } catch (err) {
    if (links) {
      links = links.map((v) => {
        if (v.id === link.id) {
          v.error = true;
        }
        return v;
      });
      console.log("Write error in JSON");
      fs.writeFileSync(jsonPath, JSON.stringify(links));
    }

    throw new Error("Bad file " + err);
  }

  return page;
}

module.exports = { load };
