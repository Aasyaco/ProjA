document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

function checkUIDs() {
  const input = document.getElementById("uidInput").value.trim().split("\n");
  const aliveList = document.getElementById("aliveList");
  const deadList = document.getElementById("deadList");
  const loader = document.getElementById("loader");

  aliveList.innerHTML = "";
  deadList.innerHTML = "";
  document.getElementById("aliveCount").textContent = "0";
  document.getElementById("deadCount").textContent = "0";
  loader.classList.remove("hidden");

  let alive = [];
  let dead = [];
  let processed = 0;

  input.forEach(uid => {
    fetch(`https://graph.facebook.com/${uid}/picture?type=normal`)
      .then(res => res.text())
      .then(text => {
        if (text.includes("Photoshop")) {
          alive.push(uid);
        } else {
          dead.push(uid);
        }
      })
      .catch(() => {
        dead.push(uid);
      })
      .finally(() => {
        processed++;
        if (processed === input.length) {
          alive.forEach(id => {
            const li = document.createElement("li");
            li.textContent = id;
            aliveList.appendChild(li);
          });
          dead.forEach(id => {
            const li = document.createElement("li");
            li.textContent = id;
            deadList.appendChild(li);
          });
          document.getElementById("aliveCount").textContent = alive.length;
          document.getElementById("deadCount").textContent = dead.length;
          loader.classList.add("hidden");
        }
      });
  });
}

function copyToClipboard(listId) {
  const list = document.getElementById(listId);
  const items = Array.from(list.querySelectorAll("li")).map(li => li.textContent.trim());
  const text = items.join("\n");
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}
