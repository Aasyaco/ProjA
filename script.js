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
        } else {
            resultDiv.textContent = `The Facebook ID/URL "${facebookId}" is not live.`;
            resultDiv.style.color = 'red';
        }
    }, 1000);
});