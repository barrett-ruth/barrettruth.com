function typechars(e, url = "wip.html") {
  e.preventDefault();

  const text = ` ${e.target.textContent.toLowerCase()}/`;
  const terminalPrompt = document.querySelector(".prompt");

  let i = 0;

  function typechar() {
    if (i < text.length) {
      terminalPrompt.innerHTML += text.charAt(i);
      i++;
      setTimeout(typechar, 1000 / text.length);
    } else {
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    }
  }

  typechar();
}

window.addEventListener("beforeunload", () => {
  const terminalPrompt = document.querySelector(".prompt");
  terminalPrompt.innerHTML = "barrett@ruth:~$ ";
});
