const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Semua proxy route memerlukan autentikasi
router.use(authMiddleware);

async function proxyRequest(targetUrl, res, label, timeoutMs = 10000) {
    if (!targetUrl) {
        return res.status(500).json({
            status: 500,
            messages: { error: `${label}: URL belum dikonfigurasi di .env` },
        });
    }

    let responseText = null;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(targetUrl, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' },
        });
        clearTimeout(timeout);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // Baca text dulu agar bisa di-log jika JSON.parse gagal
        responseText = await response.text();
        const data = JSON.parse(responseText);
        return res.json(data);
    } catch (error) {
        if (responseText !== null) {
            console.error(`Proxy ${label} — respons dari server:`, responseText.substring(0, 300));
        }
        console.error(`Proxy ${label} error:`, error.message);
        return res.status(502).json({
            status: 502,
            messages: { error: `${label}: Gagal terhubung ke API eksternal` },
        });
    }
}

router.get('/traffic', (req, res) => proxyRequest(process.env.TRAFFIC_API_URL, res, 'Traffic API'));
router.get('/servers', (req, res) => proxyRequest(process.env.SERVER_API_URL, res, 'Server API'));
// Timeout 90 detik — endpoint /vmlinux butuh waktu lama (30-60 detik) untuk respond
router.get('/servers2', (req, res) => proxyRequest(process.env.SERVER_API_URL_2, res, 'Server API 2', 90000));
router.get('/vm', (req, res) => proxyRequest(process.env.VM_API_URL, res, 'VM API'));
router.get('/menara', (req, res) => proxyRequest(process.env.MENARA_API_URL, res, 'Menara API'));

// GET /api/cctv — kembalikan daftar CCTV (IP tersimpan di .env, bukan di frontend)
router.get('/cctv', (req, res) => {
    const baseUrl = process.env.CCTV_BASE_URL;
    if (!baseUrl) {
        return res.status(500).json({
            status: 500,
            messages: { error: 'CCTV_BASE_URL belum dikonfigurasi di .env' },
        });
    }

    const mkUrl = (id) => `${baseUrl}/${id}.html?autoplay=true&mute=true`;

    const list = [
        { id: 1, name: 'CCTV 1 — Front Office',         location: 'Pelayanan Lantai 1',      streamUrl: mkUrl('5286aec5-e07e-49aa-89fe-fdad49c8e1ca') },
        { id: 2, name: 'CCTV 2 — Lobby Tangga',          location: 'Area Lobby & Tangga Utama', streamUrl: mkUrl('4fd477ce-4f96-4766-be8d-9b2321165633') },
        { id: 3, name: 'CCTV 3 — Lorong Lantai 2',       location: 'Akses Ruang Kerja Lt 2',   streamUrl: mkUrl('6bd6a6f1-8609-44eb-a30b-54c4e1f29357') },
        { id: 4, name: 'CCTV 4 — Ruang Server/Studio',   location: 'Area Teknis & Studio',     streamUrl: mkUrl('7fd9bcf9-26ed-44bf-803f-878d1025f1c3') },
        { id: 5, name: 'CCTV 5 — Area Parkir',           location: 'Halaman Parkir Belakang',  streamUrl: mkUrl('470da99b-d80a-489e-adc0-1c0f1d86837a') },
        { id: 6, name: 'CCTV 6 — Pintu Belakang',        location: 'Akses Keluar Belakang',    streamUrl: mkUrl('c85909da-cdcb-44ff-9987-1463da88f9b2') },
        { id: 7, name: 'CCTV 7 — Lobi Depan',            location: 'Lobi Depan',               streamUrl: mkUrl('dd2e2b25-ca72-4cb3-953c-6e3dd8ce2d1d') },
        { id: 8, name: 'CCTV 8 — Ruang Meeting',         location: 'Ruang Meeting',             streamUrl: mkUrl('47b3777c-5581-4557-b82c-b13e71ec4d0a') },
        { id: 9, name: 'CCTV 9 — Pintu Masuk Lantai 2',  location: 'Pintu Masuk Lantai 2',     streamUrl: mkUrl('32bc3695-3a64-41c7-a13b-59c5045f1d09') },
    ];

    return res.json({
        main: { location: 'Pelayanan Lantai 1', status: 'Live', streamUrl: list[0].streamUrl },
        list,
    });
});

module.exports = router;
