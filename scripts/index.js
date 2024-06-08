const postMapping = new Map([
  ["Software", ["Post 1", "Post 2", "Post 3"]],
  ["Economics", ["Economy 1", "Economy 2"]],
  ["Trading", ["Trade Secrets", "Market Trends"]],
  ["Algorithms", ["Algorithm Challenges", "Data Structures 101"]],
]);

// TODO: ensure handling multiple clicks
function renderPosts(topic) {
  const posts = document.getElementById("posts");
  posts.innerHTML = "";

  postMapping.get(topic).forEach((postName) => {
    const post = document.createElement("div");
    post.classList.add("post");
    post.textContent = postName;
    posts.appendChild(post);
  });
}

function typechars(e) {
  e.preventDefault();

  const topic = e.target.textContent;
  const terminalText = ` ${topic.toLowerCase()}/`;
  const terminalPrompt = document.querySelector(".prompt");
  terminalPrompt.innerHTML = "barrett@ruth:~$ ";

  let i = 0;

  function typechar() {
    if (i < terminalText.length) {
      terminalPrompt.innerHTML += terminalText.charAt(i++);
      setTimeout(typechar, 1000 / terminalText.length);
    } else {
      renderPosts(topic);
    }
  }

  typechar();
}

window.addEventListener("beforeunload", () => {
  document.querySelector(".prompt").innerHTML = "barrett@ruth:~$ ";
});
