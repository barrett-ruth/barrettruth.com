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

// TODO: ensure handling multiple clicks
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
  const terminalText = ` ${topic.toLowerCase()}/`;
  const terminalPrompt = document.querySelector(".prompt");
  terminalPrompt.innerHTML = "barrett@ruth:~$ ";

  let i = 0;

  function typechar() {
    if (i < terminalText.length) {
      terminalPrompt.innerHTML += terminalText.charAt(i++);
      setTimeout(typechar, 1000 / terminalText.length);
    } else {
      renderPosts(topic);
    }
  }

  typechar();
}

window.addEventListener("beforeunload", () => {
  document.querySelector(".prompt").innerHTML = "barrett@ruth:~$ ";
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
      applyColor(topic);
    });
  });
});
