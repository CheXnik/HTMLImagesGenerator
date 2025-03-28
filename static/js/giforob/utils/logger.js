const logs = document.getElementById('logs');

function logger(text) {
  let divLog = document.createElement('div');
  divLog.innerText = text;
  divLog.classList.add('log');

  logs.appendChild(divLog);
  logs.scrollTop = logs.scrollHeight;
}

export { logger };
