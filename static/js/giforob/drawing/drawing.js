import {logger} from "/static/js/giforob/utils/logger.js";

function newIcon({src, data, color, width, height}={}) {
  const img = new Image();
  const iconCanvas = document.createElement('canvas');
  const iconCtx = iconCanvas.getContext('2d');

  iconCanvas.width = width || 100;
  iconCanvas.height = height || 100;

  if (src) {
    img.src = src;
  } else if (data) {
    logger('TODO')  // TODO
  } else {
    console.error('required parameter is missing - src or data')
  }

  img.onload = () => {
    iconCtx.drawImage(img, 0, 0, iconCanvas.width, iconCanvas.height)

    if (color) {
      iconCtx.globalCompositeOperation = 'source-in';

      iconCtx.fillStyle = color;
      iconCtx.fillRect(0, 0, iconCanvas.width, iconCanvas.height);

      iconCtx.globalCompositeOperation = 'source-over';
    }
  }

  return iconCanvas
}

function drawGradientCircle(ctx, x, y, r, g, b, a, innerRadius, outerRadius) {
    const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a}`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.fill();
}

function drawBackground(ctx, canvas) {
  drawGradientCircle(ctx,canvas.width * 0.5, canvas.height * 0.7, 228, 194, 255, 0.7, 100, canvas.width);
  drawGradientCircle(ctx, canvas.width * 0.8, canvas.height * 0.2, 233, 190, 255, 0.9, 100, canvas.width);

  drawGradientCircle(ctx,canvas.width * 0.2, canvas.height * 0.3, 255, 248, 172, 0.8, 100, canvas.width * 0.85);
  drawGradientCircle(ctx,canvas.width * 0.65, canvas.height * 0.8, 255, 240, 191, 0.8, 100, canvas.width * 0.8);
}

function drawTextBox(ctx, text, icon, yStart) {
  const xPadding = 60;
  const yPadding = 30;
  const borderRadius = 30;

  const textCanvas = document.createElement("canvas");
  const textCtx = textCanvas.getContext("2d");
  textCtx.font = "500 56px Rubik";  // кринж Web API

  const textMetrics = textCtx.measureText(text);
  const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

  textCanvas.width = textMetrics.width + 10 + icon.width;
  textCanvas.height = Math.max(textHeight, icon.height);
  textCtx.font = "500 56px Rubik";  // кринж Web API
  textCtx.fillStyle = "#ffaf4d";
  textCtx.textBaseline = "top";

  textCtx.fillText(text, 0, (textCanvas.height - textHeight) / 2);
  textCtx.drawImage(icon, textMetrics.width + 10, (textCanvas.height - icon.height) / 2, icon.width, icon.height);

  const leftPadding = (1080 - (textCanvas.width + xPadding * 2)) / 2;

  ctx.fillStyle = "rgba(255, 242, 180, 0.44)";
  ctx.strokeStyle = "rgba(255, 248, 233, 0.75)";
  ctx.lineWidth = 10;

  ctx.beginPath();
  ctx.roundRect(
    leftPadding,
    yStart + 64,
    textCanvas.width + xPadding * 2,
    textCanvas.height + yPadding * 2,
    [borderRadius, borderRadius, borderRadius, borderRadius]
  );
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(textCanvas, leftPadding + xPadding, yStart + 64 + yPadding, textCanvas.width, icon.height);
}

export {newIcon, drawBackground, drawTextBox}
