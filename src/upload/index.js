const fs = require("fs");
const { randSleep, waitClick, sleep } = require("../utils");

const studioUrl = "https://studio.youtube.com/";
const yandexUrl = "https://vh.yandex.ru/video/upload";

async function upload(page, jsonPath, site = "youtube", distPath) {
  console.log("Starting upload");
  let files = [];
  const dir = fs.readdirSync(distPath);

  for (let i = 0; i < dir.length; i++) {
    files.push(dir[i]);
  }

  try {
    (async () => {
      let links = JSON.parse(fs.readFileSync(jsonPath));

      for await (let link of links) {
        try {
          if (link.loaded !== true || link.uploaded === true) {
            continue;
          }
          if (site === "youtube") {
            await uploadYoutube(page, link, links, jsonPath);
          } else {
            await uploadYandex(page, link, links, jsonPath);
          }
        } catch (er) {
          console.log("Error in upload", er);
        }
      }
    })();
  } catch (error) {
    console.log(error);
  }
}
async function uploadYandex(page, trimmedPath, searchJson, categoryNum) {
  let links = JSON.parse(fs.readFileSync(searchJson));
  let i = 0;
  for await (let link of links) {
    try {
      const fileType = trimmedPath + "\\" + link.id + link.fileExt;
      console.log("processing...", fileType);

      const tre = fs.existsSync(fileType);
      if (!tre || link.uploaded === true) {
        console.log(!tre ? "File not exist" : "File uploaded");
        if (i > links.length) {
          return;
        }
        continue;
      }
      i++;
      console.log("Going to yandex");
      await page.goto(yandexUrl);
      console.log("Yandex page uploaded");
      await randSleep();
      const bt = await page.$(".Button2_view_action", (e) => e);

      await sleep(4000);
      await randSleep();
      let fileChooser = null;
      [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        bt.click(),
      ]);
      await fileChooser.accept([fileType]);

      await sleep(5000);
      await randSleep();
      await page.waitForSelector("input[name=title]");
      await page.focus("input[name=title]");
      await randSleep();
      await page.keyboard.type(link.title);

      await randSleep();
      await page.focus("textarea");
      await randSleep();
      await page.keyboard.type(link.title);

      await randSleep();
      console.log("category click");
      const els = await page.$$(".Select2");

      await els[0].click();
      await randSleep();

      let categoryLink = `div[data-key='item-${categoryNum}']`;
      let r1 = await page.$(categoryLink);
      await r1.click();
      await randSleep();

      await els[1].click();
      await randSleep();

      categoryLink = "div[data-key='item-2']";

      r1 = await page.$$(categoryLink);
      await r1[1].click();
      console.log("Wait save button");

      await randSleep();
      let [saveButton] = await page.$x("//button[contains(., 'Сохранить')]");
      let is_disabled = (await page.$$("button[disabled]")).length !== 0;

      for await (let i of Array(20).fill(10)) {
        if (is_disabled) {
          console.log("disabled, wait 10 secs");
          await sleep(10000);
          is_disabled = (await page.$$("button[disabled]")).length !== 0;
        } else {
          console.log("saving...");
          await saveButton.click();
          await randSleep();
          try {
            await saveButton.click();
          } catch (ex) {}

          break;
        }
      }
      links = links.map((v) => {
        if (v.id === link.id) {
          v.uploaded = true;
        }
        return v;
      });
      console.log("Write to JSON", searchJson);
      fs.writeFileSync(searchJson, JSON.stringify(links));
      fs.unlinkSync(fileType);
      await sleep(5000);
    } catch (err) {
      links = links.map((v) => {
        if (v.id === link.id) {
          v.error = true;
        }
        return v;
      });
      fs.writeFileSync(searchJson, JSON.stringify(links));
    }
    await randSleep();
  }
}

async function uploadYoutube(page, link, links, jsonPath) {
  await page.goto(studioUrl, { Options: { timeout: 20 * 1000 } });
  await randSleep();
  console.log("now process file:\t" + link.title);

  //click create icon
  await waitClick(page, "#create-icon");
  await randSleep();
  await randSleep();

  //click upload video
  await waitClick(page, "#text-item-0 > ytcp-ve");
  await randSleep();
  await randSleep();
  let fileChooser = null;

  // return;
  try {
    [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click("#select-files-button > div"),
    ]);
  } catch (err) {
    console.log("Error in file chooser", err);
  }

  await fileChooser.accept([distPath + "\\" + link.id + link.fileExt]);

  // wait 10 seconds
  await randSleep();
  await randSleep();
  await randSleep();
  await randSleep();

  // title content
  const text_box = await page.$x('//*[@id="textbox"]');

  await text_box[0].type(link.title);
  //  await page.type('#textbox', title_prefix + file_name.replace('.mp4',''));
  await randSleep();

  // Description content
  await text_box[1].type(link.title + ` Оригинал: ${link.href}`);

  await randSleep();
  // add video to the second playlists

  // For kids
  await waitClick(
    page,
    "#made-for-kids-group > paper-radio-button:nth-child(1)"
  );

  await randSleep();

  console.log("WAIT SELECTOR");
  await page.waitForSelector(
    "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.left-button-area.style-scope.ytcp-uploads-dialog > ytcp-video-upload-progress > span"
  );
  // Video elements
  await waitClick(page, "#step-badge-1");
  await randSleep();

  // Visibility
  await waitClick(page, "#step-badge-2");
  await randSleep();

  // Public video
  await waitClick(page, "#privacy-radios > paper-radio-button:nth-child(18)");
  await randSleep();

  console.log("Sleep 18 sec before done button");
  await sleep(18 * 1000);
  await page.evaluate(async () => {
    const rr = document.querySelector(`#done-button`);
    await rr.click();
  });

  console.log("Sleep 18 sec before close button");
  await sleep(18 * 1000);
  await page.evaluate(async () => {
    const rr = document.querySelector(`#close-button > div`);
    await rr.click();
  });

  links = links.map((v) => {
    if (v.id === link.id) {
      v.uploaded = true;
    }
    return v;
  });
  console.log("Write to JSON", jsonPath);
  fs.writeFileSync(jsonPath, JSON.stringify(links));
}

module.exports = { upload, uploadYandex };
