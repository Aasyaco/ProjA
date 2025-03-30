document.addEventListener("DOMContentLoaded", async () => {
    let languageDropdown = document.getElementById("language");
    let languages = await fetchLanguages();

    languages.forEach(lang => {
        let option = document.createElement("option");
        option.value = lang.code;
        option.textContent = lang.name;
        languageDropdown.appendChild(option);
    });

    languageDropdown.value = "en";
    languageDropdown.addEventListener("change", changeLanguage);

    let theme = localStorage.getItem("theme") || "light";
    document.body.classList.add(theme);
});

async function fetchLanguages() {
    let response = await fetch("https://restcountries.com/v3.1/all");
    let data = await response.json();
    let languageSet = new Set();

    data.forEach(country => {
        if (country.languages) {
            Object.entries(country.languages).forEach(([code, name]) => {
                languageSet.add({ code, name });
            });
        }
    });

    return Array.from(languageSet);
}

function changeLanguage() {
    let lang = document.getElementById("language").value;
    translatePage(lang);
}

function translatePage(lang) {
    let elements = document.querySelectorAll("[id]");
    elements.forEach(element => {
        fetch(`https://api.mymemory.translated.net/get?q=${element.innerText}&langpair=en|${lang}`)
            .then(response => response.json())
            .then(data => {
                if (data.responseData && data.responseData.translatedText) {
                    element.innerText = data.responseData.translatedText;
                }
            });
    });
}

function checkProfiles() {
    let userIds = document.getElementById("userIds").value.split("\n").map(uid => uid.trim()).filter(uid => uid);
    let aliveList = document.getElementById("aliveList");
    let deadList = document.getElementById("deadList");
    let aliveCount = document.getElementById("aliveCount");
    let deadCount = document.getElementById("deadCount");

    aliveList.innerHTML = "";
    deadList.innerHTML = "";
    aliveCount.textContent = "0";
    deadCount.textContent = "0";

    let alive = 0, dead = 0;

    userIds.forEach((uid, index) => {
        let imgUrl = `https://graph.facebook.com/${uid}/picture?type=normal`;

        fetch(imgUrl).then(response => {
            setTimeout(() => {
                if (response.ok) {
                    alive++;
                    aliveCount.textContent = alive;
                    let li = document.createElement("li");
                    li.textContent = uid;
                    aliveList.appendChild(li);
                } else {
                    dead++;
                    deadCount.textContent = dead;
                    let li = document.createElement("li");
                    li.textContent = uid;
                    deadList.appendChild(li);
                }
            }, 1000 * index);
        });
    });
}

function toggleTheme() {
    let body = document.body;
    body.classList.toggle("dark");
    let theme = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}
