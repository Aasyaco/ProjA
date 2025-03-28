const express = require('express');
const https = require('https');
const fs = require('fs');
const NodeCache = require('node-cache');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
async function isMaliciousIP(ip) {
    try {
        const response = await axios.get(`https://api.abuseipdb.com/api/v2/check`, {
            params: { ipAddress: ip },
            headers: { 'Key': process.env.ABUSE_IPDB_API_KEY, 'Accept': 'application/json' }
        });
        return response.data.data.abuseConfidenceScore > 50;
    } catch (error) {
        return false;
    }
}

const ipBlacklist = new NodeCache({ stdTTL: 60 * 60 * 6 });
app.use(async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (ipBlacklist.get(ip)) {
        return res.status(403).json({ error: "Access denied (DDoS protection activated)" });
    }
    if (await isMaliciousIP(ip)) {
        ipBlacklist.set(ip, true);
        return res.status(403).json({ error: "Blocked: Malicious IP detected" });
    }
    next();
});

app.use((req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.status(403).json({ error: "HTTPS Required" });
    }
    if (req.headers['x-forwarded-for']) {
        const forwardedIps = req.headers['x-forwarded-for'].split(',').map(ip => ip.trim());
        if (forwardedIps.some(ip => ipBlacklist.get(ip))) {
            return res.status(403).json({ error: "Blocked: Suspicious proxy detected" });
        }
    }
    next();
});

app.use((req, res, next) => {
    const uid = req.query.uid;
    if (!uid || /[^a-zA-Z0-9]/.test(uid)) {
        return res.status(400).json({ error: "Invalid UID format" });
    }
    next();
});

const slowlorisProtection = new NodeCache({ stdTTL: 60 * 10 });
app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    let count = slowlorisProtection.get(ip) || 0;
    if (count > 5) {
        setTimeout(() => next(), 5000);
    } else {
        slowlorisProtection.set(ip, count + 1);
        next();
    }
});

app.get('/uid', async (req, res) => {
    try {
        const { uid } = req.query;
        const ip = req.ip || req.connection.remoteAddress;
        let requestCount = slowlorisProtection.get(ip) || 0;
        if (requestCount > 30) {
            ipBlacklist.set(ip, true);
            return res.status(403).json({ error: "Access blocked due to excessive suspicious activity" });
        }
        const options = {
            hostname: 'graph.facebook.com',
            path: `/${uid}/picture?type=normal`,
            method: 'GET',
            rejectUnauthorized: true,
        };
        https.get(options, (fbRes) => {
            if ([200, 302].includes(fbRes.statusCode)) {
                res.status(200).json({ status: "Alive", message: "Account alive." });
            } else if (fbRes.statusCode === 404) {
                res.status(404).json({ status: "Dead", message: "Account was death." });
            } else {
                res.status(500).json({ error: `Unexpected response from Facebook: ${fbRes.statusCode}` });
            }
        }).on('error', (error) => {
            res.status(500).json({ error: "Request failed", details: error.message });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
