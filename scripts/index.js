const postMapping = new Map([
  [
    "software",
    [
      "hosting a git server",
      "my cp setup",
      "from github pages to aws",
      "designing this website",
    ],
  ],
  ["operating systems", ["building an os"]],
  [
    "algorithms",
    [
      "competitive programming log",
      "leetcode daily",
      "practice makes perfect",
      "extrema circular buffer",
      "models of production",
    ],
  ],
]);

function refresh(e) {
  if (window.location.pathname !== "/") e.preventDefault();

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

  // Normalize topic for lookup (in case it has spaces, like "operating systems")
  const normalizedTopic = topic.trim();
  
  // Get posts for this topic
  const topicPosts = postMapping.get(normalizedTopic);
  
  if (!topicPosts) {
    console.error(`No posts found for topic: ${normalizedTopic}`);
    return;
  }

  topicPosts.forEach((postName) => {
    if (typeof postName !== "string") return;

    const post = document.createElement("div");
    post.classList.add("post");

    const link = document.createElement("a");
    const postLink = postName.toLowerCase().replace(/\s+/g, "-");
    
    // Convert topic to URL-friendly format
    const topicSlug = normalizedTopic.toLowerCase().replace(/\s+/g, "-");
    link.href = `/posts/${topicSlug}/${postLink}.html`;
    link.textContent = postName;

    link.style.textDecoration = "underline";

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
  const terminalText = ` /${topic.toLowerCase()}`;
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
      document.getElementById("posts").innerHTML = "";
      topic.style.color = getTopicColor(topicName);
    });
  });
});
