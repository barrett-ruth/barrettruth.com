const TERMINAL_PROMPT = "barrett@ruth:~$ ";
let clearing = false;

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const path = window.location.pathname;
    const isHome = path === "/" || path === "/index.html";
    const topic = this.getTopic();

    const promptText = topic ? `barrett@ruth:~$ ${topic}` : "barrett@ruth:~$";

    const clickHandler = isHome ? "refresh(event)" : "goHome(event)";

    this.innerHTML = `
      <header>
        <a href="/" style="text-decoration: none; color: inherit" onclick="${clickHandler}">
          <div class="terminal-container">
            <span class="terminal-prompt">${promptText}</span>
            <span class="terminal-cursor"></span>
          </div>
        </a>
        <div class="header-links">
          <a target="_blank" href="/public/resume.pdf">resume</a>
          <a target="_blank" href="/public/transcript.pdf">transcript</a>
          <a href="/about.html">about</a>
        </div>
      </header>
    `;
  }

  getTopic() {
    const pathname = window.location.pathname.split("/");

    if (pathname.length === 2 && pathname[1].endsWith(".html")) {
      return "/" + pathname[1].replace(".html", "");
    } else if (pathname.length >= 3) {
      return "/" + pathname.slice(2, -1).join("/").replace(".html", "");
    }
    return "";
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <span class="greek-delta">&Delta;</span>
        <div class="footer-links">
          <a target="_blank" href="https://github.com/barrett-ruth/">github</a>
          <a target="_blank" href="https://www.linkedin.com/in/barrett-ruth/">linkedin</a>
          <a target="_blank" href="mailto:br.barrettruth@gmail.com">email</a>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector("style#dynamic-styles")) {
    const style = document.createElement("style");
    style.id = "dynamic-styles";
    style.innerHTML = `
      footer {
        padding: 20px;
        font-size: 1.5em;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .greek-delta {
        font-family: "Times New Roman", Times, serif;
        font-size: 1.5em;
      }

      .header-links a,
      .footer-links a {
        margin-left: 25px;
        text-decoration: none;
      }
    `;
    document.head.appendChild(style);
  }
});

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

const getTopicColor = (topicName) => {
  switch (topicName) {
    case "software":
      return "#0073e6";
    case "operating-systems":
      return "#009975";
    case "algorithms":
      return "#d50032";
    default:
      return "#000000";
  }
};

const urlToTopic = () => {
  const pathname = window.location.pathname.split("/");
  if (pathname.length < 3) return "DNE";
  return pathname[2];
};
