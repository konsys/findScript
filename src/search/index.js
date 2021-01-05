const fs = require("fs");
const { randSleep, getVideoLinks } = require("../utils");
const {
  scrollDownSearch,
  videoNumFromSearch,
  searchJson,
} = require("../utils/params");
const { load } = require("../load");
const { sampleSize } = require("lodash");
const path = require("path");

async function search(searchPhrase, page) {
  if (fs.existsSync(searchJson)) {
    return;
  }
  await page.goto("https://youtube.com");

  const input = "#search-input > input";
  await page.waitForSelector(input);

  await page.type(input, searchPhrase);
  await randSleep();

  const searchButtom = "#search-icon-legacy";
  await page.waitForSelector(searchButtom);
  await page.click(searchButtom);

  await randSleep();

  const videoLinks = "ytd-video-renderer a";
  await page.waitForSelector(videoLinks);

  const ar = Array(scrollDownSearch).fill(1);

  for await (let el of ar) {
    await page.evaluate(async (_) => {
      window.scrollBy(0, window.pageYOffset + 5000);
    });
    await randSleep();
  }

  await randSleep();

  let links = await getVideoLinks(page);

  try {
    fs.mkdirSync(dir, 0744);
  } catch (e) {
    // NOP
  }

  links = sampleSize(links, videoNumFromSearch);

  console.log("write", links);

  fs.writeFileSync(searchJson, JSON.stringify(links));

  return page;
}

module.exports = {
  search,
};
