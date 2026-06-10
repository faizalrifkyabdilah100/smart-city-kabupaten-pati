/**
 * Proxy Routes
 * =============
 * Proxy endpoint supaya frontend tidak perlu call API eksternal langsung.
 * Ini menyembunyikan IP internal dari client browser.
 * 
 * Endpoints:
 *   GET /api/traffic  → Proxy ke API traffic internet
 *   GET /api/servers  → Proxy ke API server monitoring 1
 *   GET /api/servers2 → Proxy ke API server monitoring 2
 *   GET /api/vm       → Proxy ke API VM monitoring
 *   GET /api/menara   → Proxy ke API data menara
 */

const express = require('express');
const router = express.Router();

/**
 * Helper: Proxy request ke URL eksternal dengan timeout
 */
async function proxyRequest(targetUrl, res, label) {
    if (!targetUrl) {
        return res.status(500).json({
            status: 500,
            messages: { error: `${label}: URL belum dikonfigurasi di .env` },
        });
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(targetUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error(`Proxy ${label} error:`, error.message);
        return res.status(502).json({
            status: 502,
            messages: { error: `${label}: Gagal terhubung ke API eksternal` },
        });
    }
}

// GET /api/traffic → Proxy ke API traffic internet
router.get('/traffic', (req, res) => {
    proxyRequest(process.env.TRAFFIC_API_URL, res, 'Traffic API');
});

// GET /api/servers → Proxy ke API server monitoring 1
router.get('/servers', (req, res) => {
    proxyRequest(process.env.SERVER_API_URL, res, 'Server API');
});

// GET /api/servers2 → Proxy ke API server monitoring 2
router.get('/servers2', (req, res) => {
    proxyRequest(process.env.SERVER_API_URL_2, res, 'Server API 2');
});

// GET /api/vm → Proxy ke API VM monitoring
router.get('/vm', (req, res) => {
    proxyRequest(process.env.VM_API_URL, res, 'VM API');
});

// GET /api/menara → Proxy ke API menara
router.get('/menara', (req, res) => {
    proxyRequest(process.env.MENARA_API_URL, res, 'Menara API');
});

module.exports = router;
