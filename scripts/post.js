document.documentElement.style.setProperty(
  "--topic-color",
  getTopicColor(urlToTopic()),
);

const tagToHeader = new Map([
  ["H2", "#"],
  ["H3", "##"],
]);

const makeFold = (h, i) => {
  const toggle = document.createElement("span");
  toggle.style.fontStyle = "normal";
  toggle.textContent = ">";

  // only unfold first algorithm problem
  if (urlToTopic() === "algorithms" && i === 0) toggle.textContent = "v";

  h.parentElement.nextElementSibling.style.display =
    toggle.textContent === ">" ? "none" : "block";
  h.parentE;
  toggle.classList.add("fold-toggle");
  toggle.addEventListener("click", () => {
    const content = h.parentElement.nextElementSibling;
    toggle.textContent = toggle.textContent === ">" ? "v" : ">";
    content.style.display = toggle.textContent === ">" ? "none" : "block";
  });
  toggle.style.color = getTopicColor(urlToTopic());

  h.prepend(toggle);
};

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
  document.querySelectorAll(".fold h2").forEach(makeFold);
  document.querySelectorAll(".fold h3").forEach(makeFold);
});
