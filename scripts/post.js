document.documentElement.style.setProperty(
  "--topic-color",
  getTopicColor(urlToTopic()),
);

const tagToHeader = new Map([
  ["H2", "#"],
  ["H3", "##"],
]);

const setStyle = (h) => {
  const mdHeading = document.createElement("span");
  const header = tagToHeader.has(h.tagName) ? tagToHeader.get(h.tagName) : "";
  mdHeading.textContent = `${header} `;
  mdHeading.style.color = getTopicColor(urlToTopic());
  h.prepend(mdHeading);
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".post-article h2").forEach(setStyle);
  document.querySelectorAll(".post-article h3").forEach(setStyle);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".code").forEach(loadCode);
});

async function loadCode(e) {
  const file = e.dataset.file;
  const language = file.substring(file.lastIndexOf(".") + 1);
  let [_, __, topic, post] = window.location.pathname.split("/");
  post = post.substring(0, post.lastIndexOf("."));

  try {
    const path = `/public/code/${topic}/${post}/${file}`;
    const response = await fetch(path);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch ${path}: ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    const code = await response.text();

    const pre = document.createElement("pre");
    const codeElement = document.createElement("code");
    codeElement.className = `language-${language}`;
    codeElement.textContent = code;

    pre.appendChild(codeElement);
    e.appendChild(pre);

    Prism.highlightElement(codeElement);
  } catch (error) {
    console.error(error);
  }
}
