document.addEventListener("DOMContentLoaded", () => {
    let languageDropdown = document.getElementById("language");
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                let option = document.createElement("option");
                option.value = country.languages ? Object.keys(country.languages)[0] : "en";
                option.textContent = country.name.common;
                languageDropdown.appendChild(option);
            });
        });
    
    languageDropdown.addEventListener("change", changeLanguage);
});

function changeLanguage() {
    let lang = document.getElementById('language').value;
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
    let userIds = document.getElementById('userIds').value.split("\n").map(uid => uid.trim()).filter(uid => uid);
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
        }).catch(() => {
            dead++;
            deadCount.textContent = dead;
            let li = document.createElement("li");
            li.textContent = uid;
            deadList.appendChild(li);
        });
    });
}
