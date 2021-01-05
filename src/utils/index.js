const fs = require("fs");
const path = require("path");
const { downloadPath, distPath, trimmedPath } = require("./params");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

function randSleep() {
  return sleep(randomInt(500, 1200));
}

function randId() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function waitForDownloadButton(page) {
  await randSleep();
  await randSleep();
  let i0 = 0;
  for await (let i of Array(4).fill(1)) {
    const clickDownload =
      "#results > div.row > div.col-12.col-lg-7 > a.btn.btn-lg.btn-danger.mt-2.mb-3.shadow.text-white.vdlbutton";

    try {
      console.log("Wait for download button");
      const dB = await page.waitForSelector(clickDownload);
      await randSleep();
      await dB.click();

      break;
    } catch (e) {
      console.log("Download button is not ready. Wait 60 sec");
      if (i0 > 3) {
        throw new Error("Download button is not ready" + e);
      }
      i0++;
      await sleep(5000);
    }
  }
}

async function ifFileUploaded(downloadPath, distPath, id) {
  try {
    let files = fs.readdirSync(downloadPath);
    await sleep(3000);

    for await (let i of Array(15).fill(1)) {
      if (!files.length || files[0].indexOf("crdownload") > -1) {
        console.log("File download not completed. Wait 3 sec");
        await sleep(5000);
        files = fs.readdirSync(downloadPath);
        if (!files.length) {
          throw new Error("Download not started");
        }
      } else {
        console.log("File download completed");
        const file = files[0];
        console.log(
          111111111,
          downloadPath + "/" + file,
          distPath + "/" + id + path.extname(file)
        );
        fs.copyFileSync(
          downloadPath + "/" + file,
          distPath + "/" + id + path.extname(file)
        );

        return path.extname(file);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
  return false;
}

const getVideoLinks = async (page, el = "ytd-video-renderer") => {
  return await page.$$eval(el, (divs) => {
    function randId() {
      let result = "";
      let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength = characters.length;
      for (let i = 0; i < 10; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    const retArr = [];
    divs.forEach((v) => {
      const hrefs = Array.from(v.getElementsByTagName("a"));
      retArr.push({
        href: hrefs.length > 0 ? hrefs[0].href : "Href",
        title: hrefs.length > 1 ? hrefs[1].innerText : "Title",
        loaded: false,
        uploaded: false,
        error: null,
        id: randId(),
        fileExt: null,
      });
    });
    return retArr;
  });
};

const getYandexVideoLinks = async (page, el = ".Feed-Item") => {
  console.log("Start getting links");

  return await page.$$eval(el, async (divs) => {
    const retArr = [];
    divs.forEach((v) => {
      const hrefs = Array.from(v.getElementsByTagName("a"));
      // if (hrefs[1].innerText === "Cats & Pets") {
      // retArr.push(hrefs[1].href);
      retArr.push(hrefs[0].href);
      // }
    });
    return retArr;
  });
};

async function waitClick(page, id) {
  await page.waitForSelector(id);
  await page.click(id);
  await randSleep();
}

async function clearLoadDir() {
  try {
    const fsind = fs.readdirSync(downloadPath);
    console.log("UPLINK", downloadPath);
    for await (let f of fsind) {
      try {
        fs.unlinkSync(downloadPath + "/" + f, () =>
          console.log("Before start loading deleted in load dir file:", f)
        );
      } catch (er) {
        // NOP
      }
    }
  } catch (er) {
    // NOP
  }
}

async function clearDistDir() {
  try {
    const fsind = fs.readdirSync(distPath);

    for await (let f of fsind) {
      try {
        fs.unlinkSync(distPath + "/" + f, () =>
          console.log("Before start loading deleted in load dir file:", f)
        );
      } catch (er) {}
    }
  } catch (er) {
    // NOP
  }
}

async function clearTrimmedDir() {
  const fsind = fs.readdirSync(trimmedPath);

  for await (let f of fsind) {
    try {
      fs.unlinkSync(trimmedPath + "/" + f, () =>
        console.log("Before start loading deleted in load dir file:", f)
      );
    } catch (err) {
      console.log("UPLINK ERROR", err);
      // NOP
    }
  }
}
module.exports = {
  randSleep,
  getVideoLinks,
  sleep,
  randId,
  ifFileUploaded,
  waitForDownloadButton,
  waitClick,
  clearLoadDir,
  clearDistDir,
  clearTrimmedDir,
  getYandexVideoLinks,
  randomInt,
};
