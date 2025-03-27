const express = require('express');
const https = require('https');

const router = express.Router();

const checkFacebookAccount = (uid) => {
    return new Promise((resolve, reject) => {
        if (!uid) return reject({ status: 400, error: "UID is required" });

        const options = {
            hostname: 'graph.facebook.com',
            port: 443,
            path: `/${uid}/picture?type=normal`,
            method: 'GET',
            rejectUnauthorized: true,
        };

        https.get(options, (fbRes) => {
            if (fbRes.statusCode === 200 || fbRes.statusCode === 302) {
                resolve({ status: "Alive", message: "Account found. Starting checking process..." });
            } else if (fbRes.statusCode === 404) {
                resolve({ status: "Not Found", message: "Account not found." });
            } else {
                reject({ status: 500, error: `Unexpected response: ${fbRes.statusCode}` });
            }
        }).on('error', (error) => {
            reject({ status: 500, error: "Request failed", details: error.message });
        });
    });
};

router.get('/', async (req, res) => {
    const uid = req.query.uid;
    try {
        const result = await checkFacebookAccount(uid);
        res.status(result.status === "Alive" ? 200 : 404).json(result);
    } catch (error) {
        res.status(error.status || 500).json(error);
    }
});

router.get('/health', (req, res) => {
    res.status(200).json({ status: "OK" });
});

module.exports = router;
