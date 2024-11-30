const postMapping = new Map([
  ["Software", []],
  ["Economics", []],
  ["Trading", []],
  ["Algorithms", []],
]);

function refresh(e) {
  if (window.location.pathname !== "/") e.preventDefault();

  const topics = document.querySelectorAll(".topic a");

  topics.forEach((topic) => {
    topic.classList.remove("active");
    topic.style.color = "";
  });

  clearPrompt(500);
}

let typing = false;

function typechars(e) {
  e.preventDefault();

  if (e.target.classList.contains("active")) return;
  if (typing) return;
  typing = true;

  const topic = e.target.textContent;
  const terminalText = ` ${topic.toLowerCase()}/`;
  const terminalPrompt = document.querySelector(".terminal-prompt");
  const delay =
    terminalPrompt.innerHTML.length > TERMINAL_PROMPT.length ? 250 : 500;

  clearPrompt(delay, () => {
    let i = 0;
    function typechar() {
      if (i < terminalText.length) {
        terminalPrompt.innerHTML += terminalText.charAt(i++);
        setTimeout(typechar, delay / terminalText.length);
      } else {
        typing = false;

        window.location.href = `/posts/${topic.toLowerCase()}/index.html`;
      }
    }

    typechar();
  });
}

window.addEventListener("beforeunload", () => {
  document.querySelector(".terminal-prompt").innerHTML = TERMINAL_PROMPT;
});

document.addEventListener("DOMContentLoaded", function () {
  const topics = document.querySelectorAll(".topic a");

  topics.forEach((topic) => {
    const topicName = topic.parentElement.className.split(" ")[1];

    topic.addEventListener("mouseenter", () => {
      topic.style.color = getTopicColor(topicName);
    });

    topic.addEventListener("mouseleave", () => {
      if (!topic.classList.contains("active")) {
        topic.style.color = "";
      }
    });

    topic.addEventListener("click", (e) => {
      e.preventDefault();

      if (topic.classList.contains("active")) return;

      topics.forEach((t) => {
        t.classList.remove("active");
        t.style.color = "";
      });

      topic.classList.add("active");
      topic.style.color = getTopicColor(topicName);
    });
  });
});

function loadMarkdown(filePath) {
  fetch(filePath)
    .then((response) => response.text())
    .then((markdown) => {
      const post = document.querySelector(".post");
      post.innerHTML = marked.parse(markdown);

      renderMathInElement(post, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      });
    })
    .catch((error) => {
      console.error("Error fetching markdown:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const pathParts = path.split("/").filter((part) => part !== "");

  if (pathParts.length >= 3 && pathParts[0] === "posts") {
    const topic = pathParts[1];
    let pageName = pathParts[2].replace(".html", "");

    const markdownPath = `/posts/${topic}/${pageName}.md`;

    loadMarkdown(markdownPath);

    -document.documentElement.style.setProperty(
      "--topic-color",
      getTopicColor(urlToTopic()),
    );
  }
});
