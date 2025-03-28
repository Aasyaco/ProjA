const https = require('https');
const VALID_TOKEN = "MO0XRD-ZRPL4O-9R0HJZ-9ZODEX-UMN7VW-3Q8FM2";
module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    const { uid, token } = req.query;
    if (!token || token !== VALID_TOKEN) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    if (!uid) {
        return res.status(400).json({ error: "UID is required" });
    }
    const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/${uid}/picture?type=normal`,
        method: 'GET',
        rejectUnauthorized: true,
    };
    https.get(options, (fbRes) => {
        if (fbRes.statusCode === 200 || fbRes.statusCode === 302) {
            res.status(200).json({ status: "Alive", message: "Account found." });
        } else if (fbRes.statusCode === 404) {
            res.status(404).json({ status: "Not Found", message: "Account not found." });
        } else {
            res.status(500).json({ error: `Unexpected response: ${fbRes.statusCode}` });
        }
    }).on('error', (error) => {
        res.status(500).json({ error: "Request failed", details: error.message });
    });
};
