const TERMINAL_PROMPT = "barrett@ruth:~$ ";
let clearing = false;

function clearPrompt(delay, callback) {
  if (clearing) return;
  clearing = true;

  const terminalPrompt = document.querySelector(".terminal-prompt");
  const topicLength = terminalPrompt.innerHTML.length - TERMINAL_PROMPT.length;
  let i = 0;

  function removeChar() {
    if (i++ < topicLength) {
      terminalPrompt.textContent = terminalPrompt.textContent.slice(0, -1);
      setTimeout(removeChar, delay / topicLength);
    } else {
      i = 0;
      clearing = false;
      callback && callback();
    }
  }

  removeChar();
}

function goHome(e) {
  e.preventDefault();

  clearPrompt(500, () => (window.location.href = "/"));
}

function getTopicColor(topicName) {
  switch (topicName) {
    case "software":
      return "#0073e6";
    case "economics":
      return "#009975";
    case "trading":
      return "#d50032";
    case "algorithms":
      return "#6a0dad";
  }
}
