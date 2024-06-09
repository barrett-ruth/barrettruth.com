const postMapping = new Map([
  [
    "Software",
    [
      "from github pages to aws",
      "designing this website",
      "working in the terminal",
    ],
  ],
  [
    "Economics",
    ["romer-solow model", "the short run", "to invest or not to invest"],
  ],
  ["Trading", ["InteractiveBrokers TWS", "valuation"]],
  ["Algorithms", ["two pointers", "convex hull"]],
]);

const TERMINAL_PROMPT = "barrett@ruth:~$ ";
let clearing = false;

function refresh(e) {
  e.preventDefault();

  const topics = document.querySelectorAll(".topic a");

  topics.forEach((topic) => {
    topic.classList.remove("active");
    topic.style.color = "";
  });

  document.getElementById("posts").innerHTML = "";

  const terminalPrompt = document.querySelector(".prompt");
  const topicLength = terminalPrompt.innerHTML.length - TERMINAL_PROMPT.length;

  function clearPrompt() {
    if (clearing) return;
    clearing = true;

    let i = 0;
    function removeChar() {
      if (i++ < topicLength) {
        terminalPrompt.textContent = terminalPrompt.textContent.slice(0, -1);
        setTimeout(removeChar, 500 / topicLength);
      } else {
        i = 0;
        clearing = false;
      }
    }

    removeChar();
  }
  clearPrompt();
}

function renderPosts(topic) {
  const posts = document.getElementById("posts");
  posts.innerHTML = "";

  postMapping.get(topic).forEach((postName) => {
    const post = document.createElement("div");
    post.classList.add("post");
    post.textContent = postName;
    posts.appendChild(post);
  });
}

function typechars(e) {
  e.preventDefault();

  const topic = e.target.textContent;
  const terminalText = `${topic.toLowerCase()}/`;
  const terminalPrompt = document.querySelector(".prompt");
  terminalPrompt.innerHTML = TERMINAL_PROMPT;

  let i = 0;
  function typechar() {
    if (i < terminalText.length) {
      terminalPrompt.innerHTML += terminalText.charAt(i++);
      setTimeout(typechar, 500 / terminalText.length);
    } else {
      renderPosts(topic);
    }
  }

  typechar();
}

window.addEventListener("beforeunload", () => {
  document.querySelector(".prompt").innerHTML = TERMINAL_PROMPT;
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
