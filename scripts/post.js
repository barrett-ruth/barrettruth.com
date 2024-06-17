document.querySelectorAll("article h2").forEach((h2) => {
  const mdHeading = document.createElement("span");
  mdHeading.textContent = "# ";
  mdHeading.style.color = "#0073e6";
  h2.prepend(mdHeading);
});

document.querySelectorAll("article h3").forEach((h3) => {
  const mdHeading = document.createElement("span");
  mdHeading.textContent = "## ";
  mdHeading.style.color = "#0073e6";
  h3.prepend(mdHeading);
});
