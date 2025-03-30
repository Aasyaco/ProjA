const translations = {
    en: { title: "Facebook Profile Checker", check: "Check", alive: "✅ Alive Accounts", dead: "❌ Dead Accounts" },
    es: { title: "Verificador de Perfiles de Facebook", check: "Verificar", alive: "✅ Cuentas Activas", dead: "❌ Cuentas Inactivas" },
    fr: { title: "Vérificateur de Profil Facebook", check: "Vérifier", alive: "✅ Comptes Actifs", dead: "❌ Comptes Inactifs" },
    de: { title: "Facebook-Profilprüfer", check: "Prüfen", alive: "✅ Aktive Konten", dead: "❌ Tote Konten" }
};

document.addEventListener("DOMContentLoaded", () => {
    let languageDropdown = document.getElementById("language");
    for (let lang in translations) {
        let option = document.createElement("option");
        option.value = lang;
        option.textContent = lang.toUpperCase();
        languageDropdown.appendChild(option);
    }
    languageDropdown.value = "en";
    languageDropdown.addEventListener("change", changeLanguage);
});

function changeLanguage() {
    let lang = document.getElementById('language').value;
    document.getElementById('title').innerText = translations[lang].title;
    document.getElementById('checkBtn').innerText = translations[lang].check;
    document.getElementById('aliveText').innerHTML = `${translations[lang].alive} (<span id="aliveCount">0</span>)`;
    document.getElementById('deadText').innerHTML = `${translations[lang].dead} (<span id="deadCount">0</span>)`;
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
