document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("article h2").forEach((h2) => {
    const mdHeading = document.createElement("span");
    mdHeading.textContent = "# ";
    mdHeading.style.color = "#0073e6";
    h2.prepend(mdHeading);
  });

  document.querySelectorAll(".problem-header h3").forEach((h3) => {
    const toggle = document.createElement("span");
    toggle.textContent = "v";
    toggle.classList.add("problem-toggle");
    toggle.addEventListener("click", () => {
      const content = h3.parentElement.nextElementSibling;
      content.style.display = toggle.textContent === ">" ? "block" : "none";
      toggle.textContent = toggle.textContent === ">" ? "v" : ">";
    });

    const mdHeading = document.createElement("span");
    mdHeading.textContent = "## ";
    mdHeading.style.color = "#0073e6";

    h3.prepend(mdHeading);
    h3.prepend(toggle);
  });
});
