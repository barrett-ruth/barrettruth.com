document.addEventListener("DOMContentLoaded", function () {
  const katexParagraphs = document.querySelectorAll("article p");

  katexParagraphs.forEach((p) => {
    const katexSpan = p.querySelector(".katex");
    if (!katexSpan || katexSpan.textContent.indexOf("\\blacksquare") != -1)
      return;

    const clone = p.cloneNode(true);
    clone.querySelector(".katex").remove();
    const textWithoutKatex = clone.textContent.trim();

    if (textWithoutKatex === "") {
      p.style.display = "flex";
      p.style.justifyContent = "center";
      p.style.margin = "1.5rem 0";
    }
  });
});
