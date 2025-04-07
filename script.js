const uidInput = document.getElementById('uidInput');
const aliveList = document.getElementById('aliveList');
const deadList = document.getElementById('deadList');
const aliveCount = document.getElementById('aliveCount');
const deadCount = document.getElementById('deadCount');
const loader = document.getElementById('loader');
const themeToggle = document.getElementById('themeToggle');
const languageSelect = document.getElementById('languageSelect');

const languages = {
  "English": "en", "Spanish": "es", "French": "fr", "German": "de", "Arabic": "ar",
  "Russian": "ru", "Hindi": "hi", "Chinese": "zh", "Japanese": "ja", "Korean": "ko",
  "Turkish": "tr", "Portuguese": "pt", "Italian": "it", "Dutch": "nl", "Indonesian": "id",
  "Vietnamese": "vi", "Thai": "th", "Malay": "ms", "Greek": "el", "Urdu": "ur",
  "Bengali": "bn", "Persian": "fa", "Hebrew": "he", "Swedish": "sv", "Polish": "pl",
  "Czech": "cs", "Romanian": "ro", "Finnish": "fi", "Ukrainian": "uk", "Hungarian": "hu",
  "Danish": "da", "Norwegian": "no", "Serbian": "sr", "Croatian": "hr", "Bulgarian": "bg",
  "Slovak": "sk", "Estonian": "et", "Latvian": "lv", "Lithuanian": "lt", "Filipino": "tl",
  "Swahili": "sw", "Tamil": "ta", "Telugu": "te", "Kannada": "kn", "Marathi": "mr",
  "Gujarati": "gu", "Punjabi": "pa", "Malayalam": "ml"
};

Object.keys(languages).forEach(name => {
  const opt = document.createElement("option");
  opt.value = languages[name];
  opt.text = name;
  languageSelect.appendChild(opt);
});
languageSelect.value = "en";

function checkUIDs() {
  loader.classList.remove('hidden');
  aliveList.innerHTML = '';
  deadList.innerHTML = '';
  aliveCount.textContent = 0;
  deadCount.textContent = 0;

  const uids = uidInput.value.split('\n').map(uid => uid.trim()).filter(Boolean);
  let alive = [], dead = [];

  let checked = 0;
  uids.forEach(uid => {
    fetch(`https://graph.facebook.com/${uid}/picture?type=normal`)
      .then(res => res.blob())
      .then(blob => {
        if (blob.type.includes("image")) {
          alive.push(uid);
        } else {
          dead.push(uid);
        }
      })
      .catch(() => dead.push(uid))
      .finally(() => {
        checked++;
        if (checked === uids.length) {
          loader.classList.add('hidden');
          alive.forEach(id => {
            const li = document.createElement('li');
            li.textContent = id;
            aliveList.appendChild(li);
          });
          dead.forEach(id => {
            const li = document.createElement('li');
            li.textContent = id;
            deadList.appendChild(li);
          });
          aliveCount.textContent = alive.length;
          deadCount.textContent = dead.length;
        }
      });
  });
}

function copyList(listId) {
  const text = Array.from(document.getElementById(listId).children).map(li => li.textContent).join('\n');
  navigator.clipboard.writeText(text);
}

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
};

languageSelect.onchange = () => {
  const lang = languageSelect.value;
  const current = document.documentElement.lang;
  if (lang !== current) {
    const url = `https://translate.google.com/translate?hl=${lang}&sl=${current}&tl=${lang}&u=${location.href}`;
    window.location.href = url;
  }
};
