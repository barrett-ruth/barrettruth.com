const TERMINAL_PROMPT = "barrett@ruth:~$ ";
let clearing = false;

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  if (header) {
    let headerLinks = header.querySelector(".header-links");
    if (!headerLinks) {
      headerLinks = document.createElement("div");
      headerLinks.className = "header-links";
      header.appendChild(headerLinks);
    }

    headerLinks.innerHTML = "";

    const resumeLink = document.createElement("a");
    resumeLink.href = "/public/resume.pdf";
    resumeLink.target = "_blank";
    resumeLink.textContent = "Resume";
    headerLinks.appendChild(resumeLink);

    const transcriptLink = document.createElement("a");
    transcriptLink.href = "/public/transcript.pdf";
    transcriptLink.target = "_blank";
    transcriptLink.textContent = "Transcript";
    headerLinks.appendChild(transcriptLink);

    const aboutLink = document.createElement("a");
    aboutLink.href = "/about.html";
    aboutLink.textContent = "About";
    headerLinks.appendChild(aboutLink);
  }

  const existingFooter = document.querySelector("footer");
  if (existingFooter) {
    existingFooter.remove();
  }

  const footer = document.createElement("footer");

  const deltaSpan = document.createElement("span");
  deltaSpan.className = "greek-delta";
  deltaSpan.innerHTML = "&Delta;";

  const footerLinks = document.createElement("div");
  footerLinks.className = "footer-links";

  const githubLink = document.createElement("a");
  githubLink.href = "https://github.com/barrett-ruth/";
  githubLink.target = "_blank";
  githubLink.textContent = "GitHub";
  footerLinks.appendChild(githubLink);

  const linkedinLink = document.createElement("a");
  linkedinLink.href = "https://www.linkedin.com/in/barrett-ruth/";
  linkedinLink.target = "_blank";
  linkedinLink.textContent = "LinkedIn";
  footerLinks.appendChild(linkedinLink);

  const emailLink = document.createElement("a");
  emailLink.href = "mailto:br.barrettruth@gmail.com";
  emailLink.target = "_blank";
  emailLink.textContent = "Email";
  footerLinks.appendChild(emailLink);

  footer.appendChild(deltaSpan);
  footer.appendChild(footerLinks);

  document.body.appendChild(footer);

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
    case "economics":
      return "#009975";
    case "trading":
      return "#d50032";
    case "algorithms":
      return "#6a0dad";
    default:
      return "#000000";
  }
};

const urlToTopic = () => {
  const pathname = window.location.pathname.split("/");
  if (pathname.length < 3) return "DNE";
  return pathname[2];
};
