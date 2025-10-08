(() => {
  if (window.__BT_INDEX_INIT) return;
  window.__BT_INDEX_INIT = true;

  const TERMINAL_PROMPT = "barrett@ruth:~$ ";
  let typing = false;

  function promptEl() {
    return document.querySelector(".terminal-prompt");
  }
  function promptTail() {
    const el = promptEl();
    if (!el) return "";
    const s = el.textContent || "";
    return s.startsWith(TERMINAL_PROMPT) ? s.slice(TERMINAL_PROMPT.length) : s;
  }
  function setPromptTailImmediate(tail) {
    const el = promptEl();
    if (!el) return;
    el.textContent = TERMINAL_PROMPT + tail;
  }
  function persistPrompt() {
    const el = promptEl();
    if (el) sessionStorage.setItem("terminalPromptText", el.textContent);
  }
  (function restorePrompt() {
    const saved = sessionStorage.getItem("terminalPromptText");
    const el = promptEl();
    if (saved && el) el.textContent = saved;
    sessionStorage.removeItem("terminalPromptText");
  })();

  function normalizeDisplayPath(pathname) {
    let p = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    p = p.replace(/\/{2,}/g, "/");
    if (p !== "/" && p.endsWith("/")) p = p.slice(0, -1);
    return p === "/" ? "" : p;
  }
  function displayPathFromHref(href) {
    const url = new URL(href, location.origin);
    return normalizeDisplayPath(url.pathname);
  }
  function currentDisplayPath() {
    return normalizeDisplayPath(location.pathname);
  }
  function animateToDisplayPath(displayPath, totalMs, done) {
    if (typing) return;
    typing = true;

    const el = promptEl();
    if (!el) {
      typing = false;
      return;
    }

    const targetTail = displayPath ? " " + displayPath : "";
    const curTail = promptTail();

    let i = 0;
    const max = Math.min(curTail.length, targetTail.length);
    while (i < max && curTail.charAt(i) === targetTail.charAt(i)) i++;

    const delSteps = curTail.length - i;
    const typeSteps = targetTail.length - i;
    const totalSteps = delSteps + typeSteps;

    if (totalSteps === 0) {
      typing = false;
      done && done();
      return;
    }

    const stepMs = totalMs / totalSteps;

    let delCount = 0;
    function tickDelete() {
      if (delCount < delSteps) {
        setPromptTailImmediate(curTail.slice(0, curTail.length - delCount - 1));
        delCount++;
        setTimeout(tickDelete, stepMs);
      } else {
        let j = 0;
        function tickType() {
          if (j < typeSteps) {
            setPromptTailImmediate(
              curTail.slice(0, i) + targetTail.slice(i, i + j + 1),
            );
            j++;
            setTimeout(tickType, stepMs);
          } else {
            typing = false;
            done && done();
          }
        }
        tickType();
      }
    }
    tickDelete();
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
      const slug =
        post.slug ||
        post.id
          ?.split("/")
          .pop()
          ?.replace(/\.mdx?$/, "");
      a.href = `/${topic}/${slug}.html`;
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

    const path = window.location.pathname;
    const isHome = path === "/" || path === "/index.html";
    const topic = link.dataset.topic?.toLowerCase() || "";
    const href = link.getAttribute("href") || "/";
    const delay = 500;

    const colorFn = window.getTopicColor || (() => "");
    document.querySelectorAll("[data-topic]").forEach((t) => {
      t.classList.remove("active");
      t.style.color = "";
    });
    link.classList.add("active");
    const c = colorFn(topic);
    if (c) link.style.color = c;

    const displayPath = isHome ? `/${topic}` : displayPathFromHref(href);

    animateToDisplayPath(displayPath, delay, () => {
      if (
        isHome &&
        topic &&
        window.postsByCategory &&
        window.postsByCategory[topic]
      ) {
        renderPosts(topic);
        return;
      }
      persistPrompt();

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
    const delay = 500;
    if (isHome) {
      animateToDisplayPath("", delay, () => {
        const posts = document.getElementById("posts");
        if (posts) posts.innerHTML = "";
        document.querySelectorAll("[data-topic].active").forEach((t) => {
          t.classList.remove("active");
          t.style.color = "";
        });
        document.title = "";
      });
    } else {
      persistPrompt();
      animateToDisplayPath("", delay, () => {
        window.location.href = "/";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const initial = currentDisplayPath();
    if (initial) setPromptTailImmediate(" " + initial);
    else setPromptTailImmediate("");

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
            window.getTopicColor(link.dataset.topic?.toLowerCase() || "")) ||
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
