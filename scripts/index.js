const postMapping = new Map([
  [
    "Software",
    [
      { name: "from github pages to aws", link: "from-github-pages-to-aws" },
      { name: "designing this website" },
      { name: "working in the terminal" },
    ],
  ],
  [
    "Economics",
    [
      { name: "romer-solow model" },
      { name: "the short run" },
      { name: "to invest or not to invest" },
    ],
  ],
  ["Trading", [{ name: "InteractiveBrokers TWS" }, { name: "valuation" }]],
  ["Algorithms", [{ name: "two pointers" }, { name: "convex hull" }]],
]);

function refresh(e) {
  e.preventDefault();

  const topics = document.querySelectorAll(".topic a");

  topics.forEach((topic) => {
    topic.classList.remove("active");
    topic.style.color = "";
  });

  document.getElementById("posts").innerHTML = "";

  clearPrompt(500);
}

function renderPosts(topic) {
  const posts = document.getElementById("posts");
  posts.innerHTML = "";

  postMapping.get(topic).forEach(({ name: postName, link: postLink }) => {
    const post = document.createElement("div");
    post.classList.add("post");

    const link = document.createElement("a");
    link.href = postLink ? `/posts/${postLink}.html` : `/wip.html`;
    link.textContent = postName;

    post.appendChild(link);
    posts.appendChild(post);
  });
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
        renderPosts(topic);
        typing = false;
      }
    }

    typechar();
  });
}

window.addEventListener("beforeunload", () => {
  document.querySelector(".terminal-prompt").innerHTML = TERMINAL_PROMPT;
});

function applyColor(topic) {
  switch (topic.parentElement.className.split(" ")[1]) {
    case "software":
      topic.style.color = "#0073e6";
      break;
    case "economics":
      topic.style.color = "#009975";
      break;
    case "trading":
      topic.style.color = "#d50032";
      break;
    case "algorithms":
      topic.style.color = "#6a0dad";
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const topics = document.querySelectorAll(".topic a");

  topics.forEach((topic) => {
    topic.addEventListener("mouseenter", () => {
      applyColor(topic);
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
      document.getElementById("posts").innerHTML = "";
      applyColor(topic);
    });
  });
});
