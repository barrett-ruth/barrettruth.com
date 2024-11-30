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
