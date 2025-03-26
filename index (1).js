const axios = require('axios');
const readline = require('readline');

// Create an interface for reading input from the user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to check if the Facebook UID is live
const checkFacebookLiveStatus = async (uid) => {
    try {
        // Fetch the profile picture data from Facebook Graph API
        const response = await axios.get(`https://graph.facebook.com/${uid}/picture?type=normal`);
        const res = response.data.toString();

        // Check if the response contains 'Photoshop' (indicating the profile is live)
        if (res.includes('Photoshop')) {
            console.log("The Facebook UID is Alive.");
        } else {
            console.log("The Facebook UID is Dead.");
        }
    } catch (error) {
        // Handle errors gracefully
        if (error.response && error.response.status === 404) {
            console.log("Error: The Facebook UID does not exist.");
        } else {
            console.log("Error fetching data: ", error.message);
        }
    }
};

// Prompt the user to enter a Facebook UID
rl.question("Enter Facebook UID: ", (uid) => {
    // Call the function to check the live status
    checkFacebookLiveStatus(uid);

    // Close the readline interface
    rl.close();
});