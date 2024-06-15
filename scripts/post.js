const h2s = document.querySelectorAll("article h2");

h2s.forEach((h2) => {
  const mdHeading = document.createElement("span");
  mdHeading.textContent = "# ";
  mdHeading.style.color = "#0073e6";
  h2.prepend(mdHeading);
});
