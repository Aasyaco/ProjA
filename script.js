document.getElementById('checkForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const facebookId = document.getElementById('facebookId').value;
    const resultDiv = document.getElementById('result');

    // Simulate an API call to check the live status of the Facebook ID or URL
    setTimeout(() => {
        const isLive = Math.random() > 0.5; // Randomized result for demonstration
        if (isLive) {
            resultDiv.textContent = `The Facebook ID/URL "${facebookId}" is currently live.`;
            resultDiv.style.color = 'green';
            resultDiv.style.backgroundColor = '#d4edda';
        } else {
            resultDiv.textContent = `The Facebook ID/URL "${facebookId}" is not live.`;
            resultDiv.style.color = 'red';
            resultDiv.style.backgroundColor = '#f8d7da';
        }
    }, 1000);
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeStyle = document.getElementById('theme-style');

themeToggle.addEventListener('change', function() {
    if (themeToggle.checked) {
        themeStyle.setAttribute('href', 'styles-dark.css');
    } else {
        themeStyle.setAttribute('href', 'styles.css');
    }
});
