import { getTopicColor } from "../../src/utils/colors.js";

const TERMINAL_PROMPT = "barrett@ruth:~$ ";
let typing = false;
let clearing = false;

function clearPrompt(delay, callback) {
  if (clearing) return;
  clearing = true;

  const terminalPrompt = document.querySelector(".terminal-prompt");
  if (!terminalPrompt) {
    clearing = false;
    return;
  }

  const topicLength =
    terminalPrompt.innerHTML.length - TERMINAL_PROMPT.length;
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

function typechars(e) {
  e.preventDefault();

  const topicElement = e.target;
  if (topicElement.classList.contains("active")) return;
  if (typing) return;
  typing = true;

  const topic = topicElement.dataset.topic;
  const terminalText = ` /${topic.toLowerCase()}`;
  const terminalPrompt = document.querySelector(".terminal-prompt");
  const delay =
    terminalPrompt.innerHTML.length > TERMINAL_PROMPT.length ? 250 : 500;

  const topics = document.querySelectorAll(".topic a");
  topics.forEach((t) => {
    t.classList.remove("active");
    t.style.color = "";
  });

  topicElement.classList.add("active");
  topicElement.style.color = getTopicColor(topic);

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

function renderPosts(topic) {
  const posts = document.getElementById("posts");
  posts.innerHTML = "";

  const categoryPosts = postsByCategory[topic];

  if (!categoryPosts) {
    return;
  }

  categoryPosts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const link = document.createElement("a");
    const slug = post.id
      .split("/")
      .pop()
      .replace(/\.mdx?$/, "");

    link.href = `/posts/${topic}/${slug}.html`;
    link.textContent = post.data.title;
    link.style.textDecoration = "underline";

    postDiv.appendChild(link);
    posts.appendChild(postDiv);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const topics = document.querySelectorAll(".topic a");

  topics.forEach((topic) => {
    topic.addEventListener("click", typechars);

    const topicName = topic.dataset.topic;

    topic.addEventListener("mouseenter", () => {
      const color = getTopicColor(topicName);
      topic.style.color = color;
    });

    topic.addEventListener("mouseleave", () => {
      if (!topic.classList.contains("active")) {
        topic.style.color = "";
      }
    });
  });

  window.addEventListener("beforeunload", () => {
    const terminalPrompt = document.querySelector(".terminal-prompt");
    if (terminalPrompt) {
      terminalPrompt.innerHTML = TERMINAL_PROMPT;
    }
  });
});
