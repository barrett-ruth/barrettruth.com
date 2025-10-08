(() => {
  if (window.__BT_INDEX_INIT) return;
  window.__BT_INDEX_INIT = true;

  const TERMINAL_PROMPT = "barrett@ruth:~$ ";
  let typing = false;
  let clearing = false;

  function promptEl() {
    return document.querySelector(".terminal-prompt");
  }

  (function restorePrompt() {
    const saved = sessionStorage.getItem("terminalPromptText");
    const el = promptEl();
    if (saved && el) el.textContent = saved;
    sessionStorage.removeItem("terminalPromptText");
  })();

  function clearPrompt(delay, callback) {
    if (clearing) return;
    clearing = true;
    const el = promptEl();
    if (!el) {
      clearing = false;
      return;
    }
    const excess = el.textContent.length - TERMINAL_PROMPT.length;
    let i = 0;
    function tick() {
      if (i++ < excess) {
        el.textContent = el.textContent.slice(0, -1);
        setTimeout(tick, delay / Math.max(excess, 1));
      } else {
        clearing = false;
        callback && callback();
      }
    }
    tick();
  }

  function typeTerminalPath(topic, delay, callback) {
    if (typing) return;
    typing = true;
    const el = promptEl();
    if (!el) return;
    const txt = ` /${topic}`;
    clearPrompt(delay, () => {
      let i = 0;
      function step() {
        if (i < txt.length) {
          el.textContent += txt.charAt(i++);
          setTimeout(step, delay / txt.length);
        } else {
          typing = false;
          callback && callback();
        }
      }
      step();
    });
  }

  function persistPrompt() {
    const el = promptEl();
    if (el) sessionStorage.setItem("terminalPromptText", el.textContent);
  }

  function renderPosts(topic) {
    if (!window.postsByCategory) return;
    const posts = document.getElementById("posts");
    if (!posts) return;
    posts.innerHTML = "";
    const arr = window.postsByCategory[topic];
    if (!arr) return;
    for (const post of arr) {
      const div = document.createElement("div");
      div.className = "post";
      const a = document.createElement("a");
      const slug = post.id
        .split("/")
        .pop()
        .replace(/\.mdx?$/, "");
      a.href = `/posts/${topic}/${slug}.html`;
      a.textContent = post.data.title;
      a.style.textDecoration = "underline";
      div.appendChild(a);
      posts.appendChild(div);
    }
  }

  function handleDataTopicClick(e) {
    const link = e.target.closest("[data-topic]");
    if (!link) return;
    e.preventDefault();
    if (typing) return;

    const topic = link.dataset.topic.toLowerCase();
    const href = link.getAttribute("href") || "/";
    const delay = 500;
    const path = window.location.pathname;

    const colorFn = window.getTopicColor || (() => "");
    const topics = document.querySelectorAll("[data-topic]");
    topics.forEach((t) => {
      t.classList.remove("active");
      t.style.color = "";
    });
    link.classList.add("active");
    const c = colorFn(topic);
    if (c) link.style.color = c;

    typeTerminalPath(topic, delay, () => {
      persistPrompt();

      if (path === "/" || path === "/index.html") {
        if (window.postsByCategory && window.postsByCategory[topic]) {
          renderPosts(topic);
          return;
        }
      }

      const isMail = href.startsWith("mailto:");
      if (isMail) {
        window.location.href = href;
        return;
      }

      if (link.target === "_blank") {
        window.open(href, "_blank");
        return;
      }

      window.location.href = href;
    });
  }

  function handleHomeClick(e) {
    const home = e.target.closest(".home-link");
    if (!home) return;
    e.preventDefault();
    const isHome =
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html";
    if (isHome) {
      clearPrompt(500, () => {
        const posts = document.getElementById("posts");
        if (posts) posts.innerHTML = "";
        const topics = document.querySelectorAll("[data-topic].active");
        topics.forEach((t) => {
          t.classList.remove("active");
          t.style.color = "";
        });
      });
    } else {
      persistPrompt();
      clearPrompt(500, () => {
        window.location.href = "/";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".home-link")) return handleHomeClick(e);
      if (e.target.closest("[data-topic]")) return handleDataTopicClick(e);
    });

    document.body.addEventListener(
      "mouseenter",
      (e) => {
        const link = e.target.closest("[data-topic]");
        if (!link) return;
        const color =
          (window.getTopicColor &&
            window.getTopicColor(link.dataset.topic.toLowerCase())) ||
          "";
        if (color) link.style.color = color;
      },
      true,
    );

    document.body.addEventListener(
      "mouseleave",
      (e) => {
        const link = e.target.closest("[data-topic]");
        if (!link) return;
        if (!link.classList.contains("active")) link.style.color = "";
      },
      true,
    );

    window.addEventListener("beforeunload", () => {
      const el = promptEl();
      if (el) el.textContent = TERMINAL_PROMPT;
    });
  });
})();
