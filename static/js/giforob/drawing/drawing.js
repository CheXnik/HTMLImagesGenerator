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

function drawBackground({ctx, canvas, mainBackgroundColor, color1, opacity1, color2, opacity2, color3, opacity3, color4, opacity4}) {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = mainBackgroundColor;
  ctx.fill();

  drawGradientCircle(ctx,canvas.width * 0.2, canvas.height * 0.7, color1.red, color1.green, color1.blue, opacity1, 100, canvas.width * 0.8);
  drawGradientCircle(ctx, canvas.width * 0.8, canvas.height * 0.2, color2.red, color2.green, color2.blue, opacity2, 100, canvas.width * 0.8);

  drawGradientCircle(ctx,canvas.width * 0.2, canvas.height * 0.3, color3.red, color3.green, color3.blue, opacity3, 100, canvas.width * 0.85);
  drawGradientCircle(ctx,canvas.width * 0.8, canvas.height * 0.8, color4.red, color4.green, color4.blue, opacity4, 100, canvas.width * 0.8);
}

function drawTextBox(
  ctx, text, icon, yStart, paddingX, paddingY, textColor, backgroundColor, borderColor, borderRadius, borderWidth
) {
  const textCanvas = document.createElement("canvas");
  const textCtx = textCanvas.getContext("2d");
  textCtx.font = "500 56px Rubik";  // кринж Web API

  const textMetrics = textCtx.measureText(text);
  const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

  textCanvas.width = textMetrics.width + 10 + icon.width;
  textCanvas.height = Math.max(textHeight, icon.height);
  textCtx.font = "500 56px Rubik";  // кринж Web API
  textCtx.fillStyle = textColor;
  textCtx.textBaseline = "top";

  textCtx.drawImage(icon, textMetrics.width + 10, (textCanvas.height - icon.height) / 2, icon.width, icon.height);
  textCtx.globalCompositeOperation = 'source-in';
  textCtx.fillStyle = textColor;
  textCtx.fillRect(textMetrics.width + 10, (textCanvas.height - icon.height) / 2, icon.width, icon.height);
  textCtx.globalCompositeOperation = 'source-over';

  textCtx.fillText(text, 0, (textCanvas.height - textHeight) / 2);

  const leftPadding = (1080 - (textCanvas.width + paddingX * 2)) / 2;

  ctx.fillStyle = backgroundColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;

  ctx.beginPath();
  ctx.roundRect(
    leftPadding,
    yStart + 64,
    textCanvas.width + paddingX * 2,
    textCanvas.height + paddingY * 2,
    [borderRadius, borderRadius, borderRadius, borderRadius]
  );
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(textCanvas, leftPadding + paddingX, yStart + 64 + paddingY, textCanvas.width, textCanvas.height);
}

export {newIcon, drawBackground, drawTextBox}
