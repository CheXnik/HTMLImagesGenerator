import { DotLottie } from "/static/js/lottie-player/dotlottie-web.mjs";
import { fetchFile } from "/static/js/ffmpeg/util/esm/index.js";
import { logger } from "/static/js/giforob/utils/logger.js"
import { newIcon, drawTextBox, drawBackground } from "/static/js/giforob/drawing/drawing.js";
import { unpackTgs, downloadBlob } from "/static/js/giforob/utils/utils.js";
import { loadFFMpeg, unloadFFMpeg } from "/static/js/giforob/utils/ffmpeg.js";

let ffmpeg = await loadFFMpeg();

const playButton = document.getElementById("play");
const stopButton = document.getElementById("stop");
const renderButton = document.getElementById("render");

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

const lottieCanvas = document.createElement("canvas");
lottieCanvas.width = 650;
lottieCanvas.height = 650;

let sticker = await unpackTgs("/static/media/create.tgs");

let dotLottie = new DotLottie({
  autoplay: false,
  loop: false,
  canvas: lottieCanvas,
  data: sticker
});

let icon = newIcon({
  src: "/static/icons/templates/smile.svg",
    color: "#ffaf4d",
    width: 80,
    height: 80
  }
);

playButton.addEventListener("click", () => {
  logger("Play animation");

  playButton.classList.add("d-none");
  stopButton.classList.remove("d-none");

  dotLottie.play();
  dotLottie.setLoop(true);
});

stopButton.addEventListener("click", () => {
  logger("Stop animation");

  stopButton.classList.add("d-none");
  playButton.classList.remove("d-none");

  dotLottie.pause();
  dotLottie.setLoop(false);
});

renderButton.addEventListener("click", async () => {
  logger("Starting render");

  if (!ffmpeg) {
    ffmpeg = await loadFFMpeg();
  }

  for (let i = 0; i <= (sticker.op - sticker.ip + 1); i++) {
    dotLottie.setFrame(i);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    const fileName = `img${String(i + 1).padStart(3, "0")}.png`;

    await ffmpeg.writeFile(fileName, await fetchFile(blob));
    logger(`File: ${fileName} written to file system`);
  }

  logger("Encoding your video");
  await ffmpeg.exec(
    [
      "-framerate", "60",
      "-i", "img%03d.png",
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-crf", "24",
      "-preset", "medium",
      "-bufsize", "3M",
      "-maxrate", "5M",
      "-movflags", "+faststart",
      "-f", "mp4",
      "output.mp4"
    ]
  );

  logger("The video is ready, the download will start soon");
  const data = await ffmpeg.readFile("output.mp4");
  downloadBlob(data, "zalupa.mp4");

  logger("Rendered video successfully!");
  await unloadFFMpeg();
});

function renderFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground(ctx, canvas);

  ctx.drawImage(lottieCanvas, 215, 553, lottieCanvas.width, lottieCanvas.height);

  drawTextBox(ctx, "Your video is processing", icon, 553 + lottieCanvas.height);

  requestAnimationFrame(renderFrame);
}

async function applySettings() {
  // dotLottie.load();
}

await applySettings();
dotLottie.addEventListener("load", renderFrame);
