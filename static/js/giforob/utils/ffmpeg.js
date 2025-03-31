import {FFmpeg} from "/static/js/ffmpeg/main/esm/index.js";
import {logger} from "/static/js/giforob/utils/logger.js";
import {toBlobURL} from "/static/js/ffmpeg/util/esm/index.js";

const baseURL = "/static/js/ffmpeg/core/esm"

async function loadFFMpeg() {
  let ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({ message }) => {
    logger(message);
  });

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript")
  });

  logger("FFmpeg loaded successfully!");

  return ffmpeg;
}

export {loadFFMpeg};
