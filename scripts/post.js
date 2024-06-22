const urlToTopic = () => {
  return new URL(window.location.href).pathname.split("/")[2];
};

document.documentElement.style.setProperty(
  "--topic-color",
  getTopicColor(urlToTopic()),
);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("article h2").forEach((h2) => {
    const mdHeading = document.createElement("span");
    mdHeading.textContent = "# ";
    mdHeading.style.color = getTopicColor(urlToTopic());
    h2.prepend(mdHeading);
  });

  document.querySelectorAll(".fold h3").forEach((h3, i) => {
    const toggle = document.createElement("span");
    toggle.textContent = "v";

    // only unfold first algorithm problem
    if (urlToTopic() === "algorithms" && i === 0) toggle.textContent = "v";

    h3.parentElement.nextElementSibling.style.display =
      toggle.textContent === ">" ? "none" : "block";
    toggle.classList.add("fold-toggle");
    toggle.addEventListener("click", () => {
      const content = h3.parentElement.nextElementSibling;
      toggle.textContent = toggle.textContent === ">" ? "v" : ">";
      content.style.display = toggle.textContent === ">" ? "none" : "block";
    });

    const mdHeading = document.createElement("span");
    mdHeading.textContent = "## ";
    mdHeading.style.color = getTopicColor(urlToTopic());

    h3.prepend(mdHeading);
    h3.prepend(toggle);
  });
});
