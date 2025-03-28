let data = {canvas: {}, text: {}, gradient: {left: {}, right: {}, width: '0'}}

let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
document.getElementById('save').addEventListener(touchEvent, save);

function get_settings() {
  data.canvas.real_width = document.getElementById('canvas-width').value
  data.canvas.real_height = document.getElementById('canvas-height').value

  data.text.text = document.getElementById('text-on-image').value
  data.text.color = document.getElementById('color-text').value
  data.text.size = document.getElementById('size-text').value
  data.text.padding = document.getElementById('padding-text').value

  data.gradient.left.from = document.getElementById('lg-color-from').value
  data.gradient.left.to = document.getElementById('lg-color-to').value

  data.gradient.right.from = document.getElementById('rg-color-from').value
  data.gradient.right.to = document.getElementById('rg-color-to').value

  data.gradient.width = document.getElementById('gradient-ratio').value

  let aspect_ratio = data.canvas.real_width / data.canvas.real_height

  if (window.innerWidth / aspect_ratio > window.innerHeight / 2) {
    data.canvas.width = window.innerHeight * aspect_ratio / 2
    data.canvas.height = window.innerHeight / 2
  }
}

function apply_new_params() {
  get_settings()

  const canvas = document.getElementById('mainCanvas')
  if (!canvas.getContext) {return}
  const ctx = canvas.getContext('2d');

  const gradient_ratio = document.getElementById('gradient-ratio')
  const numeric_gradient_ratio = document.getElementById('numeric-gradient-ratio')

  canvas.width = data.canvas.real_width
  canvas.height = data.canvas.real_height

  gradient_ratio.max = data.canvas.real_width

  const left_gradient = ctx.createLinearGradient(0, 0, data.gradient.width * 0.55, 0)
  left_gradient.addColorStop(0, data.gradient.left.from)
  left_gradient.addColorStop(1, data.gradient.left.to)

  ctx.fillStyle = left_gradient
  ctx.fillRect(0,0, data.gradient.width, data.canvas.real_height)

  const right_gradient = ctx.createLinearGradient(0, 0, 0, data.canvas.real_height)
  right_gradient.addColorStop(0, data.gradient.right.from)
  right_gradient.addColorStop(1, data.gradient.right.to)

  ctx.fillStyle = right_gradient
  ctx.fillRect(data.gradient.width,0, data.canvas.real_width - data.gradient.width, data.canvas.real_height)

  ctx.font = `bold ${data.text.size}px Rubik, sans-serif`
  ctx.fillStyle = data.text.color
  ctx.fillText(data.text.text, data.text.padding,data.canvas.real_height - data.text.padding)

  numeric_gradient_ratio.value = data.gradient.width
}

function change_color(element) {
  document.getElementById('hex-' + element.id).value = element.value.replace('#', '')

  apply_new_params()
}

function change_hex_color(element) {
  if (element.value.includes('#')) {
    element.value = element.value.replace('#', '')
  }

  document.getElementById(element.id.replace('hex-', '')).value = '#' + element.value

  apply_new_params()
}

function change_gradient_ratio(element) {
  if (parseInt(element.value) > parseInt(data.canvas.real_width)) {
    element.value = data.canvas.real_width
  } else if (element.value === '') {
    element.value = 0
  }

  document.getElementById('gradient-ratio').value = element.value

  apply_new_params()
}

let saveBlob = (function () {
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  return function (blob, fileName) {
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.target = '_blank'
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

async function save() {
  let canvas = document.getElementById("mainCanvas")
  canvas.toBlob((blob) => {
    saveBlob(blob, `${data.text.text.replace(' ', '_')}.png`);
  });
}

apply_new_params()
