const translations = {
    en: "Facebook Profile Checker",
    es: "Comprobador de Perfil de Facebook",
    fr: "Vérificateur de Profil Facebook",
    de: "Facebook-Profil Prüfer",
    it: "Controllo Profilo Facebook",
    pt: "Verificador de Perfil do Facebook",
    ru: "Проверка профиля Facebook",
    zh: "Facebook 个人资料检查器",
    ja: "Facebookプロフィールチェッカー",
    ar: "مدقق ملف تعريف فيسبوك",
    hi: "फेसबुक प्रोफ़ाइल चेकर",
    nl: "Facebook Profiel Checker",
    tr: "Facebook Profil Denetleyici",
    ko: "페이스북 프로필 검사기",
    vi: "Trình kiểm tra hồ sơ Facebook",
    th: "ตัวตรวจสอบโปรไฟล์ Facebook",
    id: "Pemeriksa Profil Facebook",
    pl: "Sprawdzanie profilu Facebook",
    sv: "Facebook-profilkontroll",
    uk: "Перевірка профілю Facebook",
    el: "Ελεγκτής προφίλ Facebook"
};

document.addEventListener("DOMContentLoaded", () => {
    let languageDropdown = document.getElementById("language");
    Object.keys(translations).forEach(lang => {
        let option = document.createElement("option");
        option.value = lang;
        option.textContent = translations[lang];
        languageDropdown.appendChild(option);
    });

    languageDropdown.addEventListener("change", changeLanguage);
    document.getElementById("darkModeToggle").addEventListener("change", toggleDarkMode);
});

function changeLanguage() {
    let lang = document.getElementById('language').value;
    document.getElementById('title').innerText = translations[lang];
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function checkProfile() {
    let userId = document.getElementById('userId').value;
    let resultDiv = document.getElementById('result');

    resultDiv.innerHTML = `<img src="assets/loader.gif" class="loader">`;

    let imgUrl = `https://graph.facebook.com/${userId}/picture?type=normal`;

    fetch(imgUrl).then(response => {
        setTimeout(() => {
            if (response.ok) {
                resultDiv.innerHTML = `<p style="color: #0f0;">✔ Alive</p><img src="${imgUrl}" alt="Profile Picture">`;
            } else {
                resultDiv.innerHTML = '<p style="color: red;">✖ Death</p>';
            }
        }, 1500);
    }).catch(() => {
        resultDiv.innerHTML = '<p style="color: red;">Error fetching data</p>';
    });
}
