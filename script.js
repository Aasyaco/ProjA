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
    const url = `https://graph.facebook.com/${uid}/picture?type=normal`;

    fetch(url, { method: "HEAD", redirect: "manual" })
      .then(res => {
        if (res.status === 200 || res.status === 302) {
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

const languageSelect = document.getElementById("languageSelect");
const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Chinese", "Japanese",
  "Korean", "Hindi", "Arabic", "Bengali", "Dutch", "Greek", "Hebrew", "Indonesian", "Malay", "Polish",
  "Romanian", "Swedish", "Thai", "Turkish", "Ukrainian", "Vietnamese", "Czech", "Danish", "Finnish",
  "Hungarian", "Norwegian", "Slovak", "Slovenian", "Filipino", "Persian", "Swahili", "Tamil", "Telugu",
  "Urdu", "Bulgarian", "Croatian", "Estonian", "Latvian", "Lithuanian", "Serbian", "Afrikaans", "Zulu",
  "Catalan", "Icelandic", "Mongolian", "Pashto", "Punjabi"
];

languages.forEach(lang => {
  const option = document.createElement("option");
  option.value = lang.toLowerCase();
  option.textContent = lang;
  languageSelect.appendChild(option);
});

languageSelect.addEventListener("change", () => {
  const selected = languageSelect.value;
  alert("Auto-translation to " + selected + " is not active in demo.");
});
