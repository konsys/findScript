const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
ffmpeg.setFfmpegPath(ffmpegPath);

const fs = require("fs");

async function trim(file, trimmedPath, distPath) {
  try {
    fs.mkdirSync(trimmedPath);
  } catch (err) {}

  try {
    const ext = path.extname(file);
    if (ext !== ".mp4") {
      throw new Error("Not video file: ", file);
    }
    const sourceFile = distPath + "\\" + file;

    if (!fs.existsSync(sourceFile)) {
      throw new Error("File doesn`t exist" + sourceFile);
    }
    await trimMe(sourceFile, trimmedPath + "\\" + file);
  } catch (err) {
    throw new Error(err);
  }
}

async function trimMe(file, output) {
  return new Promise((resolve, reject) => {
    const conv = new ffmpeg({ source: file });
    conv

      .setStartTime("00:00:15")
      .on("start", function (commandLine) {
        console.log("Start trim file: " + commandLine);
      })
      .on("error", function (err) {
        console.log("error: ", err);
        return reject(err);
      })
      .on("end", function (err) {
        if (!err) {
          console.log("conversion Done");
          return resolve();
        } else {
          return reject(err);
        }
      })
      .save(output);
  });
}

module.exports = { trim };
